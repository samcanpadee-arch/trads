// src/routes/api/chat/+server.ts
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { OPENAI_API_KEY, OPENAI_ORG_ID } from '$env/static/private';

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  // org is optional; include it if you actually use orgs
  organization: OPENAI_ORG_ID || undefined
});

export async function POST({ request }) {
  const { messages } = await request.json();

  // ✅ v2 model spec: use openai('model-id'), NOT openai.chat(...)
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages
  });

  // ✅ v5 helper that streams plain text
  return result.toTextStreamResponse();
}
