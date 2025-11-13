import type { Cookies, RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import registry from '$lib/vectorstores.json' assert { type: 'json' };

// ---- Auth via ADMIN_LIBRARY_KEY cookie (same as the page guard) ----
function isAuthorised(cookies: Cookies): boolean {
  const required = env.ADMIN_LIBRARY_KEY || '';
  if (!required) return false;
  const cookieKey = cookies.get('admin_library_key') || '';
  return cookieKey === required;
}

// ---- Helpers ----
async function uploadFileToOpenAI(apiKey: string, file: File) {
  const form = new FormData();
  form.append('purpose', 'assistants');
  form.append('file', file, file.name);

  const r = await fetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });
  if (!r.ok) throw new Error(`OpenAI file upload failed: ${await r.text()}`);
  return await r.json();
}

async function attachFileToVectorStore(apiKey: string, vectorStoreId: string, fileId: string) {
  const r = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ file_id: fileId })
  });
  if (!r.ok) throw new Error(`Attach to vector store failed: ${await r.text()}`);
  return await r.json();
}

// ---- POST /api/assistant/library/ingest ----
export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    if (!isAuthorised(cookies)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Not authorised' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const API_KEY = env.OPENAI_API_KEY;
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing OPENAI_API_KEY' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ctype = request.headers.get('content-type') || '';
    if (!ctype.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Send multipart/form-data with files[] and optional vectorStoreId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const form = await request.formData();
    const files = form.getAll('files').filter((f) => f instanceof File) as File[];
    if (!files.length) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No files provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Choose vector store:
    // 1) explicit vectorStoreId from form
    // 2) first ID from $lib/vectorstores.json (library_store_ids)
    // 3) env.MASTER_VECTOR_STORE_ID
    const explicit = (form.get('vectorStoreId') as string)?.trim();
    const fromRegistry = Array.isArray(registry?.library_store_ids)
      ? registry.library_store_ids[0]
      : undefined;
    const fallback = env.MASTER_VECTOR_STORE_ID;
    const vectorStoreId = explicit || fromRegistry || fallback;

    if (!vectorStoreId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No vector store id available (vectorStoreId, registry.library_store_ids[0], or MASTER_VECTOR_STORE_ID)' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const uploaded: Array<{ id: string; filename: string }> = [];
    for (const f of files) {
      const up = await uploadFileToOpenAI(API_KEY, f);
      uploaded.push({ id: up.id, filename: up.filename ?? f.name });
      await attachFileToVectorStore(API_KEY, vectorStoreId, up.id);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        vectorStoreId,
        files: uploaded,
        message: `Uploaded and attached ${uploaded.length} file(s).`
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
