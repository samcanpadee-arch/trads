import { describe, expect, it, beforeEach } from 'vitest';
import { buildOpenAIMessages, type IncomingAttachment, type IncomingMessage } from './message_builder';

const baseMessages: IncomingMessage[] = [
  { role: 'system', content: 'system' },
  { role: 'user', content: 'hi' }
];

describe('buildOpenAIMessages', () => {
  beforeEach(() => {
    // nothing to reset yet
  });

  it('returns basic messages unchanged when there are no attachments', () => {
    const built = buildOpenAIMessages(baseMessages, []);
    expect(built[1]?.content).toBe('hi');
  });

  it('adds image_url parts to the last user message', () => {
    const attachments: IncomingAttachment[] = [
      { url: 'https://example.com/photo.jpg', contentType: 'image/jpeg' }
    ];
    const built = buildOpenAIMessages(baseMessages, attachments);
    expect(Array.isArray(built[1]?.content)).toBe(true);
    const content = built[1]?.content as any[];
    expect(content[0]?.text).toBe('hi');
    expect(content[1]?.image_url?.url).toBe('https://example.com/photo.jpg');
  });

  it('ignores non-user messages for attachment injection', () => {
    const attachments: IncomingAttachment[] = [
      { url: 'https://example.com/photo.jpg', contentType: 'image/jpeg' }
    ];
    const built = buildOpenAIMessages([{ role: 'assistant', content: 'ok' }], attachments);
    expect(built[0]?.content).toBe('ok');
  });
});
