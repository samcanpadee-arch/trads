import type { RequestHandler } from '@sveltejs/kit';

type Role = 'system' | 'user' | 'assistant';
type Msg = { role: Role; content: string };

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 500 });

  let body: { messages?: Msg[]; model?: string } = {};
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const messages = body.messages ?? [];
  const model = body.model || DEFAULT_MODEL;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('messages[] required', { status: 400 });
  }

  // TODO: add real auth/quotas using your existing locals/session helpers

  const upstream = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: messages.map((m) => ({ role: m.role, content: m.content }))
    })
  });

  if (!upstream.ok || !upstream.body) {
    const txt = await upstream.text();
    return new Response(`OpenAI error: ${txt}`, { status: upstream.status || 500 });
  }

  // Convert OpenAI SSE (data: {...}) to plain text stream of deltas
  const stream = new ReadableStream({
    start(controller) {
      const reader = upstream.body!.getReader();
      const dec = new TextDecoder();
      const enc = new TextEncoder();

      const read = async () => {
        try {
          const { value, done } = await reader.read();
          if (done) return controller.close();

          const chunk = dec.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            const t = line.trim();
            if (!t || !t.startsWith('data:')) continue;
            const data = t.slice(5).trim();
            if (data === '[DONE]') return controller.close();
            try {
              const json = JSON.parse(data);
              const delta = json?.choices?.[0]?.delta?.content ?? '';
              if (delta) controller.enqueue(enc.encode(delta));
            } catch {
              // ignore malformed keep-alives
            }
          }
          read();
        } catch (err) {
          controller.error(err);
        }
      };
      read();
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' }
  });
};
