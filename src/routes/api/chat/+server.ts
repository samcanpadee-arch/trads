import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { OPENAI_API_KEY, OPENAI_ORG_ID } from '$env/static/private';

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  organization: OPENAI_ORG_ID || undefined
});

export async function POST({ request }) {
  const { messages } = await request.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages
  });

  // ✅ what useChat expects
return result.toDataStreamResponse();
}
