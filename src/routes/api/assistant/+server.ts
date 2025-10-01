import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import { getPendingStoreId } from "$lib/server/assistant_stores";
import { getUserTier } from "$lib/server/subscription_tiers";

const FILE_FIELD_CANDIDATES = ["file", "files", "files[]", "upload", "document", "documents"];

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) throw redirect(303, "/login");

  // Gate: uploads are Pro-only (adjust to allow Standard if desired)
  const tier = await getUserTier(locals);
  if (tier !== "pro") return json({ error: "Upgrade to Pro to upload documents" }, { status: 403 });

  const ctype = request.headers.get("content-type") || "";

  // If the client sent JSON (e.g., only metadata), don't error — just acknowledge
  if (ctype.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    const allowShare = !!body?.allow_share;
    return json({ ok: true, uploaded: [], consent: allowShare, note: "no files in JSON body" });
  }

  // Expect form-data for file uploads, but be tolerant if there are no files
  const form = await request.formData().catch(() => null);
  if (!form) return json({ ok: true, uploaded: [], note: "no form-data" });

  const allowShare =
    String(form.get("allow_share") ?? "").toLowerCase() === "true" ||
    String(form.get("consent") ?? "").toLowerCase() === "true";

  // Collect any File objects from common field names AND from all fields
  const picked: File[] = [];
  for (const name of FILE_FIELD_CANDIDATES) {
    const v = form.getAll(name);
    for (const item of v) {
      if (item instanceof File && item.size > 0) picked.push(item);
    }
  }
  // Also scan all form entries in case the UI used a different name
  for (const [, value] of form.entries()) {
    if (value instanceof File && value.size > 0) picked.push(value);
  }

  // Deduplicate file objects in case they were picked twice
  const files = Array.from(new Set(picked));

  // If no files provided, do NOT 400 — just succeed with uploaded: []
  if (files.length === 0) {
    return json({ ok: true, uploaded: [], consent: allowShare, note: "no files attached" });
  }

  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const storeId = getPendingStoreId();

  const uploaded: { file_id: string; reused?: boolean }[] = [];
  for (const file of files) {
    // OpenAI dedupes automatically; response may reflect reuse internally
    const res = await client.beta.vectorStores.files.upload(storeId, file, {
      metadata: {
        source: "user_upload",
        uploader_id: user.id,
        public: false,
        consent: allowShare
      }
    });
    uploaded.push({ file_id: res.id });
  }

  return json({ ok: true, store_id: storeId, consent: allowShare, uploaded });
};
