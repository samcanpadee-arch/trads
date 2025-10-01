import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import OpenAI from "openai";
import { getApprovedStoreId } from "$lib/server/assistant_stores";

async function requireAdmin(locals: App.Locals) {
  const { session, user } = await locals.safeGetSession();
  if (!session) throw redirect(303, "/login");
  const { data: profile } = await locals.supabaseServiceRole
    .from("profiles").select("is_admin").eq("id", user!.id).single();
  return !!profile?.is_admin;
}

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!(await requireAdmin(locals))) return json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const file_id = String(body.file_id || "");
  if (!file_id) return json({ error: "file_id required" }, { status: 400 });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const approvedId = getApprovedStoreId();

  await client.beta.vectorStores.files.create(approvedId, {
    file_id,
    metadata: { source: "promoted", public: true }
  });

  return json({ ok: true, promoted_to: approvedId, file_id });
};
