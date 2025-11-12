import type { RequestHandler } from "@sveltejs/kit";
import { env as privateEnv } from "$env/dynamic/private";
import type { SupabaseClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
// @ts-ignore
import registry from "$lib/vectorstores.json";
import type { Database } from "../../../DatabaseDefinitions";

export const config = { runtime: 'nodejs20.x' };

type ServiceSupabase = SupabaseClient<Database>;

function readPositiveNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const SESSION_VECTOR_TTL_HOURS = readPositiveNumber(privateEnv.ASSISTANT_SESSION_VECTOR_TTL_HOURS, 12);
const SESSION_VECTOR_EXPIRE_DAYS = readPositiveNumber(privateEnv.ASSISTANT_SESSION_VECTOR_EXPIRE_DAYS, 7);

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

type CachedFile = {
  file_id: string;
  original_name: string | null;
  size_bytes: number | null;
};

async function getCachedFile(
  supabase: ServiceSupabase | undefined,
  stableName: string
): Promise<CachedFile | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("openai_file_cache")
      .select("file_id, original_name, size_bytes")
      .eq("stable_name", stableName)
      .maybeSingle();
    if (error) {
      console.warn("[assistant] openai_file_cache lookup failed", error);
      return null;
    }
    return data ?? null;
  } catch (err) {
    console.warn("[assistant] openai_file_cache lookup threw", err);
    return null;
  }
}

async function upsertCachedFile(
  supabase: ServiceSupabase | undefined,
  stableName: string,
  fileId: string,
  originalName: string,
  sizeBytes: number
): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase.from("openai_file_cache").upsert({
      stable_name: stableName,
      file_id: fileId,
      original_name: originalName,
      size_bytes: Number.isFinite(sizeBytes) ? sizeBytes : null,
      updated_at: new Date().toISOString(),
    });
    if (error) console.warn("[assistant] openai_file_cache upsert failed", error);
  } catch (err) {
    console.warn("[assistant] openai_file_cache upsert threw", err);
  }
}

type SessionVectorRow = {
  vector_store_id: string;
  last_used_at: string;
};

async function getSessionVectorStore(
  supabase: ServiceSupabase | undefined,
  scopeId: string
): Promise<SessionVectorRow | null> {
  if (!supabase || !scopeId) return null;
  try {
    const { data, error } = await supabase
      .from("assistant_vector_sessions")
      .select("vector_store_id, last_used_at")
      .eq("scope_id", scopeId)
      .maybeSingle();
    if (error) {
      console.warn("[assistant] session vector lookup failed", error);
      return null;
    }
    return data ?? null;
  } catch (err) {
    console.warn("[assistant] session vector lookup threw", err);
    return null;
  }
}

async function upsertSessionVectorStore(
  supabase: ServiceSupabase | undefined,
  scopeId: string,
  userId: string | null,
  vectorStoreId: string
): Promise<void> {
  if (!supabase || !scopeId) return;
  try {
    const { error } = await supabase.from("assistant_vector_sessions").upsert({
      scope_id: scopeId,
      user_id: userId,
      vector_store_id: vectorStoreId,
      last_used_at: new Date().toISOString(),
    });
    if (error) console.warn("[assistant] session vector upsert failed", error);
  } catch (err) {
    console.warn("[assistant] session vector upsert threw", err);
  }
}

function isSessionVectorExpired(lastUsedAt: string | null): boolean {
  if (!lastUsedAt) return true;
  const last = Date.parse(lastUsedAt);
  if (Number.isNaN(last)) return true;
  const ttlMs = SESSION_VECTOR_TTL_HOURS * 3600 * 1000;
  return Date.now() - last > ttlMs;
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

async function createVectorStore(apiKey: string, name: string, expiresAfterDays?: number): Promise<string> {
  const resp = await fetch("https://api.openai.com/v1/vector_stores", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      ...(Number.isFinite(expiresAfterDays) && (expiresAfterDays || 0) > 0
        ? { expires_after: { anchor: "last_active_at", days: expiresAfterDays } }
        : {}),
    })
  });
  if (!resp.ok) throw new Error(`Create vector store failed: ${await resp.text()}`);
  const json = await resp.json();
  return json.id as string;
}

async function attachFileToVectorStore(apiKey: string, vectorStoreId: string, fileId: string): Promise<boolean> {
  const resp = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId })
  });
  if (resp.ok) return true;
  const msg = await resp.text();
  if (resp.status === 400 || resp.status === 409) {
    if (/already\s+(added|exists)/i.test(msg)) return false;
  }
  throw new Error(`Attach file to vector store failed: ${msg}`);
}

async function listVectorStoreFiles(apiKey: string, vectorStoreId: string): Promise<Array<{ file_id: string; status: string }>> {
  const resp = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files?limit=200`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  if (!resp.ok) throw new Error(`Vector store poll failed: ${await resp.text()}`);
  const json = await resp.json();
  const files = Array.isArray(json.data) ? json.data : [];
  return files.map((f: any) => ({ file_id: f?.file_id || f?.id || "", status: f?.status || "" }));
}

async function waitForIndexing(apiKey: string, vectorStoreId: string, expectedFileIds: string[], timeoutMs = 20000): Promise<void> {
  if (!expectedFileIds.length) return;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const files = await listVectorStoreFiles(apiKey, vectorStoreId);
    if (files.length) {
      const relevant = files.filter((f) => expectedFileIds.includes(f.file_id));
      if (relevant.length === expectedFileIds.length) {
        const pending = relevant.find((f) => f.status !== "completed");
        if (!pending) return;
      }
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

    const supabase = locals.supabaseServiceRole as ServiceSupabase | undefined;

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
    const uploaded: Array<{
      id: string;
      filename: string;
      hash: string;
      originalName: string;
      file: File;
      size: number;
    }> = [];
    for (const f of files) {
      const hash = await sha256OfFile(f);
      const stableName = `${hash}-${f.name}`;
      const size = Number(f.size || 0);
      let fileId: string | null = null;
      const cached = await getCachedFile(supabase, stableName);
      if (cached?.file_id) fileId = cached.file_id;
      if (!fileId) {
        fileId = await findFileByStableName(API, stableName);
      }
      if (!fileId) {
        const up = await uploadToOpenAIWithStableName(f, API, stableName);
        fileId = up.id;
      }
      await upsertCachedFile(supabase, stableName, fileId, f.name, size);
      uploaded.push({ id: fileId, filename: stableName, hash, originalName: f.name, file: f, size });
    }

    // Temp per-request store for uploaded files
    let tempVectorStoreId: string | null = null;
    if (uploaded.length) {
      const scopeKey = user.id;
      const userId = user.id;
      let reusable: SessionVectorRow | null = null;
      if (scopeKey) {
        const row = await getSessionVectorStore(supabase, scopeKey);
        if (row && !isSessionVectorExpired(row.last_used_at)) {
          reusable = row;
        }
      }

      if (reusable) {
        tempVectorStoreId = reusable.vector_store_id;
      } else {
        tempVectorStoreId = await createVectorStore(API, `session-${scopeKey || Date.now()}`, SESSION_VECTOR_EXPIRE_DAYS);
        if (scopeKey) await upsertSessionVectorStore(supabase, scopeKey, userId, tempVectorStoreId);
      }

      let existingIds = new Set<string>();
      if (tempVectorStoreId) {
        try {
          const existingFiles = await listVectorStoreFiles(API, tempVectorStoreId);
          existingIds = new Set(existingFiles.map((f) => f.file_id).filter(Boolean));
        } catch (err) {
          console.warn("[assistant] vector store list failed, recreating", err);
          tempVectorStoreId = await createVectorStore(API, `session-${scopeKey || Date.now()}`, SESSION_VECTOR_EXPIRE_DAYS);
          existingIds = new Set();
          if (scopeKey) await upsertSessionVectorStore(supabase, scopeKey, userId, tempVectorStoreId);
        }
      }

      const toAttach = uploaded.filter((u) => !existingIds.has(u.id));
      const waitFor: string[] = [];
      for (const u of toAttach) {
        if (!tempVectorStoreId) break;
        try {
          const attached = await attachFileToVectorStore(API, tempVectorStoreId, u.id);
          if (attached) {
            waitFor.push(u.id);
          }
        } catch (err: any) {
          const msg = String(err?.message || err);
          if (/not\s+found/i.test(msg) || /no such file/i.test(msg)) {
            const up = await uploadToOpenAIWithStableName(u.file, API, u.filename);
            u.id = up.id;
            await upsertCachedFile(supabase, u.filename, u.id, u.originalName, u.size);
            const attached = await attachFileToVectorStore(API, tempVectorStoreId, u.id);
            if (attached) waitFor.push(u.id);
          } else {
            throw err;
          }
        }
      }
      if (tempVectorStoreId && waitFor.length) {
        await waitForIndexing(API, tempVectorStoreId, waitFor);
      }
      if (scopeKey && tempVectorStoreId) {
        await upsertSessionVectorStore(supabase, scopeKey, userId, tempVectorStoreId);
      }
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
