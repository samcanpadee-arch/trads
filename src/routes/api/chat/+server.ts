import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { env } from '$env/dynamic/private';

// Read your key at runtime from env
const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,           // required
  organization: env.OPENAI_ORG_ID || undefined // optional
});

export async function POST({ request }) {
  try {
    const { messages } = await request.json();

    const result = await streamText({
      model: openai('gpt-4o-mini'), // cheap, fast OpenAI chat model
      messages
    });

    // Return a plain text stream that works with simple fetch() and curl
    return result.toTextStreamResponse();
  } catch (err: any) {
    console.error('api/chat error:', err);
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Server error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

// Be explicit: only POST is supported
export function GET() {
  return new Response('Method Not Allowed', { status: 405 });
}
