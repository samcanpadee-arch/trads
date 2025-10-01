import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import OpenAI from "openai";
import { getApprovedStoreId } from "$lib/server/assistant_stores";

async function requireAdmin(locals: App.Locals) {
  const { session, user } = await locals.safeGetSession();
  if (!session) throw redirect(303, "/login");
  const { data: profile } = await locals.supabaseServiceRole
    .from("profiles")
    .select("is_admin")
    .eq("id", user!.id)
    .single();
  return !!profile?.is_admin;
}

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!(await requireAdmin(locals))) return json({ error: "Forbidden" }, { status: 403 });

  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return json({ error: "file missing" }, { status: 400 });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const storeId = getApprovedStoreId();

  const res = await client.beta.vectorStores.files.upload(storeId, file, {
    metadata: { source: "admin_library", public: true }
  });

  return json({ ok: true, file_id: res.id, store_id: storeId });
};
