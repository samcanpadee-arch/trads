import type { RequestHandler } from "@sveltejs/kit";
import { env as privateEnv } from "$env/dynamic/private";
// @ts-ignore: registry file may be missing in fresh setups
import registry from "$lib/vectorstores.json";

// --- Helpers (trimmed & stable) ---
async function uploadFileToOpenAI(file: File, apiKey: string): Promise<{ id: string; filename: string }> {
  const form = new FormData();
  form.append("purpose", "assistants");
  form.append("file", file, file.name);
  const r = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });
  if (!r.ok) throw new Error(`OpenAI file upload failed: ${await r.text()}`);
  const j = await r.json();
  return { id: j.id, filename: j.filename ?? file.name };
}

async function createVectorStore(apiKey: string, name: string): Promise<string> {
  const r = await fetch("https://api.openai.com/v1/vector_stores", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  if (!r.ok) throw new Error(`Create vector store failed: ${await r.text()}`);
  const j = await r.json();
  return j.id as string;
}

async function attachFile(apiKey: string, vectorStoreId: string, fileId: string) {
  const r = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId })
  });
  if (!r.ok) throw new Error(`Attach file failed: ${await r.text()}`);
}

async function waitIndexed(apiKey: string, vectorStoreId: string, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const r = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files?limit=100`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (!r.ok) throw new Error(`Poll vector store failed: ${await r.text()}`);
    const j = await r.json();
    const files = (j.data ?? []) as Array<any>;
    if (files.length && !files.find((f) => f.status !== "completed")) return;
    await new Promise((res) => setTimeout(res, 600));
  }
}

// --- Handler ---
export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!privateEnv.OPENAI_API_KEY) {
      return new Response("Missing OPENAI_API_KEY", { status: 500 });
    }

    const ctype = request.headers.get("content-type") || "";
    if (!ctype.includes("multipart/form-data")) {
      return new Response("Send multipart/form-data with fields: message, optional trade, optional brand, optional files[]", { status: 400 });
    }

    const form = await request.formData();
    const message = (form.get("message") as string | null)?.trim() || "";
    const trade = (form.get("trade") as string | null)?.trim() || "";
    const brand = (form.get("brand") as string | null)?.trim() || "";
    const files = form.getAll("files").filter((f) => f instanceof File) as File[];

    if (!message) return new Response("Please include a question in 'message'.", { status: 400 });

    // Temp vector store from uploads (if any)
    let tempVs: string | null = null;
    if (files.length) {
      tempVs = await createVectorStore(privateEnv.OPENAI_API_KEY, `session-${Date.now()}`);
      for (const f of files) {
        const up = await uploadFileToOpenAI(f, privateEnv.OPENAI_API_KEY);
        await attachFile(privateEnv.OPENAI_API_KEY, tempVs, up.id);
      }
      await waitIndexed(privateEnv.OPENAI_API_KEY, tempVs);
    }

    // Library stores from registry (optional)
    const libIds: string[] = Array.isArray(registry?.library_store_ids) ? registry.library_store_ids.filter(Boolean) : [];

    const vector_store_ids = [...libIds];
    if (tempVs) vector_store_ids.push(tempVs);

    const SYSTEM = `
You are a technical assistant for experienced Australian tradies.
- Use retrieved manuals/standards when available.
- When you rely on a document, cite inline like: [1] Document Name, p. 12 (or section).
- If you cannot find an exact value in provided/retrieved docs, say so plainly. Do NOT invent numbers.
- Otherwise, you may answer from general knowledge (but still avoid specific numbers if not grounded).
- Keep answers practical and technical. End with a brief checklist.
`.trim();

    const userText = [
      trade ? `Trade: ${trade}` : null,
      brand ? `Brand/Model or Standard: ${brand}` : null,
      `Question: ${message}`
    ].filter(Boolean).join("\n");

    // Build tools (simple file_search only if we have any vector stores)
    const tools: any[] = vector_store_ids.length ? [{ type: "file_search", vector_store_ids }] : [];

    // Call Responses API (simple, no text.format)
    const r = await fetch("https://api.openai.com/v1/responses", {
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
        tool_choice: "auto",
        temperature: 0.2
      })
    });

    if (!r.ok) {
      const msg = await r.text();
      return new Response(`OpenAI error: ${msg}`, { status: 500 });
    }

    const data = await r.json();
    const out =
      (typeof data.output_text === "string" && data.output_text.trim()) ||
      // fallback: try to stitch text parts
      (Array.isArray(data.output)
        ? data.output
            .flatMap((o: any) => (o?.content || []))
            .filter((c: any) => typeof c?.text === "string")
            .map((c: any) => c.text)
            .join("\n")
        : "");

    return new Response(out || "No answer.", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  } catch (e: any) {
    console.error("Assistant simple handler error", e);
    return new Response(`Internal Error`, { status: 500 });
  }
};
