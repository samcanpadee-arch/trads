import { json, type RequestHandler } from '@sveltejs/kit';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const POST: RequestHandler = async ({ request }) => {
  let body: Partial<VariationRequest> = {};

  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const payload: VariationRequest = {
    businessName: clean(body.businessName, 200),
    projectName: clean(body.projectName, 200),
    variationTitle: clean(body.variationTitle, 200),
    changeDate: clean(body.changeDate, 40),
    requestedBy: clean(body.requestedBy, 160),
    approvedBy: clean(body.approvedBy, 160),
    costImpact: clean(body.costImpact, 160),
    timeImpact: clean(body.timeImpact, 160),
    changeDescription: clean(body.changeDescription, 2200),
    evidenceNotes: clean(body.evidenceNotes, 1800),
    brandContext: clean(body.brandContext, 500)
  };

  const fallback = buildFallback(payload);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ document: fallback, usedFallback: true });
  }

  const systemPrompt =
    'You are Scope Guard, a variation-tracking assistant for Australian tradies.' +
    ' Your job is to turn rough notes into a thorough variation log that can be attached to quotes, invoices, or emails.' +
    ' Always cover: overview, trigger/change description, approvals trail, impact on time and cost, site risks/evidence, and next steps.' +
    ' Use markdown with clear headings and bullet points/numbered lists so supervisors can scan it quickly.' +
    ' Keep the tone firm, factual, and aligned with construction best practice, referencing relevant Aussie standards when it helps.' +
    (payload.brandContext ? `\nBrand context: ${payload.brandContext}` : '');

  const userContent = {
    businessName: payload.businessName,
    projectName: payload.projectName,
    variationTitle: payload.variationTitle,
    changeDate: payload.changeDate,
    requestedBy: payload.requestedBy,
    approvedBy: payload.approvedBy,
    costImpact: payload.costImpact,
    timeImpact: payload.timeImpact,
    changeDetails: listFromText(payload.changeDescription),
    evidenceNotes: listFromText(payload.evidenceNotes)
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
              'Using the JSON payload, draft a detailed variation tracker entry that could stand up in a dispute.' +
              ' Include sections for Overview, Trigger & Description, Approval trail, Impact on time/cost, Site risks & evidence, and Next steps & acceptance.' +
              ' Each section should include at least three bullet points with specifics — no fluff.' +
              ' Close with a reminder to have the client acknowledge the variation.' +
              '\n' +
              JSON.stringify(userContent, null, 2)
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.warn('[variation-tracker] upstream error', err);
      return json({ document: fallback, error: err || 'OpenAI error' }, { status: 200 });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return json({ document: text || fallback });
  } catch (error) {
    console.error('[variation-tracker] request failed', error);
    const message = error instanceof Error ? error.message : 'LLM request failed';
    return json({ document: fallback, error: message }, { status: 200 });
  }
};

type VariationRequest = {
  businessName: string;
  projectName: string;
  variationTitle: string;
  changeDate: string;
  requestedBy: string;
  approvedBy: string;
  costImpact: string;
  timeImpact: string;
  changeDescription: string;
  evidenceNotes: string;
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

function buildFallback(payload: VariationRequest): string {
  const lines: string[] = [];
  lines.push('# Scope Guard — Variation Tracker');
  if (payload.variationTitle) {
    lines.push(`**Variation:** ${payload.variationTitle}`);
  }
  if (payload.projectName) {
    lines.push(`**Project/site:** ${payload.projectName}`);
  }
  if (payload.businessName) {
    lines.push(`**Crew:** ${payload.businessName}`);
  }
  if (payload.changeDate) {
    lines.push(`**Logged:** ${payload.changeDate}`);
  }

  lines.push(
    '\n## Overview',
    '- This log records a scope change raised during delivery.',
    '- Keep it with the job file and send a copy when issuing the variation price.',
    '- Acceptance should be captured via email, SMS, or signature before extra work proceeds.'
  );

  const changeLines = listFromText(payload.changeDescription);
  lines.push('\n## Trigger & description');
  if (changeLines.length) {
    changeLines.forEach((line) => lines.push(`- ${line}`));
  } else {
    lines.push('- Describe what changed, why it was requested, and any standards or specs that apply.');
  }

  lines.push('\n## Approval trail');
  lines.push(payload.requestedBy ? `- Raised by: ${payload.requestedBy}` : '- Raised by: __________________');
  lines.push(payload.approvedBy ? `- Approved/authorised by: ${payload.approvedBy}` : '- Approved/authorised by: __________________');

  lines.push('\n## Impact on time & cost');
  lines.push(payload.costImpact ? `- Cost impact: ${payload.costImpact}` : '- Cost impact: confirm allowance or price.');
  lines.push(payload.timeImpact ? `- Time impact: ${payload.timeImpact}` : '- Time impact: note any delays or nil impact.');
  lines.push('- Works only proceed once the client accepts revised time/cost.');

  const evidenceLines = listFromText(payload.evidenceNotes);
  lines.push('\n## Site risks & evidence');
  if (evidenceLines.length) {
    evidenceLines.forEach((line) => lines.push(`- ${line}`));
  } else {
    lines.push('- List photo references, plan mark-ups, or inspection notes that support the change.');
  }

  lines.push(
    '\n## Next steps & acceptance',
    '- Issue a written variation price or allowance referencing this log.',
    '- Update the program/SWMS if the change affects safety or sequencing.',
    '- Client/representative to acknowledge receipt and give written approval before works resume.'
  );

  lines.push('\n> Review this log with the client and save a copy against the job record.');

  return lines.join('\n').trim();
}
