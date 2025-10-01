import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import { getPendingStoreId } from "$lib/server/assistant_stores";

async function requireAdmin(locals: App.Locals) {
  const { session, user } = await locals.safeGetSession();
  if (!session) throw redirect(303, "/login");
  const { data: profile } = await locals.supabaseServiceRole
    .from("profiles").select("is_admin").eq("id", user!.id).single();
  return !!profile?.is_admin;
}

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!(await requireAdmin(locals))) return json({ error: "Forbidden" }, { status: 403 });

  const { file_id } = await request.json().catch(() => ({}));
  if (!file_id) return json({ error: "file_id required" }, { status: 400 });

  const pendingId = getPendingStoreId();

  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  // Remove the association from PENDING (does not delete the underlying File globally)
  await client.beta.vectorStores.files.del(pendingId, file_id);

  return json({ ok: true, removed_from: pendingId, file_id });
};
