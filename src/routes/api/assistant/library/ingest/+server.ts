import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

function isAuthorised(cookies: Cookies): boolean {
  const required = env.ADMIN_LIBRARY_KEY || '';
  if (!required) return false;
  const cookieKey = cookies.get('admin_library_key') || '';
  return cookieKey === required;
}

export const POST: RequestHandler = async ({ cookies /*, request*/ }) => {
  if (!isAuthorised(cookies)) throw error(403, 'Not authorised');

  // TODO: your existing ingest logic (upload files to OpenAI, attach to vector store, etc.)
  return new Response('OK');
};
