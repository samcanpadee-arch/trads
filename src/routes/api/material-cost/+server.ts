import { json, type RequestHandler } from '@sveltejs/kit';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const POST: RequestHandler = async ({ request }) => {
  let body: Partial<TermsRequest> = {};

  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const payload: TermsRequest = {
    clientName: clean(body.clientName, 200),
    projectContext: clean(body.projectContext, 800),
    scopeSummary: clean(body.scopeSummary, 1500),
    paymentStructure: clean(body.paymentStructure, 800),
    responsibilities: clean(body.responsibilities, 1000),
    variations: clean(body.variations, 800),
    additionalTerms: clean(body.additionalTerms, 1000),
    brandContext: clean(body.brandContext, 500)
  };

  const fallback = buildFallback(payload);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ document: fallback, usedFallback: true });
  }

  const systemPrompt =
    'You are a Terms & Conditions assistant for Australian tradies. Draft concise, plain-English terms that focus on obligations, payment expectations, and compliance rather than a full proposal.' +
    ' Keep sections scannable, reference Australian standards where relevant, and make sure the tone suits small trade businesses.' +
    (payload.brandContext ? '\nBrand context: ' + payload.brandContext : '');

  const userContent = {
    clientName: payload.clientName,
    projectContext: payload.projectContext,
    scope: listFromText(payload.scopeSummary),
    paymentStructure: payload.paymentStructure,
    responsibilities: listFromText(payload.responsibilities),
    variations: payload.variations,
    additionalTerms: payload.additionalTerms
  };

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        temperature: 0.35,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content:
              'Using the following JSON, draft trade-friendly terms & conditions only. Include headings such as Overview, Scope & Inclusions, Payment Terms, Responsibilities, Variations & Extras, Compliance & Warranties, and Dispute Resolution / Termination.' +
              ' Keep it distinct from a sales proposal and finish with a short reminder to review the terms before issuing.' +
              '\n' +
              JSON.stringify(userContent, null, 2)
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.warn('[customer-agreement] upstream error', err);
      return json({ document: fallback, error: err || 'OpenAI error' }, { status: 200 });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return json({ document: text || fallback });
  } catch (error) {
    console.error('[customer-agreement] request failed', error);
    const message = error instanceof Error ? error.message : 'LLM request failed';
    return json({ document: fallback, error: message }, { status: 200 });
  }
};

type TermsRequest = {
  clientName: string;
  projectContext: string;
  scopeSummary: string;
  paymentStructure: string;
  responsibilities: string;
  variations: string;
  additionalTerms: string;
  brandContext: string;
};

function clean(value: unknown, max = 500): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function listFromText(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 40);
}

function buildFallback(payload: TermsRequest): string {
  const lines: string[] = [];
  lines.push('# Terms & Conditions');
  if (payload.clientName || payload.projectContext) {
    lines.push(
      `**Client / project:** ${payload.clientName || 'Not specified'}${
        payload.projectContext ? ` — ${payload.projectContext}` : ''
      }`
    );
  }
  if (payload.projectContext) {
    lines.push('\n## Overview', payload.projectContext);
  }
  const scope = listFromText(payload.scopeSummary);
  if (scope.length) {
    lines.push('\n## Scope & inclusions', ...scope.map((item) => `- ${item}`));
  }
  const responsibilities = listFromText(payload.responsibilities);
  if (responsibilities.length) {
    lines.push('\n## Responsibilities & site rules', ...responsibilities.map((item) => `- ${item}`));
  }
  if (payload.paymentStructure) {
    lines.push('\n## Payment terms', payload.paymentStructure);
  }
  if (payload.variations) {
    lines.push('\n## Variations & extras', payload.variations);
  }
  if (payload.additionalTerms) {
    lines.push('\n## Compliance & other conditions', payload.additionalTerms);
  }
  lines.push('\n> These terms are a guide only. Review with your legal adviser before sending.');
  return lines.join('\n').trim();
}
