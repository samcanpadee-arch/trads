import { json, type RequestHandler } from '@sveltejs/kit';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const POST: RequestHandler = async ({ request }) => {
  let body: Partial<AgreementRequest> = {};

  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const payload: AgreementRequest = {
    clientName: clean(body.clientName, 200),
    siteAddress: clean(body.siteAddress, 200),
    projectBrief: clean(body.projectBrief, 1200),
    inclusions: clean(body.inclusions, 1500),
    responsibilities: clean(body.responsibilities, 1200),
    paymentTerms: clean(body.paymentTerms, 800),
    schedule: clean(body.schedule, 800),
    variations: clean(body.variations, 800),
    specialTerms: clean(body.specialTerms, 800),
    includeSignature: Boolean(body.includeSignature),
    brandContext: clean(body.brandContext, 500)
  };

  const fallback = buildFallback(payload);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ document: fallback, usedFallback: true });
  }

  const systemPrompt =
    'You are Customer Agreement Assistant for Australian tradies. Turn the provided context into a clear agreement ready for clients to sign.' +
    ' Write in short paragraphs or bullet lists, highlight expectations, responsibilities, payment milestones, variation rules, and compliance duties.' +
    (payload.brandContext ? '\nBrand context: ' + payload.brandContext : '');

  const userContent = {
    clientName: payload.clientName,
    siteAddress: payload.siteAddress,
    projectBrief: payload.projectBrief,
    inclusions: listFromText(payload.inclusions),
    responsibilities: listFromText(payload.responsibilities),
    paymentTerms: payload.paymentTerms,
    schedule: payload.schedule,
    variations: payload.variations,
    specialTerms: payload.specialTerms,
    includeSignature: payload.includeSignature
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
              'Create the customer agreement using this JSON. Include headings like Overview, Inclusions, Responsibilities, Payment, Schedule, Variations, Terms.' +
              (payload.includeSignature
                ? ' Finish with an Acceptance / Sign-off panel for both parties.'
                : '') +
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

type AgreementRequest = {
  clientName: string;
  siteAddress: string;
  projectBrief: string;
  inclusions: string;
  responsibilities: string;
  paymentTerms: string;
  schedule: string;
  variations: string;
  specialTerms: string;
  includeSignature: boolean;
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

function buildFallback(payload: AgreementRequest): string {
  const lines: string[] = [];
  lines.push('# Customer Agreement');
  if (payload.clientName || payload.siteAddress) {
    lines.push(
      `**Client:** ${payload.clientName || 'Not specified'}${payload.siteAddress ? ` — ${payload.siteAddress}` : ''}`
    );
  }
  if (payload.projectBrief) {
    lines.push('\n## Overview', payload.projectBrief);
  }
  const inclusions = listFromText(payload.inclusions);
  if (inclusions.length) {
    lines.push('\n## Inclusions & scope', ...inclusions.map((item) => `- ${item}`));
  }
  const responsibilities = listFromText(payload.responsibilities);
  if (responsibilities.length) {
    lines.push('\n## Client responsibilities / prep', ...responsibilities.map((item) => `- ${item}`));
  }
  if (payload.paymentTerms) {
    lines.push('\n## Payment terms', payload.paymentTerms);
  }
  if (payload.schedule) {
    lines.push('\n## Schedule', payload.schedule);
  }
  if (payload.variations) {
    lines.push('\n## Variations & exclusions', payload.variations);
  }
  if (payload.specialTerms) {
    lines.push('\n## Terms & compliance', payload.specialTerms);
  }
  if (payload.includeSignature) {
    lines.push(
      '\n## Acceptance',
      '- Contractor: ___________________________   Date: ____________',
      '- Client: _______________________________   Date: ____________'
    );
  }
  return lines.join('\n').trim();
}
