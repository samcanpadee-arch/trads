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
    trade: clean(body.trade, 40) || 'General',
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
    'You are a Terms & Conditions assistant for Australian tradies. Draft clear, plain-English clauses a tradie can attach to any quote or invoice.' +
    ' Keep the focus on expectations, payment timing, variations, client responsibilities, access, warranties/compliance, and liability.' +
    ' Do not rewrite the broader proposal or marketing copy—deliver practical conditions only.' +
    ' Reference Australian standards, licensing and warranty duties when relevant.' +
    (payload.trade ? `\nTrade focus: ${payload.trade}` : '') +
    (payload.brandContext ? '\nBrand context: ' + payload.brandContext : '');

  const userContent = {
    businessName: payload.businessName,
    businessWebsite: payload.businessWebsite,
    trade: payload.trade,
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
              'Using the following JSON, produce general business terms and conditions a tradie can attach to any project.' +
              ' Prioritise evergreen clauses (scope & responsibilities, payment milestones, variations, access, warranties/compliance, liability) and keep the tone direct and Australian.' +
              ' Finish with any project-specific notes (if supplied) and a reminder to review professionally.' +
              ' Suggested headings: Overview, Scope & Responsibilities, Payment Terms, Variations & Extras, Access & Client Duties, Warranty & Compliance, Liability & Disputes, Project Add-ons.' +
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
  trade: string;
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
  if (payload.trade && payload.trade !== 'General') {
    lines.push(`**Trade focus:** ${payload.trade}`);
  }
  lines.push('These general terms sit alongside every quote and invoice issued by our team. They set expectations before work starts.');

  const generalLines = listFromText(payload.businessNotes);
  if (generalLines.length) {
    lines.push('\n## Business standards & notes', ...generalLines.map((line) => `- ${line}`));
  }

  lines.push(
    '\n## Scope & responsibilities',
    '- We deliver the works described in the quote and agreed variations, using licensed trades and following Australian Standards.',
    '- Client ensures accurate information about site conditions and approvals; extra work caused by unknown issues is treated as a variation.'
  );

  lines.push(
    '\n## Payment terms',
    '- Deposits, progress claims, and balances are due per the quote schedule or within 5 business days if no date is listed.',
    '- Late or missed payments may pause work and attract interest or debt recovery costs.'
  );

  lines.push(
    '\n## Variations & extras',
    '- Any change to scope, materials, or access is priced in writing and approved before work proceeds.',
    '- Emergency instructions given onsite are treated as variations and billed accordingly.'
  );

  lines.push(
    '\n## Access & client duties',
    '- Provide safe, continuous access, services (power/water), and clear work areas during agreed hours.',
    '- Client is responsible for securing valuables, notifying neighbours, and arranging permits unless otherwise agreed.'
  );

  lines.push(
    '\n## Warranty & compliance',
    '- Workmanship is backed by statutory warranties under Australian Consumer Law and relevant state building laws.',
    '- Manufacturer warranties apply to supplied products; maintenance instructions must be followed to keep cover valid.'
  );

  lines.push(
    '\n## Liability & disputes',
    '- We hold appropriate insurances and limit liability to the cost of re-performing the services, except where legislation prevents this.',
    '- Disputes should be raised in writing within 7 days so both parties can resolve issues quickly; unresolved matters may go to the relevant tribunal.'
  );

  const projectLines = listFromText(payload.projectSpecificTerms);
  if (projectLines.length) {
    lines.push('\n## Project-specific additions', ...projectLines.map((line) => `- ${line}`));
  }

  lines.push('\n> These terms are a guide only. Review with your legal adviser before sending.');
  return lines.join('\n').trim();
}
