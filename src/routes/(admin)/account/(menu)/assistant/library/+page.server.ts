import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabaseServiceRole } }) => {
  const { session, user } = await safeGetSession();
  if (!session) throw redirect(303, "/login");

  // Server-side check via service role; no hardcoded emails
  const { data: profile } = await supabaseServiceRole
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw redirect(303, "/account/assistant");
  return {};
};
