import { json, type RequestHandler } from '@sveltejs/kit';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const POST: RequestHandler = async ({ request }) => {
  let body: Partial<DayLogRequest> = {};

  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const payload: DayLogRequest = {
    jobName: clean(body.jobName, 200),
    logDate: clean(body.logDate, 40),
    tradieName: clean(body.tradieName, 160),
    summaryNotes: clean(body.summaryNotes, 2600),
    issuesNotes: clean(body.issuesNotes, 2400),
    brandContext: clean(body.brandContext, 500)
  };

  const fallback = buildFallback(payload);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ document: fallback, usedFallback: true });
  }

  const systemPrompt =
    'You are Scope Guard, a day-log assistant for Australian tradies.' +
    ' Turn short dot points into a detailed daily record the crew can save to the job file, email to clients, or rely on during disputes.' +
    ' Always cover: overview, work completed & who was onsite, client conversations or approvals, issues/delays/weather/access, variations or cost impacts, risks/safety, and next steps.' +
    ' Use markdown with headings and bullet lists so the entry reads like a professional site diary, calling out dates/times and referencing Aussie standards or licensing duties where it helps.' +
    (payload.brandContext ? `\nBrand context: ${payload.brandContext}` : '');

  const userContent = {
    jobName: payload.jobName,
    logDate: payload.logDate,
    tradieName: payload.tradieName,
    summary: listFromText(payload.summaryNotes),
    issues: listFromText(payload.issuesNotes)
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
              'Using the JSON payload, draft a comprehensive day log that captures the reality onsite.' +
              ' Include sections for Overview, Work completed & crew, Client conversations & approvals, Issues / delays / risks, Variations or commercial impacts, Evidence & attachments, and Next steps.' +
              ' Each section should contain several bullet points with times, names, or specifics pulled from the notes — expand on the context where needed so it is legally useful.' +
              '\n' +
              JSON.stringify(userContent, null, 2)
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.warn('[day-log] upstream error', err);
      return json({ document: fallback, error: err || 'OpenAI error' }, { status: 200 });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return json({ document: text || fallback });
  } catch (error) {
    console.error('[day-log] request failed', error);
    const message = error instanceof Error ? error.message : 'LLM request failed';
    return json({ document: fallback, error: message }, { status: 200 });
  }
};

type DayLogRequest = {
  jobName: string;
  logDate: string;
  tradieName: string;
  summaryNotes: string;
  issuesNotes: string;
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
    .slice(0, 60);
}

function buildFallback(payload: DayLogRequest): string {
  const lines: string[] = [];
  lines.push('# Scope Guard — Day Log');
  if (payload.jobName) {
    lines.push(`**Job/site:** ${payload.jobName}`);
  }
  if (payload.logDate) {
    lines.push(`**Date:** ${payload.logDate}`);
  }
  if (payload.tradieName) {
    lines.push(`**Logged by:** ${payload.tradieName}`);
  }

  lines.push(
    '\n## Overview',
    '- Daily record prepared for disputes, client updates, and invoicing support.',
    '- Keep this log with drawings, photos, and cost sheets so changes can be proven later.',
    '- Confirm entries are accurate before issuing to the client or builder.'
  );

  const summaryLines = listFromText(payload.summaryNotes);
  lines.push('\n## Work completed & crew');
  if (summaryLines.length) {
    summaryLines.forEach((line) => lines.push(`- ${line}`));
  } else {
    lines.push('- Note labour onsite, materials installed, inspections completed, and any client chats.');
  }

  const issuesLines = listFromText(payload.issuesNotes);
  lines.push('\n## Issues, delays, weather & risks');
  if (issuesLines.length) {
    issuesLines.forEach((line) => lines.push(`- ${line}`));
  } else {
    lines.push('- Record weather hits, downtime, incidents, or approvals still pending.');
  }

  lines.push(
    '\n## Variations or commercial impacts',
    '- Capture any extra work requested, verbal approvals, or allowances to be priced.',
    '- Attach supporting emails/photos when issuing variation quotes.'
  );

  lines.push(
    '\n## Evidence & attachments',
    '- Photos, delivery dockets, SWMS updates, or inspection reports filed with this log.',
    '- Store copies alongside the job folder for auditing.'
  );

  lines.push(
    '\n## Next steps',
    '- List what happens tomorrow, who is responsible, and any follow-ups required.',
    '- Share this log with the client or builder if something materially affected time or cost.'
  );

  lines.push('\n> Save this entry immediately so memories don\'t fade if questions arise.');

  return lines.join('\n').trim();
}
