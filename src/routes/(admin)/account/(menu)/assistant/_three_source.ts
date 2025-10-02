export async function uploadSelectedFiles(files: File[], allowShare: boolean) {
  if (!files || files.length === 0) return [];
  const fd = new FormData();
  for (const f of files) fd.append("files[]", f);
  fd.set("allow_share", allowShare ? "true" : "false");

  const res = await fetch("/api/assistant", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Upload failed");

  const ids = Array.isArray(json?.uploaded)
    ? json.uploaded.map((u: any) => u.file_id).filter(Boolean)
    : [];
  return ids;
}

/**
 * Calls the new 3-source endpoint blending:
 *  - user-uploaded file_ids (if any)
 *  - shared library vector store
 *  - general model knowledge
 * with a bias toward the user files and your SOURCE guardrails.
 */
export async function askWithAllSources(opts: {
  prompt: string;
  trade?: string;
  brand?: string;
  files?: File[];
  allowShare?: boolean;
}) {
  const { prompt, trade = "", brand = "", files = [], allowShare = false } = opts;

  // 1) upload files (if any) to get file_ids
  const file_ids = await uploadSelectedFiles(files, allowShare);

  // 2) call the 3-source query endpoint
  const res = await fetch("/api/assistant/query", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt, trade, brand, file_ids })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Query failed");

  const text =
    json?.response?.output_text ??
    json?.response?.output?.[0]?.content?.[0]?.text?.value ??
    "";
  return { text, raw: json, file_ids };
}
