/* Prototype RAG: on-the-fly files (no persistence).
   Force Node runtime for pdf-parse. Harden Responses API request/response handling.
*/
import type { RequestHandler } from "@sveltejs/kit";
import { env as privateEnv } from "$env/dynamic/private";

export const config = {
  runtime: 'nodejs20.x'
};

// Minimal chunking helpers
const CHUNK_SIZE = 1200; // chars
const CHUNK_OVERLAP = 150;

function chunkTextWithPages(text: string, pageFrom: number, pageTo: number) {
  const chunks: Array<{ text: string; page_from: number; page_to: number }> = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + CHUNK_SIZE);
    const part = text.slice(i, end);
    chunks.push({ text: part, page_from: pageFrom, page_to: pageTo });
    i += Math.max(1, CHUNK_SIZE - CHUNK_OVERLAP);
  }
  if (chunks.length === 0 && text.trim()) {
    chunks.push({ text, page_from: pageFrom, page_to: pageTo });
  }
  return chunks;
}

function cosineSim(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom ? dot / denom : 0;
}

async function embedTexts(texts: string[], apiKey: string) {
  const resp = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: texts
    })
  });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(`Embeddings failed: ${msg}`);
  }
  const json = await resp.json();
  return json.data.map((d: any) => d.embedding as number[]);
}

async function parsePdf(buffer: Uint8Array) {
  // Lazy import in Node runtime
  // @ts-expect-error types not bundled
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(Buffer.from(buffer), { pagerender: undefined });
  const raw = data.text || "";
  // Split by common page separators; fallback to single page
  const byPage = raw.split(/\f+|\n\s*Page\s+\d+\s*(?:of\s+\d+)?\s*\n/gi).filter(Boolean);
  return byPage.length ? byPage : [raw];
}

async function fileToText(file: File): Promise<{ name: string; parts: Array<{ text: string; page_from: number; page_to: number }> }> {
  const name = file.name || "upload";
  const type = file.type || "";
  const buf = new Uint8Array(await file.arrayBuffer());

  try {
    if (type === "application/pdf" || name.toLowerCase().endsWith(".pdf")) {
      const pages = await parsePdf(buf);
      let parts: Array<{ text: string; page_from: number; page_to: number }> = [];
      pages.forEach((p, idx) => {
        const pageNum = idx + 1;
        parts = parts.concat(chunkTextWithPages(p, pageNum, pageNum));
      });
      return { name, parts };
    }

    if (type.startsWith("text/") || name.toLowerCase().endsWith(".txt") || name.toLowerCase().endsWith(".md")) {
      const text = new TextDecoder().decode(buf);
      return { name, parts: chunkTextWithPages(text, 1, 1) };
    }
  } catch (e: any) {
    console.error("fileToText error for", name, e);
  }

  return { name, parts: [] };
}

// Extract text from various Responses API shapes
function extractTextFromResponses(resJson: any): string {
  if (!resJson) return "";
  // Helper sometimes present
  if (typeof resJson.output_text === "string" && resJson.output_text.trim()) {
    return resJson.output_text;
  }
  // Newer "output" array with content parts
  if (Array.isArray(resJson.output)) {
    const texts: string[] = [];
    for (const item of resJson.output) {
      const parts = item?.content || item?.contents || [];
      for (const p of parts) {
        if (p?.type === "output_text" && typeof p?.text === "string") texts.push(p.text);
        if (p?.type === "text" && typeof p?.text === "string") texts.push(p.text);
      }
    }
    if (texts.length) return texts.join("\n");
  }
  // Legacy-like "content"
  if (Array.isArray(resJson.content)) {
    const first = resJson.content.find((c: any) => typeof c?.text === "string");
    if (first?.text) return first.text;
  }
  return "";
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!privateEnv.OPENAI_API_KEY) {
      return new Response("Missing OPENAI_API_KEY", { status: 500 });
    }

    const ctype = request.headers.get("content-type") || "";
    if (!ctype.includes("multipart/form-data")) {
      return new Response("Send multipart/form-data with fields: message, (optional) trade, brand, model, and files[]", { status: 400 });
    }

    const form = await request.formData();
    const message = (form.get("message") as string || "").trim();
    const trade = (form.get("trade") as string || "").trim();
    const brand = (form.get("brand") as string || "").trim();
    const model = (form.get("model") as string || "").trim();
    if (!message) {
      return new Response("Please include a question in 'message'.", { status: 400 });
    }

    // Parse uploads
    const files = form.getAll("files").filter((f) => f instanceof File) as File[];
    const allParts: Array<{ doc: string; text: string; page_from: number; page_to: number }> = [];
    for (const f of files) {
      const { name, parts } = await fileToText(f);
      for (const p of parts) {
        if (p.text && p.text.trim()) {
          allParts.push({ doc: name, text: p.text, page_from: p.page_from, page_to: p.page_to });
        }
      }
    }

    // Limit for prototype
    const MAX_PARTS = 120;
    const partsLimited = allParts.slice(0, MAX_PARTS);

    // Embed
    let partEmbeddings: number[][] = [];
    let queryEmbedding: number[] = [];
    try {
      if (partsLimited.length > 0) {
        partEmbeddings = await embedTexts(partsLimited.map((p) => p.text), privateEnv.OPENAI_API_KEY);
      }
      const q = [message, trade && `Trade: ${trade}`, brand && `Brand: ${brand}`, model && `Model: ${model}`]
        .filter(Boolean).join("\n");
      queryEmbedding = (await embedTexts([q], privateEnv.OPENAI_API_KEY))[0];
    } catch (e: any) {
      console.error("Embedding error", e);
      return new Response(`Embedding error: ${e?.message || e}`, { status: 500 });
    }

    // Rank (keep even low scores to avoid empty context)
    const scored = partsLimited.map((p, i) => ({
      idx: i,
      score: partEmbeddings[i] ? cosineSim(queryEmbedding, partEmbeddings[i]) : -1,
      ...p
    }));
    scored.sort((a, b) => b.score - a.score);

    const TOP_K = 8;
    const top = scored.slice(0, TOP_K);

    // Build grounded prompt
    const contextBlocks = top.map((s, i) => {
      const id = i + 1;
      const page = s.page_from === s.page_to ? `p.${s.page_from}` : `p.${s.page_from}-${s.page_to}`;
      const head = `[${id}] ${s.doc} ${page}`;
      return `${head}\n${s.text}`;
    });

    const SYSTEM = `You are an Australian trade assistant.
Use ONLY the provided context for technical facts. If a key fact is not present, say you are unsure and suggest how to verify safely.
Always include safety/compliance if relevant. Prefer step-by-step, practical guidance.
Cite sources inline like [1], [2] that match the numbered context blocks.`;

    const USER = [
      trade ? `Trade: ${trade}` : null,
      brand ? `Brand: ${brand}` : null,
      model ? `Model: ${model}` : null,
      `Question: ${message}`
    ].filter(Boolean).join("\n");

    const FINAL_PROMPT = [
      top.length > 0
        ? "Context blocks (numbered for citation):"
        : "No context uploaded for this question. If you cannot verify, say you're unsure and suggest next steps.",
      contextBlocks.join("\n\n"),
      "Task: Answer strictly based on the context above. If context is insufficient, say so. Provide a brief checklist. Include citations like [1]."
    ].filter(Boolean).join("\n\n");

    // ✅ Send a single combined string in "input", which the Responses API reliably understands
    const combined = `${SYSTEM}\n\n---\n\n${USER}\n\n---\n\n${FINAL_PROMPT}`;

    let text = "";
    try {
      const resp = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${privateEnv.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: combined,
          temperature: 0.2,
          response_format: { type: "text" }
        })
      });

      if (!resp.ok) {
        const msg = await resp.text();
        console.error("OpenAI Responses error", msg);
        return new Response(`OpenAI error: ${msg}`, { status: 500 });
      }

      const data = await resp.json();
      text = extractTextFromResponses(data);
      if (!text || !text.trim()) {
        // Fallback: stringify minimal info to help debug
        text = "Sorry — I couldn't produce an answer from the uploaded context. Try adding a manual or specifying brand/model.";
      }
    } catch (e: any) {
      console.error("Responses API error", e);
      return new Response(`Responses API error: ${e?.message || e}`, { status: 500 });
    }

    return new Response(text, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (outer: any) {
    console.error("Unhandled /api/assistant error", outer);
    return new Response(`Internal error: ${outer?.message || outer}`, { status: 500 });
  }
};
