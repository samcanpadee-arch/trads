import type { RequestHandler } from "@sveltejs/kit";
import { env as privateEnv } from "$env/dynamic/private";
import crypto from "node:crypto";
// @ts-ignore
import registry from "$lib/vectorstores.json";

export const config = { runtime: 'nodejs20.x' };

async function sha256OfFile(file: File): Promise<string> {
  const hash = crypto.createHash('sha256');
  // @ts-ignore Node 20 File.stream
  const reader = file.stream().getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) hash.update(value);
  }
  return hash.digest('hex');
}

async function listAllFiles(apiKey: string): Promise<any[]> {
  const out: any[] = [];
  let after: string | null = null;
  for (let i = 0; i < 20; i++) {
    const url = new URL("https://api.openai.com/v1/files");
    if (after) url.searchParams.set("after", after);
    const r = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!r.ok) throw new Error(`Files list failed: ${await r.text()}`);
    const j = await r.json();
    const arr = Array.isArray(j.data) ? j.data : [];
    out.push(...arr);
    if (!j.has_more || !arr.length) break;
    after = arr[arr.length - 1]?.id;
  }
  return out;
}

async function findFileByStableName(apiKey: string, stableName: string): Promise<string | null> {
  const all = await listAllFiles(apiKey);
  const match = all.find((f: any) => (f.filename || f.name) === stableName);
  return match?.id ?? null;
}

async function uploadToOpenAIWithStableName(file: File, apiKey: string, stableName: string): Promise<{ id: string; filename: string }> {
  const form = new FormData();
  form.append("purpose", "assistants");
  form.append("file", file, stableName);
  const resp = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });
  if (!resp.ok) throw new Error(`OpenAI file upload failed: ${await resp.text()}`);
  const json = await resp.json();
  return { id: json.id as string, filename: (json.filename as string) || stableName };
}

async function createVectorStore(apiKey: string, name: string): Promise<string> {
  const resp = await fetch("https://api.openai.com/v1/vector_stores", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  if (!resp.ok) throw new Error(`Create vector store failed: ${await resp.text()}`);
  const json = await resp.json();
  return json.id as string;
}

async function attachFileToVectorStore(apiKey: string, vectorStoreId: string, fileId: string): Promise<void> {
  const resp = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId })
  });
  if (!resp.ok) throw new Error(`Attach file to vector store failed: ${await resp.text()}`);
}

async function waitForIndexing(apiKey: string, vectorStoreId: string, timeoutMs = 20000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const resp = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files?limit=100`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (!resp.ok) throw new Error(`Vector store poll failed: ${await resp.text()}`);
    const json = await resp.json();
    const files = (json.data || []) as Array<any>;
    if (files.length) {
      const pending = files.find((f) => f.status !== "completed");
      if (!pending) return;
    }
    await new Promise((r) => setTimeout(r, 700));
  }
}

function extractTextFromResponses(resJson: any): string {
  if (!resJson) return "";
  if (typeof resJson.output_text === "string" && resJson.output_text.trim()) return resJson.output_text;
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
  if (Array.isArray(resJson.content)) {
    const first = resJson.content.find((c: any) => typeof c?.text === "string");
    if (first?.text) return first.text;
  }
  return "";
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!privateEnv.OPENAI_API_KEY) return new Response("Missing OPENAI_API_KEY", { status: 500 });

    const ctype = request.headers.get("content-type") || "";
    if (!ctype.includes("multipart/form-data")) {
      return new Response("Send multipart/form-data with fields: message and optional trade, brand, model, files[], share", { status: 400 });
    }

    const form = await request.formData();
    const message = (form.get("message") as string || "").trim();
    const trade = (form.get("trade") as string || "").trim();
    const brand = (form.get("brand") as string || "").trim();   // combined brand/model field in UI
    const model = (form.get("model") as string || "").trim();   // (unused)
    const share = ((form.get("share") as string) || "off") === "on";

    if (!message) return new Response("Please include a question in 'message'.", { status: 400 });

    // Upload or reuse files with stable hashed filename
    const files = form.getAll("files").filter((f) => f instanceof File) as File[];
    const uploaded: Array<{ id: string; filename: string; hash: string }> = [];
    for (const f of files) {
      const hash = await sha256OfFile(f);
      const stableName = `${hash}-${f.name}`;
      let fileId = await findFileByStableName(privateEnv.OPENAI_API_KEY, stableName);
      if (!fileId) {
        const up = await uploadToOpenAIWithStableName(f, privateEnv.OPENAI_API_KEY, stableName);
        fileId = up.id;
      }
      uploaded.push({ id: fileId, filename: stableName, hash });
    }

    // Temp per-request store for uploaded files
    let tempVectorStoreId: string | null = null;
    if (uploaded.length) {
      tempVectorStoreId = await createVectorStore(privateEnv.OPENAI_API_KEY, `session-${Date.now()}`);
      for (const u of uploaded) await attachFileToVectorStore(privateEnv.OPENAI_API_KEY, tempVectorStoreId, u.id);
      await waitForIndexing(privateEnv.OPENAI_API_KEY, tempVectorStoreId);
    }

    // Library stores from registry JSON
    const libraryIds: string[] = Array.isArray(registry?.library_store_ids) ? registry.library_store_ids.filter(Boolean) : [];

    // If opted-in, attach uploaded files to all library stores
    if (share && uploaded.length && libraryIds.length) {
      for (const libId of libraryIds) {
        for (const u of uploaded) {
          try { await attachFileToVectorStore(privateEnv.OPENAI_API_KEY, libId, u.id); } catch {}
        }
      }
    }

    // STRICT system instruction to prevent false citations
    const SYSTEM = `
You are a technical assistant for experienced Australian tradies.
You have access to file_search over manuals/standards. STRICT RULES:
1) If you used any retrieved manual/standard content in your answer, your FIRST LINE must be exactly: "SOURCE: MANUAL".
2) If no relevant content was retrieved or you are answering from general knowledge, your FIRST LINE must be exactly: "SOURCE: GENERAL".
3) NEVER fabricate citations. Only cite when grounded in retrieved text.
4) When grounded, include inline citations like [<short doc>, p.<page>] or [<short doc>, §<clause>]. If page/clause unknown from snippet, write [<doc>, page unknown] and say so briefly.
5) If SOURCE: GENERAL, do NOT include any fabricated citations. You may add a brief note to verify against official manuals before use.
Always include safety/compliance notes when relevant, and end with a short checklist.
`.trim();

    const userText = [
      trade ? `Trade: ${trade}` : null,
      brand ? `Brand/Model or Standard: ${brand}` : null,
      model ? `Model: ${model}` : null,
      `Question: ${message}`,
      "Task:",
      "- Answer in technical detail (assume trade knowledge).",
      "- Follow the SOURCE rules above.",
      "- Provide precise values only when grounded; otherwise clearly mark as general guidance.",
      "- End with a short checklist."
    ].filter(Boolean).join("\n");

    // Build vector_store_ids: libraries + temp
    const vsIds = [...libraryIds];
    if (tempVectorStoreId) vsIds.push(tempVectorStoreId);

    const tools: any[] = [];
    if (vsIds.length) tools.push({ type: "file_search", vector_store_ids: Array.from(new Set(vsIds)) });

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${privateEnv.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: [{ type: "input_text", text: SYSTEM }] },
          { role: "user", content: [{ type: "input_text", text: userText }] }
        ],
        tools,
        tool_choice: (vsIds.length ? "file_search" : "auto"),
        temperature: 0.2
      })
    });

    if (!resp.ok) {
      const msg = await resp.text();
      console.error("OpenAI Responses error", msg);
      return new Response(`OpenAI error: ${msg}`, { status: 500 });
    }

    const data = await resp.json();
    let text = extractTextFromResponses(data).trim();

    // Guardrail: derive source flag from first line
    let sourceFlag = "GENERAL";
    const lines = text.split("\n");
    if (lines[0]?.toUpperCase().includes("SOURCE: MANUAL")) {
      sourceFlag = "MANUAL";
      lines.shift();
    } else if (lines[0]?.toUpperCase().includes("SOURCE: GENERAL")) {
      sourceFlag = "GENERAL";
      lines.shift();
    }
    text = lines.join("\n").trim();

    // If general, prepend a clear banner (no citations allowed)
    if (sourceFlag !== "MANUAL") {
      text = [
        "⚠️ No relevant manual context retrieved — answering from general knowledge. Please verify against official documentation.",
        "",
        text
      ].join("\n");
    }

    return new Response(text, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (outer: any) {
    console.error("Unhandled /api/assistant error", outer);
    return new Response(`Internal error: ${outer?.message || outer}`, { status: 500 });
  }
};
