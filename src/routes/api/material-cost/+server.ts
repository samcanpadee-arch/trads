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
    businessName: clean(body.businessName, 200),
    businessWebsite: clean(body.businessWebsite, 200),
    projectSpecificTerms: clean(body.projectSpecificTerms, 1200),
    businessNotes: clean(body.businessNotes, 2000),
    brandContext: clean(body.brandContext, 500)
  };

  const fallback = buildFallback(payload);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ document: fallback, usedFallback: true });
  }

  const systemPrompt =
    'You are a Terms & Conditions assistant for Australian tradies. Draft concise, plain-English business terms that clients agree to before work starts.' +
    ' Focus on expectations, payment rules, responsibilities, variations and compliance. Keep the copy distinct from a proposal.' +
    ' Reference Australian licensing/warranty obligations when relevant.' +
    (payload.brandContext ? '\nBrand context: ' + payload.brandContext : '');

  const userContent = {
    businessName: payload.businessName,
    businessWebsite: payload.businessWebsite,
    evergreenPolicies: listFromText(payload.businessNotes),
    projectSpecific: listFromText(payload.projectSpecificTerms)
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
              'Using the following JSON, produce general trade terms and conditions. Prioritise evergreen clauses (payment milestones, responsibilities, variations, compliance) and add any project-specific notes at the end.' +
              ' Sections should stay scannable with headings such as Business Overview, Standard Terms, Payment Expectations, Variations, Compliance & Warranty, Dispute Resolution.' +
              ' Close with a reminder for both parties to review and seek legal advice.' +
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
  businessName: string;
  businessWebsite: string;
  projectSpecificTerms: string;
  businessNotes: string;
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
  if (payload.businessName) {
    lines.push(`**Business:** ${payload.businessName}`);
  }
  if (payload.businessWebsite) {
    lines.push(`**Website:** ${payload.businessWebsite}`);
  }

  const generalLines = listFromText(payload.businessNotes);
  if (generalLines.length) {
    lines.push('\n## Standard business terms', ...generalLines.map((line) => `- ${line}`));
  }

  const projectLines = listFromText(payload.projectSpecificTerms);
  if (projectLines.length) {
    lines.push('\n## Project-specific additions', ...projectLines.map((line) => `- ${line}`));
  }

  lines.push('\n> These terms are a guide only. Review with your legal adviser before sending.');
  return lines.join('\n').trim();
}
