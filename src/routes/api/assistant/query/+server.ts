import type { RequestHandler } from "./$types";
import OpenAI from "openai";
import { json, redirect } from "@sveltejs/kit";
import { getApprovedStoreId } from "$lib/server/assistant_stores";

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session } = await locals.safeGetSession();
  if (!session) throw redirect(303, "/login");

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const approvedId = getApprovedStoreId();

  const body = await request.json().catch(() => ({}));
  const { prompt, file_ids = [] } = body as { prompt: string; file_ids?: string[] };

  // Always include APPROVED library
  const attachments: any[] = [{ vector_store_ids: [approvedId] }];

  // Also include any files the user just uploaded for THIS question
  if (Array.isArray(file_ids) && file_ids.length > 0) {
    for (const id of file_ids) attachments.push({ file_id: id });
  }

  // Example using Responses API
  const res = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    attachments
  });

  return json({ ok: true, response: res });
};
