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
    'You are a Terms & Conditions assistant for Australian tradies. Draft detailed, enforceable clauses they can attach to any quote, invoice, or onboarding pack.' +
    ' Keep the focus on expectations, payment timing, variations, client responsibilities, access, warranties/compliance, insurance, and liability.' +
    ' Do not rewrite the broader proposal or marketing copy—deliver practical conditions only and avoid duplicating proposal content.' +
    ' Reference Australian standards, state-based licensing, security of payment rules, and warranty duties when relevant.' +
    ' Use markdown headings covering Overview, Scope & Responsibilities, Payment Terms, Variations & Extras, Access & Client Duties, Warranty & Compliance, Liability & Disputes, and Project Add-ons (if supplied).' +
    ' Each section should include multiple bullet points (or numbered items) with enough detail that the clauses can stand up to formal review.' +
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
              'Using the following JSON, produce robust business terms and conditions a tradie can attach to any project.' +
              ' Prioritise evergreen clauses (scope & responsibilities, payment milestones, variations, access, warranties/compliance, insurance, liability) and keep the tone formal, direct, and Australian.' +
              ' Each heading should include at least four detailed bullet points or numbered clauses so the terms feel comprehensive.' +
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
      console.warn('[terms-conditions] upstream error', err);
      return json({ document: fallback, error: err || 'OpenAI error' }, { status: 200 });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return json({ document: text || fallback });
  } catch (error) {
    console.error('[terms-conditions] request failed', error);
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
  lines.push(
    '\n## Overview',
    '- These terms accompany every quote, invoice, work order, or onboarding pack to confirm expectations before mobilisation.',
    '- They sit alongside the applicable state Security of Payment legislation and Australian Consumer Law obligations.',
    '- Adjust the clauses to reflect licensing requirements, insurance limits, and statutory warranty periods for each project.',
    '- Provide a copy to the client before work begins and retain acceptance for your records.'
  );

  const generalLines = listFromText(payload.businessNotes);
  if (generalLines.length) {
    lines.push('\n## Business standards & notes', ...generalLines.map((line) => `- ${line}`));
  }

  lines.push(
    '\n## Scope & responsibilities',
    '- We deliver the works described in the accepted quote, drawings, and written variations using licensed trades who follow the NCC and relevant Australian Standards.',
    '- Materials are supplied as specified; equivalent substitutions are only used with written approval.',
    '- Client must provide accurate information about underground/hidden services, asbestos, and structural conditions; unknown issues become a variation.',
    '- Any work outside the documented scope, including coordination of other trades, is excluded unless explicitly listed.'
  );

  lines.push(
    '\n## Payment terms',
    '- Deposits, progress claims, and balances are due per the quote schedule or within 5 business days where no date is stated.',
    '- Work may pause if a claim remains unpaid after the due date and extensions to the completion date will apply.',
    '- Interest or debt-recovery costs may be charged on overdue amounts in line with local legislation.',
    '- Title to materials stays with us until invoices are paid in full.'
  );

  lines.push(
    '\n## Variations & extras',
    '- Any change to scope, materials, sequencing, or access is costed in writing and requires approval before work proceeds.',
    '- Delays, hidden services, rework caused by others, or client-supplied items outside spec are treated as variations.',
    '- Rates for labour, materials, and plant are applied per the variation sheet or our standard schedule if none is provided.',
    '- Emergency instructions given onsite are deemed accepted variations and billed accordingly.'
  );

  lines.push(
    '\n## Access & client duties',
    '- Provide safe, continuous access, power, water, and clear work areas during the agreed hours.',
    '- Client is responsible for permits, neighbour notifications, and locating underground services unless otherwise agreed in writing.',
    '- Secure valuables, pets, and sensitive equipment before works commence; we are not liable for damage outside our control.',
    '- Site inductions, parking, and crane/delivery logistics that add time or cost will be charged as variations.'
  );

  lines.push(
    '\n## Warranty & compliance',
    '- Workmanship is covered by statutory warranties under Australian Consumer Law and the relevant state-based building legislation.',
    '- Manufacturer warranties apply to supplied products; maintenance instructions and service intervals must be followed to keep cover valid.',
    '- Compliance certificates, test reports, and manuals are issued once invoices are paid in full.',
    '- Warranty is void where others alter our work, materials are misused, or maintenance is ignored.'
  );

  lines.push(
    '\n## Liability & disputes',
    '- We carry public liability and workers compensation insurance as required; liability is otherwise limited to re-performing the services except where legislation prevents this.',
    '- Loss of profit, consequential damages, or delays outside our control are excluded.',
    '- Raise disputes in writing within 7 days so both parties can attempt resolution before escalating.',
    '- Unresolved matters may proceed to the relevant state tribunal or court with jurisdiction.'
  );

  const projectLines = listFromText(payload.projectSpecificTerms);
  if (projectLines.length) {
    lines.push('\n## Project-specific additions', ...projectLines.map((line) => `- ${line}`));
  }

  lines.push('\n> These terms are a guide only. Review with your legal adviser before sending.');
  return lines.join('\n').trim();
}
