import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import { getApprovedStoreId } from "$lib/server/assistant_stores";

// NOTE: Query only. Uploads are handled elsewhere.
// Blends: (1) user-uploaded files, (2) shared library vector store, (3) general model.
// Bias to user files. Enforce SOURCE guardrails.

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session } = await locals.safeGetSession();
  if (!session) throw redirect(303, "/login");

  const body = await request.json().catch(() => ({}));
  const prompt: string = String(body.prompt || "");
  const trade: string = String(body.trade || "");
  const brand: string = String(body.brand || "");
  const file_ids: string[] = Array.isArray(body.file_ids) ? body.file_ids.filter(Boolean) : [];

  if (!prompt) return json({ error: "prompt required" }, { status: 400 });

  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const libraryId = getApprovedStoreId();

  // Attach BOTH: user files (if any) + approved library store
  const attachments: any[] = [];
  if (file_ids.length > 0) {
    for (const id of file_ids) attachments.push({ file_id: id });
  }
  attachments.push({ vector_store_ids: [libraryId] });

  const systemLines: string[] = [
    "You are a technical assistant for Australian tradies.",
    "If the user attached files, **use them first**. Prefer user files over any other source when answering specifics.",
    "Also use the shared library of manuals/standards, and general knowledge **only to connect dots** — do not contradict the documents.",
    "",
    "At the very first line, output exactly one of:",
    "  - SOURCE: MANUAL",
    "  - SOURCE: GENERAL",
    "",
    "If SOURCE: GENERAL, do NOT give hard numbers/specs. Give process-level guidance only.",
    "If you must give any numbers/specs, you **must** cite a manual with page/section — otherwise avoid numeric claims.",
    "",
    "Always cite the documents you used (file name and page/section if possible).",
    "End with a short checklist of actionable steps."
  ];

  const contextPrefix =
    [trade && `Trade: ${trade}`, brand && `Brand/Model/Standard: ${brand}`]
      .filter(Boolean)
      .join("\n");

  const res = await client.responses.create({
    model: "gpt-4.1-mini",
    input: contextPrefix ? `${contextPrefix}\n\nQuestion: ${prompt}` : prompt,
    attachments,
    tools: [{ type: "file_search" }],
    system: systemLines.join("\n")
  });

  return json({ ok: true, response: res });
};
