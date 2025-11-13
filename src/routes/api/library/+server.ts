import type { RequestHandler } from "./$types";
import { json, redirect } from "@sveltejs/kit";
import { createHash } from "crypto";

/** Require login + admin or user-level as you prefer; here we allow any logged-in user */
async function requireUser(locals: App.Locals) {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) throw redirect(303, "/login");
  return user;
}

function sha256HexBuffer(buf: ArrayBuffer): string {
  const h = createHash('sha256');
  h.update(Buffer.from(buf));
  return h.digest('hex');
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const user = await requireUser(locals);
  const { supabaseServiceRole } = locals;

  const form = await request.formData();
  const file = form.get('file') as File | null;
  if (!file) return json({ error: 'file missing' }, { status: 400 });

  // hash (server-trusted)
  const buf = await file.arrayBuffer();
  const serverHash = sha256HexBuffer(buf);

  // client-provided hash (optional)
  const clientHash = (form.get('file_hash') as string | null) ?? null;
  if (clientHash && clientHash !== serverHash) {
    // not fatal, but warn
    console.warn('client hash mismatch; using server hash');
  }

  const file_hash = serverHash;
  const file_name = file.name;
  const size_bytes = file.size;
  const mime_type = file.type || null;

  // Is there already a canonical document for this hash?
  const { data: existingDocs, error: qErr } = await supabaseServiceRole
    .from('documents')
    .select('id, canonical_path')
    .eq('file_hash', file_hash)
    .limit(1);

  let document_id: string;
  let canonical_path: string;

  if (!qErr && existingDocs && existingDocs.length > 0) {
    // Reuse canonical file; just link the user to existing document
    document_id = existingDocs[0].id;
    canonical_path = existingDocs[0].canonical_path;

    // Link user -> document (idempotent)
    await supabaseServiceRole
      .from('user_documents')
      .upsert({ user_id: user.id, document_id }, { onConflict: 'user_id,document_id' });
  } else {
    // New canonical object path: library/<first2>/<hash>/<filename>
    const prefix = file_hash.slice(0, 2);
    canonical_path = `library/${prefix}/${file_hash}/${file_name}`;

    // Upload to Supabase Storage (bucket: 'library')
    // NOTE: You likely already have a storage client; here we call RPC or use Supabase JS
    const { error: upErr } = await supabaseServiceRole.storage
      .from('library')
      .upload(canonical_path.replace(/^library\//, ''), Buffer.from(buf), {
        contentType: mime_type || 'application/octet-stream',
        upsert: false
      });

    if (upErr && upErr.message && !/The resource already exists/i.test(upErr.message)) {
      return json({ error: `upload failed: ${upErr.message}` }, { status: 500 });
    }

    // Insert canonical document
    const { data: ins, error: insErr } = await supabaseServiceRole
      .from('documents')
      .insert({
        file_hash,
        file_name,
        size_bytes,
        mime_type,
        canonical_path,
        created_by: user.id,
        source: 'user'
      })
      .select('id')
      .single();

    if (insErr) {
      return json({ error: `insert failed: ${insErr.message}` }, { status: 500 });
    }

    document_id = ins.id;

    // Link user -> document
    await supabaseServiceRole
      .from('user_documents')
      .upsert({ user_id: user.id, document_id }, { onConflict: 'user_id,document_id' });
  }

  return json({ ok: true, document_id, file_hash, path: canonical_path });
};
