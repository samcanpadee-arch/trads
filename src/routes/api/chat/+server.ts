// src/routes/api/chat/+server.ts
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { OPENAI_API_KEY, OPENAI_ORG_ID } from '$env/static/private';

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  // include org if you actually use orgs; otherwise remove this line
  organization: OPENAI_ORG_ID || undefined
});

export async function POST({ request }) {
  const { messages } = await request.json();

  // ✅ AI SDK v5 + OpenAI v2 style
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages
  });

  // ✅ IMPORTANT: this returns the AI data stream format that the
  // Vercel Svelte chat UI parses (the template expects this)
  return result.toAIStreamResponse();
}

