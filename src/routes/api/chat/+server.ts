// src/routes/api/chat/+server.ts
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, type UIMessage, convertToModelMessages } from 'ai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = createOpenAI({ apiKey: OPENAI_API_KEY });

export async function POST({ request }) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: openai('gpt-4o-mini'), // or 'gpt-4o' if you want
    messages: convertToModelMessages(messages)
  });

  // IMPORTANT: return UI message protocol for the Svelte Chat class
  return result.toUIMessageStreamResponse();
}


