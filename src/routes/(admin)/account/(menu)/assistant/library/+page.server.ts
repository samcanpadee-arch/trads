import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { ADMIN_EMAILS } from '$lib/config/admin';

export const load: PageServerLoad = async (event) => {
  const localsAny = event.locals as any;

  // Supabase helpers typically put the user on locals.session.user
  const email: string | undefined =
    localsAny?.session?.user?.email ??
    localsAny?.user?.email ??
    undefined;

  if (!email) {
    throw redirect(302, '/login?next=/account/assistant/library');
  }

  if (!ADMIN_EMAILS.has(email)) {
    throw error(403, 'Forbidden: admin only');
  }

  return {};
};
