import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import { getApprovedStoreId, getPendingStoreId } from "$lib/server/assistant_stores";

async function requireAdmin(locals: App.Locals) {
  const { session, user } = await locals.safeGetSession();
  if (!session) throw redirect(303, "/login");
  const { data: profile } = await locals.supabaseServiceRole
    .from("profiles").select("is_admin").eq("id", user!.id).single();
  return !!profile?.is_admin;
}

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!(await requireAdmin(locals))) return new Response("Forbidden", { status: 403 });

  const storeParam = url.searchParams.get("store") || "approved";
  const storeId = storeParam === "pending" ? getPendingStoreId() : getApprovedStoreId();

  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const files: any[] = [];
  // Iterate all pages (max 100 per page)
  for await (const page of client.beta.vectorStores.files.list(storeId, { limit: 100 }).iteratePages()) {
    files.push(...page.data);
  }

  return json({ store: storeParam, store_id: storeId, files });
};
