import type { RequestHandler } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';

const BUCKET_ID = 'chat-images';

function buildPath(userId: string, filename: string): string {
  const ext = filename.includes('.') ? filename.split('.').pop() : undefined;
  const suffix = ext ? `.${ext}` : '';
  return `${userId}/${Date.now()}-${randomUUID()}${suffix}`;
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return new Response('file is required', { status: 400 });
  }

  const supabase = locals.supabaseServiceRole;
  if (!supabase) {
    return new Response('Storage unavailable', { status: 500 });
  }

  try {
    // Ensure the bucket exists (ignore conflict errors)
    await supabase.storage.createBucket(BUCKET_ID, {
      public: true,
      fileSizeLimit: 20 * 1024 * 1024 // 20MB limit for images
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : `${err}`;
    if (!msg.toLowerCase().includes('exists')) {
      console.warn('[upload] failed to ensure bucket', msg);
    }
  }

  const path = buildPath(user.id, file.name || 'capture.jpg');
  const uploadResult = await supabase.storage.from(BUCKET_ID).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type || 'application/octet-stream',
    upsert: false
  });

  if (uploadResult.error) {
    console.error('[upload] upload failed', uploadResult.error);
    return new Response('Failed to upload file', { status: 500 });
  }

  const publicUrl = supabase.storage.from(BUCKET_ID).getPublicUrl(path);
  const url = publicUrl.data.publicUrl;

  return new Response(
    JSON.stringify({
      url,
      pathname: path,
      contentType: file.type
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
