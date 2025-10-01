import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabaseServiceRole } }) => {
  const { session, user } = await safeGetSession();
  if (!session) throw redirect(303, "/login");

  const { data: profile } = await supabaseServiceRole
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw redirect(303, "/account/assistant");

  const { data: rows } = await supabaseServiceRole
    .from('user_documents')
    .select('document_id, documents(id, file_name, mime_type, canonical_path, uploaded_at)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  const items = (rows ?? []).map(r => r.documents);
  return { allowed: true, items };
};
