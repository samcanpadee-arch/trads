/* Assistant: Hybrid + OpenAI File Search (OCR-capable)
   - Uploads incoming files to OpenAI (purpose=assistants)
   - Uses Responses API with tools:[{type:"file_search"}] + attachments
   - Hybrid: answers generally AND enriches with docs; cites when used
*/
import type { RequestHandler } from "@sveltejs/kit";
import { env as privateEnv } from "$env/dynamic/private";

export const config = { runtime: 'nodejs20.x' };

async function uploadToOpenAI(file: File, apiKey: string): Promise<{ id: string; filename: string }> {
  const form = new FormData();
  form.append("purpose", "assistants");
  form.append("file", file, file.name || "upload.pdf");

  const resp = await fetch("https://api.openai.com/v1/files", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(`OpenAI file upload failed: ${msg}`);
  }
  const json = await resp.json();
  return { id: json.id as string, filename: (json.filename as string) || file.name || "upload" };
}

function extractTextFromResponses(resJson: any): string {
  if (!resJson) return "";
  // Preferred: output_text
  if (typeof resJson.output_text === "string" && resJson.output_text.trim()) return resJson.output_text;
  // Fallbacks for other shapes
  if (Array.isArray(resJson.output)) {
    const texts: string[] = [];
    for (const item of resJson.output) {
      const parts = item?.content || item?.contents || [];
      for (const p of parts) {
        if (p?.type === "output_text" && typeof p?.text === "string") texts.push(p.text);
        if (p?.type === "text" && typeof p?.text === "string") texts.push(p.text);
      }
    }
    if (texts.length) return texts.join("\n");
  }
  if (Array.isArray(resJson.content)) {
    const first = resJson.content.find((c: any) => typeof c?.text === "string");
    if (first?.text) return first.text;
  }
  return "";
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!privateEnv.OPENAI_API_KEY) {
      return new Response("Missing OPENAI_API_KEY", { status: 500 });
    }

    const ctype = request.headers.get("content-type") || "";
    if (!ctype.includes("multipart/form-data")) {
      return new Response("Send multipart/form-data with fields: message and optional trade, brand, model, files[]", { status: 400 });
    }

    const form = await request.formData();
    const message = (form.get("message") as string || "").trim();
    const trade = (form.get("trade") as string || "").trim();
    const brand = (form.get("brand") as string || "").trim();
    const model = (form.get("model") as string || "").trim();
    if (!message) return new Response("Please include a question in 'message'.", { status: 400 });

    // Upload files to OpenAI (OCR handled by OpenAI’s file search)
    const files = form.getAll("files").filter((f) => f instanceof File) as File[];
    const uploaded: Array<{ id: string; filename: string }> = [];
    for (const f of files) {
      try {
        const res = await uploadToOpenAI(f, privateEnv.OPENAI_API_KEY);
        uploaded.push(res);
      } catch (e: any) {
        console.error("Upload failed", e);
        return new Response(`File upload error: ${e?.message || e}`, { status: 500 });
      }
    }

    // System prompt: hybrid usage + citations when docs used
    const SYSTEM = `You are a technical assistant for experienced Australian tradies.
Provide precise, technical answers. Use your general knowledge freely.
If uploaded manuals are relevant, incorporate their specifics and include concise inline citations like [Panasonic VKR Manual, p.12].
If no relevant manual context exists, do not refuse—answer with your knowledge. Always include safety/compliance notes when relevant.`;

    const USER = [
      trade ? `Trade: ${trade}` : null,
      brand ? `Brand: ${brand}` : null,
      model ? `Model: ${model}` : null,
      `Question: ${message}`
    ].filter(Boolean).join("\n");

    // Build attachments for file_search
    const attachments = uploaded.map((u) => ({
      file_id: u.id,
      tools: [{ type: "file_search" as const }]
    }));

    // Strong task instruction to cite when files are used
    const TASK = `Task:
- Answer in technical detail (assume trade knowledge).
- If any attached file content is used, include at least one inline citation like [<short doc name>, p.X].
- End with a short checklist.`;

    // Call Responses API using file_search tool
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${privateEnv.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: SYSTEM },
          { role: "user", content: USER },
          { role: "user", content: TASK }
        ],
        tools: [{ type: "file_search" }],
        attachments: attachments.length ? attachments : undefined,
        temperature: 0.2
      })
    });

    if (!resp.ok) {
      const msg = await resp.text();
      console.error("OpenAI Responses error", msg);
      return new Response(`OpenAI error: ${msg}`, { status: 500 });
    }

    const data = await resp.json();
    const text = extractTextFromResponses(data) || "Sorry — I couldn’t produce an answer.";
    return new Response(text, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (outer: any) {
    console.error("Unhandled /api/assistant error", outer);
    return new Response(`Internal error: ${outer?.message || outer}`, { status: 500 });
  }
};
