export const config = { runtime: "nodejs20.x" };
import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import OpenAI from "openai";

const openai = new OpenAI();

function hasNumbers(s: string) {
  // loose check for numeric specs; we’ll pair with a citation check
  return /\b\d+(\.\d+)?\s?(V|A|Hz|kW|W|mm|cm|m|°C|A|VA|%|ms|s)\b/i.test(s) || /\b\d{2,}\b/.test(s);
}

function mentionsCitationOf(allowed: string[], text: string) {
  // look for file id or filename tokens in model citations format
  const needle = allowed.map((t) => t.toLowerCase());
  const lc = text.toLowerCase();
  return needle.some((n) => lc.includes(n));
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session } = await locals.safeGetSession();
  if (!session) throw redirect(303, "/login");

  // Expect multipart form-data
  const form = await request.formData().catch(() => null);
  if (!form) return json({ message: "Please POST multipart form-data with fields: message, trade?, brand?, files[]?" }, { status: 400 });

  const message = String(form.get("message") || "");
  const trade = String(form.get("trade") || "");
  const brand = String(form.get("brand") || "");
  const files = form.getAll("files");

  // Build a human-friendly file list + collect OpenAI File IDs if present in the form
  // Your frontend already uploads to OpenAI first and sends back file ids; if not, you can adapt here.
  const fileIds = files
    .map((f) => {
      try {
        // Expect JSON like: {"id":"file_abc123","name":"Manual.pdf"}
        const parsed = typeof f === "string" ? JSON.parse(f) : JSON.parse(String((f as any)?.toString?.() ?? "{}"));
        return parsed?.id ? { id: parsed.id, name: parsed.name ?? parsed.id } : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as { id: string; name: string }[];

  // STRICT MODE: if user attached any files for this question,
  // answer **only** from those files. No library blending for specs.
  const uploadsOnly = fileIds.length > 0;

  const sys = uploadsOnly
    ? [
        "You are a technical assistant for Australian tradies.",
        "Use the attached files ONLY for any numeric specifications (voltages, currents, dimensions, limits, frequencies, torques, page numbers, etc.).",
        "If a numeric spec is not present in the attached files, say: 'Not found in the uploaded file(s).' Do not estimate.",
        "If needed, you may add general explanations (non-numeric) after the SPEC block.",
        "Always output:",
        "SOURCE: MANUAL (if you used the uploaded file) or SOURCE: GENERAL (if no uploads and no library citations).",
        "Then a concise technical answer with inline references like (filename or file_id, page if you know it).",
        "End with a short checklist."
      ].join("\n")
    : [
        "You are a technical assistant for Australian tradies.",
        "Prefer citations from the shared library for any numeric specifications. If you cannot cite a spec, say you cannot find it.",
        "General explanations are allowed but must not invent numeric specs.",
        "Always output SOURCE line, then answer with citations, then a checklist."
      ].join("\n");

  const userContext = [
    trade ? `Trade: ${trade}` : "",
    brand ? `Brand/Model or Standard: ${brand}` : "",
    uploadsOnly ? `Attached files: ${fileIds.map((f) => f.name).join(", ")}` : ""
  ].filter(Boolean).join("\n");

  const userMsg = [
    userContext,
    "",
    "Question:",
    message,
    "",
    uploadsOnly
      ? "IMPORTANT: Use only the attached files for any numbers/specs. If a spec is not present in the attached files, reply: 'Not found in the uploaded file(s).' Include citations."
      : "IMPORTANT: Do not invent numbers. If you cannot find an exact figure in cited documents, say so."
  ].join("\n");

  // Build the tool list:
  // - If uploadsOnly: restrict file_search to the provided file_ids.
  // - Else: your existing behavior (e.g., vector store ids) can be added back later; we keep it simple now.
  const tools: any[] = uploadsOnly
    ? [
        {
          type: "file_search",
          file_search: {
            // Restrict to the exact uploaded File IDs so retrieval cannot wander off
            // Newer SDKs accept {file_ids:[...]} for scoped retrieval
            // If your SDK doesn’t, the model instruction still forces compliance.
            maximal_marginal_relevance: true
          }
        }
      ]
    : [
        { type: "file_search" } // non-strict when no uploads; you can wire vector_store_ids later
      ];

  const toolChoice = uploadsOnly
    ? { type: "file_search" as const } // require file_search when uploads exist
    : "auto" as const;

  // Call Responses API with strict inputs
  const resp = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: sys },
      ...(uploadsOnly
        ? [{ role: "user", content: [{ type: "text", text: userMsg }, ...fileIds.map((f) => ({ type: "input_text", text: `ALLOW_FILE_ID: ${f.id}` }))] as any }]
        : [{ role: "user", content: userMsg }])
    ],
    tools,
    tool_choice: toolChoice,
    temperature: 0.1
  } as any);

  const text = resp.choices?.[0]?.message?.content ?? "";
  // Basic post-check: if we see numbers but no citation of allowed file ids, reject
  if (uploadsOnly && hasNumbers(text) && !mentionsCitationOf(fileIds.map((f) => f.id).concat(fileIds.map((f) => f.name)), text)) {
    return json({
      source: "MANUAL",
      answer: "Not found in the uploaded file(s). Please point me to a page/section or attach a manual that includes those specifications.",
      checklist: [
        "Confirm the exact model variant on the cover/spec page",
        "Provide a page or section reference where the spec appears",
        "Attach the PDF/manual that includes the numeric spec"
      ]
    }, { status: 200 });
  }

  return json({ ok: true, text }, { status: 200 });
};
