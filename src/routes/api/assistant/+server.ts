import type { RequestHandler } from "@sveltejs/kit";
import { env as privateEnv } from "$env/dynamic/private";
import crypto from "node:crypto";
// @ts-ignore
import registry from "$lib/vectorstores.json";

export const config = { runtime: 'nodejs20.x' };

/* ================= utils ================= */

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

/* ================= constants (performance caps) ================= */

const SERVER_MAX_TOTAL_BYTES = 4 * 1024 * 1024; // 4 MB total
const SERVER_MAX_FILES = 4;                      // at most 4 files

/* ================= handler ================= */

const SPEC_UNIT_RE = /\b\d+(\.\d+)?\s*(mm|cm|m|Nm|N·m|N-m|°C|°F|A|V|kV|kW|W|Pa|kPa|MPa|bar|psi|Hz|dB|%|°|kg|g|L|min|s)\b/;

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { session, user } = await locals.safeGetSession();
    if (!session || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const API = privateEnv.OPENAI_API_KEY;
    if (!API) return new Response("Missing OPENAI_API_KEY", { status: 500 });

    const ctype = request.headers.get("content-type") || "";
    if (!ctype.includes("multipart/form-data")) {
      return new Response("Send multipart/form-data with fields: message and optional trade, brand, model, files[], share", { status: 400 });
    }

    const form = await request.formData();
    const message = (form.get("message") as string || "").trim();
    const trade = (form.get("trade") as string || "").trim();
    const brand = (form.get("brand") as string || "").trim(); // combined brand/model input in UI
    const model = (form.get("model") as string || "").trim(); // optional
    const shareRaw = String(form.get("share") ?? "");
    const share = /^(on|true|1|yes)$/i.test(shareRaw);

    if (!message) return new Response("Please include a question in 'message'.", { status: 400 });

    // Collect files but ignore zero-byte or unnamed placeholders some browsers send
    const __raw = form.getAll("files").filter((x) => x instanceof File) as File[];
    const files = __raw.filter(f => (f?.size || 0) > 0 && (f?.name || "").trim() !== "");

    // Server-side sanity guard (protects from 413 / oversized payloads)
    if (files.length > SERVER_MAX_FILES) {
      return new Response(`Too many files: max ${SERVER_MAX_FILES}`, { status: 400 });
    }
    let totalBytes = 0;
    for (const f of files) totalBytes += (f.size || 0);
    if (totalBytes > SERVER_MAX_TOTAL_BYTES) {
      return new Response("Uploads exceed 4MB total. Please remove files or compress.", { status: 400 });
    }

    // Upload or reuse files with stable hashed filename
    const uploaded: Array<{ id: string; filename: string; hash: string; originalName: string }> = [];
    for (const f of files) {
      const hash = await sha256OfFile(f);
      const stableName = `${hash}-${f.name}`;
      let fileId = await findFileByStableName(API, stableName);
      if (!fileId) {
        const up = await uploadToOpenAIWithStableName(f, API, stableName);
        fileId = up.id;
      }
      uploaded.push({ id: fileId, filename: stableName, hash, originalName: f.name });
    }

    // Temp per-request store for uploaded files
    let tempVectorStoreId: string | null = null;
    if (uploaded.length) {
      tempVectorStoreId = await createVectorStore(API, `session-${Date.now()}`);
      for (const u of uploaded) await attachFileToVectorStore(API, tempVectorStoreId, u.id);
      await waitForIndexing(API, tempVectorStoreId);
    }

    // Library stores from registry JSON (approved store IDs)
    const libraryIds: string[] = Array.isArray(registry?.library_store_ids)
      ? registry.library_store_ids.filter(Boolean)
      : [];

    // If opted-in, attach uploaded files to all library stores
    try {
      const approvedId = privateEnv.PRIVATE_ASSISTANT_APPROVED_STORE_ID || "";
      console.log(`[assistant] share=${share} files=${uploaded.length} approved=${approvedId || "none"}`);
      if (share && approvedId && uploaded.length) {
        for (const u of uploaded) {
          try { await attachFileToVectorStore(API, approvedId, u.id); } catch (e) { console.warn("attach approved failed", e); }
        }
      }
    } catch {}

    // Strict system rules
    const SYSTEM =
`You are a technical assistant for experienced Australian tradies.

GROUNDING & CITATIONS (MANDATORY RULES):
1) If you used retrieved manual/standard content, your FIRST LINE must be exactly: "SOURCE: MANUAL".
   - Include inline citations like [<short doc>, p.<page>] or [<short doc>, §<clause>].
   - Do NOT fabricate page/section numbers. If unknown, write [<doc>, page unknown] and say so briefly.
2) If no relevant content was retrieved or applicable, your FIRST LINE must be exactly: "SOURCE: GENERAL".
   - Do NOT provide exact specifications (numbers with units) in GENERAL mode.
   - If asked for exact values while in GENERAL, explain you cannot provide numeric specs without a manual citation.

ATTACHMENT PRIORITY:
- When user-uploaded documents exist, search them before consulting the shared library.
- Prefer citing user uploads first; only rely on the library if the uploads don't cover the request.
- Cite user uploads as [user upload: <original filename>, p.<page>].

STYLE:
- Be concise but technical. Safety/compliance notes where relevant.
- End with a short checklist.`;

    const userText = [
      trade ? `Trade: ${trade}` : null,
      brand ? `Brand/Model or Standard: ${brand}` : null,
      model ? `Model: ${model}` : null,
      `Question: ${message}`,
      uploaded.length
        ? [
            "User uploaded documents (highest priority, cite as [user upload: <original name>, p.X]):",
            ...uploaded.map((u) => `- ${u.originalName} (stored internally as ${u.filename})`)
          ].join("\n")
        : null,
      "Task:",
      "- Provide detailed, technical guidance.",
      "- If exact values/specs are requested, only provide them when grounded in retrieved text (with page/section citation).",
      "- Otherwise explain that specs require a cited manual/standard.",
      "- End with a short checklist."
    ].filter(Boolean).join("\n");

    // Build vector_store_ids: libraries + temp
    const vsIds: string[] = [];
    if (tempVectorStoreId) vsIds.push(tempVectorStoreId);
    if (Array.isArray(libraryIds) && libraryIds.length) vsIds.push(...libraryIds);
    const uniqueVsIds = Array.from(new Set(vsIds));

    // Tools config
    const tools: any[] = [];
    if (uniqueVsIds.length) tools.push({ type: "file_search", vector_store_ids: uniqueVsIds });

    // Call Responses API
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: [{ type: "input_text", text: SYSTEM }] },
          { role: "user", content: [{ type: "input_text", text: userText }] }
        ],
        tools,
        tool_choice: (uniqueVsIds.length ? "required" : "auto"),
        temperature: 0.1
      })
    });

    if (!resp.ok) {
      const msg = await resp.text();
      console.error("OpenAI Responses error", msg);
      return new Response(`OpenAI error: ${msg}`, { status: 500 });
    }

    const data = await resp.json();
    let text = extractTextFromResponses(data).trim();

    // Determine source flag from first line
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

    // HARD GUARD: if GENERAL and numeric specs present, refuse to provide numbers
    if (sourceFlag !== "MANUAL" && SPEC_UNIT_RE.test(text)) {
      const refusal = [
        "⚠️ No relevant manual context retrieved — answering from general knowledge.",
        "I can’t provide exact specifications (numbers/units) without citing a manual or standard.",
        "Please attach or reference the installation/standard document, and I’ll give precise values with page/section citations."
      ].join("\n");
      return new Response(refusal, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    // SOFT NUDGE: if MANUAL but no hint of a page/clause pattern, add a reminder note
    if (sourceFlag === "MANUAL" && !/\bp\.\s*\d+|\b§\s*\d+/.test(text)) {
      text += "\n\n_Note: please verify page/section in the cited document if not shown explicitly above._";
    }

    return new Response(text, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (outer: any) {
    console.error("Unhandled /api/assistant error", outer);
    return new Response(`Internal error: ${outer?.message || outer}`, { status: 500 });
  }
};
