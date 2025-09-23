import { json } from '@sveltejs/kit';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { OPENAI_API_KEY, OPENAI_ORG_ID } from '$env/static/private';

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
  organization: OPENAI_ORG_ID || undefined
});

export async function POST({ request }) {
  try {
    const { messages, model } = await request.json();

    if (!Array.isArray(messages)) {
      return json({ error: 'messages must be an array' }, { status: 400 });
    }

    const result = await streamText({
      model: openai(model || 'gpt-4o-mini'),
      messages
    });

    // IMPORTANT: this is the correct streaming response for ai@4
    return result.toDataStreamResponse();
  } catch (err: any) {
    return json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
