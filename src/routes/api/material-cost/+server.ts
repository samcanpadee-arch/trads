import { json, type RequestHandler } from '@sveltejs/kit';

type DocType = 'swms' | 'toolbox' | 'induction';

const DOC_LABEL: Record<DocType, string> = {
  swms: 'Safe Work Method Statement (SWMS)',
  toolbox: 'Toolbox Talk Summary',
  induction: 'Site Induction Outline'
};

const DOC_GUIDANCE: Record<DocType, string> = {
  swms:
    'Structure the SWMS with a short overview, scope, task-by-task hazards, risk controls, PPE, and supervision notes. Mention relevant Australian standards or WHS duties when appropriate.',
  toolbox:
    'Provide key discussion points, hazard reminders, housekeeping actions, and takeaways for the crew toolbox talk. Use bullet points with clear actions and call out PPE/permits when referenced.',
  induction:
    'Lay out a logical order for inducting new people onto site: welcome, site rules, hazards, emergency plan, communication, and responsibilities. Finish with a recap of must-dos before they start work.'
};

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const POST: RequestHandler = async ({ request }) => {
  let body: Partial<{
    docType: DocType;
    projectName: string;
    siteLocation: string;
    workDescription: string;
    hazards: string;
    controls: string;
    crew: string;
    notes: string;
    includeSignOff: boolean;
    brandContext: string;
  }> = {};

  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const docType: DocType = isDocType(body.docType) ? body.docType : 'swms';
  const docLabel = DOC_LABEL[docType];

  const projectName = clean(body.projectName, 200);
  const siteLocation = clean(body.siteLocation, 200);
  const workDescription = clean(body.workDescription, 1200);
  const hazards = clean(body.hazards, 1200);
  const controls = clean(body.controls, 1200);
  const crew = clean(body.crew, 800);
  const notes = clean(body.notes, 800);
  const includeSignOff = Boolean(body.includeSignOff);
  const brandContext = clean(body.brandContext, 500);

  const requestPayload = {
    docType,
    docLabel,
    projectName,
    siteLocation,
    workDescription,
    hazards,
    controls,
    crew,
    notes,
    includeSignOff,
    brandContext,
  };

  const fallback = buildFallback(requestPayload);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ document: fallback, usedFallback: true });
  }

  const systemPrompt =
    `You are Safety Document Assistant for Australian tradies. Prepare a ${docLabel} using the provided context.` +
    ' Write in clear Australian English, keep paragraphs short, and favour bullet lists.' +
    ' Reference Aussie WHS expectations when relevant. ' +
    DOC_GUIDANCE[docType] +
    (includeSignOff
      ? ' Always finish with a sign-off or distribution block summarising who needs to acknowledge the document.'
      : '') +
    (brandContext ? '\nBrand context: ' + brandContext : '');

  const userContent = {
    projectName,
    siteLocation,
    workDescription,
    hazards: listFromText(hazards),
    controls: listFromText(controls),
    crew: listFromText(crew),
    notes,
    includeSignOff,
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
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content:
              'Create the document using this structured JSON. Keep headings short and readable.\n' +
              JSON.stringify(userContent, null, 2)
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.warn('[safety-docs] upstream error', err);
      return json({ document: fallback, error: err || 'OpenAI error' }, { status: 200 });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return json({ document: text || fallback });
  } catch (error) {
    console.error('[safety-docs] request failed', error);
    const message = error instanceof Error ? error.message : 'LLM request failed';
    return json({ document: fallback, error: message }, { status: 200 });
  }
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

function isDocType(value: unknown): value is DocType {
  return value === 'swms' || value === 'toolbox' || value === 'induction';
}

type RequestPayload = {
  docType: DocType;
  docLabel: string;
  projectName: string;
  siteLocation: string;
  workDescription: string;
  hazards: string;
  controls: string;
  crew: string;
  notes: string;
  includeSignOff: boolean;
  brandContext: string;
};

function buildFallback(payload: RequestPayload): string {
  const lines: string[] = [];
  lines.push(`# ${payload.docLabel}`);
  if (payload.projectName || payload.siteLocation) {
    lines.push(
      `**Project:** ${payload.projectName || 'Not specified'}${payload.siteLocation ? ` — ${payload.siteLocation}` : ''}`
    );
  }
  if (payload.workDescription) {
    lines.push('\n## Scope', payload.workDescription);
  }
  const hazards = listFromText(payload.hazards);
  if (hazards.length) {
    lines.push('\n## Key hazards', ...hazards.map((h) => `- ${h}`));
  }
  const controls = listFromText(payload.controls);
  if (controls.length) {
    lines.push('\n## Controls & PPE', ...controls.map((c) => `- ${c}`));
  }
  const crew = listFromText(payload.crew);
  if (crew.length) {
    lines.push('\n## Responsibilities', ...crew.map((c) => `- ${c}`));
  }
  if (payload.notes) {
    lines.push('\n## Additional notes', payload.notes);
  }
  if (payload.includeSignOff) {
    lines.push(
      '\n## Sign-off',
      '- Supervisor: ___________________________',
      '- Date: _________________________________'
    );
  }
  return lines.join('\n').trim();
}
