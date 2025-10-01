import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import OpenAI from "openai";
import { getPendingStoreId } from "$lib/server/assistant_stores";
import { getUserTier } from "$lib/server/subscription_tiers";

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) throw redirect(303, "/login");

  // Gate: uploads are Pro-only (adjust if you want Standard to upload too)
  const tier = await getUserTier(locals);
  if (tier !== "pro") return json({ error: "Upgrade to Pro to upload documents" }, { status: 403 });

  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return json({ error: "file missing" }, { status: 400 });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const storeId = getPendingStoreId();

  // Upload into PENDING store (OpenAI dedupes and may return "reused")
  const res = await client.beta.vectorStores.files.upload(storeId, file, {
    metadata: {
      source: "user_upload",
      uploader_id: user.id,
      public: false
    }
  });

  return json({ ok: true, file_id: res.id, store_id: storeId });
};
