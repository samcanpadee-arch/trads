import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ cookies, url }) => {
  const required = env.ADMIN_LIBRARY_KEY || '';
  if (!required) throw error(500, 'Missing ADMIN_LIBRARY_KEY');

  const cookieKey = cookies.get('admin_library_key') || '';
  if (cookieKey === required) {
    return {};
  }

  // One-time bootstrap: allow ?key=... to set the cookie
  const q = url.searchParams.get('key');
  if (q && q === required) {
    cookies.set('admin_library_key', q, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    throw redirect(303, url.pathname);
  }

  throw error(403, 'Not authorised');
};
