import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import OpenAI from "openai";

// Hard require Node runtime to avoid Edge 1MB body limits on form-data
export const config = { runtime: "nodejs20.x" };

// If you’ve already got these helpers, feel free to reuse; otherwise envs are fine here:
const APPROVED_STORE_ID = process.env.PRIVATE_ASSISTANT_APPROVED_STORE_ID || "";
if (!APPROVED_STORE_ID) {
  console.warn("[assistant/strict] Missing PRIVATE_ASSISTANT_APPROVED_STORE_ID");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Simple, very strict system rules.
// - Use UPLOADS first
// - If insufficient, try LIBRARY
// - Never invent numbers without citing doc+page
// - If still insufficient, ask user to upload the exact manual
const SYSTEM_RULES = `
You are a technical assistant for Aussie tradies. Your job is to answer using source documents with citations.

HARD RULES:
- Prefer USER UPLOADS first. Only if insufficient evidence, consult the SHARED LIBRARY.
- Do not use general knowledge for specifications, limits, values, ratings, or dimensions.
- If you cannot find precise figures in a document, do not guess. Say you need the relevant manual or section.
- Every numeric/spec answer must include inline citations with file name and page number(s).
- If you cite but cannot extract page numbers, explicitly say "page not shown in extracted text" and ask user to provide page or a better copy.

OUTPUT:
- Clear technical answer using bullet points where helpful.
- End with a short checklist.
`;

/**
 * Create an ephemeral store for the uploaded files (if any) and attach them.
 * Returns the vector store id or null if no files.
 */
async function makeEphemeralStoreForUploads(files: File[]) {
  if (!files?.length) return null;

  const store = await client.beta.vectorStores.create({ name: `session-${Date.now()}` });

  // Upload each file to the vector store
  for (const f of files) {
    // Limit types/size if you want: PDF/TXT up to ~15MB
    await client.beta.vectorStores.fileBatches.upload({
      vector_store_id: store.id,
      files: [f as any]
    });
  }
  return store.id;
}

// Helper to run a retrieval-only answer with given store ids.
// It refuses numeric/spec answers without citations.
async function answerWithStores(opts: {
  uploadsStoreId?: string | null;
  useLibrary: boolean;
  message: string;
  trade?: string;
  brandModel?: string;
}) {
  const { uploadsStoreId, useLibrary, message, trade, brandModel } = opts;

  const vector_store_ids: string[] = [];
  if (uploadsStoreId) vector_store_ids.push(uploadsStoreId);
  if (useLibrary && APPROVED_STORE_ID) vector_store_ids.push(APPROVED_STORE_ID);

  // Build a single request that forces tool use and low temperature
  const res = await client.responses.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    instructions: SYSTEM_RULES,
    tool_choice: "required",            // must consult retrieval
    tools: [{ type: "file_search" }],   // retrieval tool
    attachments: vector_store_ids.map((id) => ({
      vector_store_id: id,
      tools: [{ type: "file_search" }]
    })),
    input: [
      {
        role: "user",
        content: [
          { type: "text", text:
            [
              trade ? `Trade: ${trade}` : "",
              brandModel ? `Brand/Model/Standard: ${brandModel}` : "",
              `Question: ${message}`
            ].filter(Boolean).join("\n")
          }
        ]
      }
    ]
  });

  // Collate text from outputs
  let text = "";
  for (const item of res.output ?? []) {
    if (item.type === "message") {
      for (const part of item.content ?? []) {
        if (part.type === "text") text += part.text;
      }
    }
  }

  // Very simple guard: if user supplied uploads and nothing was cited, call it insufficient
  const cited = /\[(?:page|p)\s*\d+/i.test(text) || /page\s*\d+/i.test(text);
  return { text, cited };
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session } = await locals.safeGetSession();
  if (!session) throw redirect(303, "/login");

  // Accept both form-data (with files) and JSON (no files)
  const contentType = request.headers.get("content-type") || "";

  let message = "";
  let trade = "";
  let brandModel = "";
  let files: File[] = [];

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    message = String(form.get("message") ?? "");
    trade = String(form.get("trade") ?? "");
    brandModel = String(form.get("brand") ?? "");
    files = (form.getAll("files") as File[]).filter(Boolean);
  } else {
    const body = await request.json().catch(() => ({}));
    message = String(body.message ?? "");
    trade = String(body.trade ?? "");
    brandModel = String(body.brand ?? "");
    files = []; // JSON path doesn't carry files
  }

  if (!message && files.length === 0) {
    return json({ ok: false, error: "Please include message or files" }, { status: 400 });
  }

  // 1) Build ephemeral store for uploads (if any)
  const uploadsStoreId = await makeEphemeralStoreForUploads(files);

  // 2) Stage A: uploads only
  if (uploadsStoreId) {
    const a = await answerWithStores({ uploadsStoreId, useLibrary: false, message, trade, brandModel });
    if (a.cited) return json({ ok: true, mode: "uploads_only", answer: a.text });
  }

  // 3) Stage B: uploads + library (or library only if no uploads)
  const b = await answerWithStores({ uploadsStoreId: uploadsStoreId ?? null, useLibrary: true, message, trade, brandModel });
  if (b.cited) return json({ ok: true, mode: uploadsStoreId ? "uploads_plus_library" : "library_only", answer: b.text });

  // 4) Refuse rather than hallucinate
  const refuse =
    "I couldn’t find the exact specs in the documents I can access. " +
    "Please upload the specific manual or section (PDF/TXT), or tell me the exact page/figure number so I can cite it.";
  return json({ ok: false, mode: "insufficient_evidence", answer: refuse }, { status: 422 });
};
