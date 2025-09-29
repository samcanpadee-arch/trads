import type { RequestHandler } from "@sveltejs/kit";
import { env as privateEnv } from "$env/dynamic/private";
import crypto from "node:crypto";
// @ts-ignore
import registry from "$lib/vectorstores.json";

export const config = { runtime: "nodejs20.x" };

async function sha256OfFile(file: File): Promise<string> {
  const hash = crypto.createHash("sha256");
  // @ts-ignore Node 20 File.stream
  const reader = file.stream().getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) hash.update(value);
  }
  return hash.digest("hex");
}

async function listAllFiles(apiKey: string): Promise<any[]> {
  const out: any[] = [];
  let after: string | null = null;
  for (let i = 0; i < 50; i++) {
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
  const f = all.find((x: any) => (x.filename || x.name) === stableName);
  return f?.id ?? null;
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

async function attachFileToVectorStore(apiKey: string, vectorStoreId: string, fileId: string): Promise<void> {
  const resp = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId })
  });
  if (!resp.ok) throw new Error(`Attach file to vector store failed: ${await resp.text()}`);
}

async function waitForFileIndexing(apiKey: string, vectorStoreId: string, fileId: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const r = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files?limit=100`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (!r.ok) throw new Error(`Vector store poll failed: ${await r.text()}`);
    const j = await r.json();
    const arr = (j.data || []) as any[];
    const me = arr.find((x) => x.id === fileId);
    if (me && me.status === "completed") return;
    await new Promise((res) => setTimeout(res, 800));
  }
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const apiKey = privateEnv.OPENAI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), { status: 500 });

    const libs: string[] = Array.isArray(registry?.library_store_ids) ? registry.library_store_ids.filter(Boolean) : [];
    if (!libs.length) return new Response(JSON.stringify({ error: "No library_store_ids configured in src/lib/vectorstores.json" }), { status: 500 });

    const ctype = request.headers.get("content-type") || "";
    if (!ctype.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Send multipart/form-data with files[]" }), { status: 400 });
    }

    const form = await request.formData();
    const files = form.getAll("files").filter((f) => f instanceof File) as File[];
    if (!files.length) return new Response(JSON.stringify({ error: "No files provided" }), { status: 400 });

    const results: any[] = [];

    for (const f of files) {
      const hash = await sha256OfFile(f);
      const stableName = `${hash}-${f.name}`;
      let fileId = await findFileByStableName(apiKey, stableName);
      let action = "reused";
      if (!fileId) {
        const up = await uploadToOpenAIWithStableName(f, apiKey, stableName);
        fileId = up.id;
        action = "uploaded";
      }

      // attach to all configured libraries
      for (const vsId of libs) {
        await attachFileToVectorStore(apiKey, vsId, fileId);
        // wait (best-effort) for indexing for this specific file
        try { await waitForFileIndexing(apiKey, vsId, fileId, 20000); } catch {}
      }

      results.push({ name: f.name, file_id: fileId, action, attached_to: libs });
    }

    return new Response(JSON.stringify({ ok: true, results }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("Uploader error", e);
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
