export type Role = 'system' | 'user' | 'assistant';
export type IncomingMessage = { role: Role; content: string };
export type Msg = IncomingMessage;
export type IncomingAttachment = { url: string; name?: string; contentType?: string | null };

type ImageUrlPart = { type: 'image_url'; image_url: { url: string } };
type TextPart = { type: 'text'; text: string };

export type OpenAIMessage = { role: Role; content: string | Array<ImageUrlPart | TextPart> };

export function buildOpenAIMessages(
  messages: IncomingMessage[],
  attachments: IncomingAttachment[] = []
): OpenAIMessage[] {
  if (!Array.isArray(messages)) return [];

  const imageAttachments = attachments.filter((att) =>
    typeof att?.contentType === 'string' ? att.contentType.startsWith('image') : true
  );

  const result: OpenAIMessage[] = messages.map((m) => ({ role: m.role, content: m.content }));

  if (imageAttachments.length === 0) return result;

  const lastUserIndex = [...result].reverse().findIndex((m) => m.role === 'user');
  if (lastUserIndex === -1) return result;
  const userIndex = result.length - 1 - lastUserIndex;

  const target = result[userIndex];
  const textPart: TextPart = { type: 'text', text: typeof target.content === 'string' ? target.content : '' };
  const imageParts: ImageUrlPart[] = imageAttachments.map((att) => ({
    type: 'image_url',
    image_url: { url: att.url }
  }));

  target.content = [textPart, ...imageParts];
  result[userIndex] = target;
  return result;
}
