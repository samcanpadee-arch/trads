import type { RequestHandler } from '@sveltejs/kit';
import { consumeRateLimit } from '$lib/server/rate_limit';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini';
const MAX_BASE64_BYTES = 4 * 1024 * 1024; // ~4 MB cap to keep costs predictable
const TOKENS = 500;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function base64Size(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  // Approximate bytes represented by base64 string
  return Math.floor((base64.length * 3) / 4);
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const rate = consumeRateLimit(`image-qa:${user.id}`, {
    limit: RATE_LIMIT,
    windowMs: RATE_WINDOW_MS
  });
  if (!rate.allowed) {
    return new Response('You have hit the photo analysis limit. Please try again later.', {
      status: 429,
      headers: { 'Retry-After': `${rate.retryAfterSeconds}` }
    });
  }

  let payload: { image?: string; question?: string } = {};
  try {
    payload = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const image = typeof payload.image === 'string' ? payload.image.trim() : '';
  const question = typeof payload.question === 'string' ? payload.question.trim() : '';

  if (!image || !image.startsWith('data:image/')) {
    return new Response('A valid image is required.', { status: 400 });
  }

  if (base64Size(image) > MAX_BASE64_BYTES) {
    return new Response('Images must be under about 4 MB.', { status: 400 });
  }

  if (!question) {
    return new Response('Please include a question about the photo.', { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 500 });

  const messages = [
    {
      role: 'system',
      content:
        'You are a safety-first assistant for Australian tradies. Give concise, practical advice (under ~150 words) about the uploaded photo and user question. Flag any hazards, suggest safe next steps, and recommend a licensed professional when required. If the photo is unclear, say so and ask for a clearer shot.'
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: question },
        { type: 'image_url', image_url: { url: image } }
      ]
    }
  ];

  const upstream = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: TOKENS,
      messages
    })
  });

  if (!upstream.ok) {
    const txt = await upstream.text();
    return new Response(`OpenAI error: ${txt}`, { status: upstream.status || 500 });
  }

  const data = (await upstream.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const answer = data?.choices?.[0]?.message?.content?.trim();
  if (!answer) return new Response('The assistant did not return an answer.', { status: 500 });

  return new Response(JSON.stringify({ answer }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
