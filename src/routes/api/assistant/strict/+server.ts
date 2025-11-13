import type { RequestHandler } from "./$types";
import { env as privateEnv } from "$env/dynamic/private";
import OpenAI from "openai";

export const config = { runtime: "nodejs20.x" };

// Lazy init: only construct the client inside the handler
function getClient() {
  const key = privateEnv.OPENAI_API_KEY;
  return key ? new OpenAI({ apiKey: key }) : null;
}

export const POST: RequestHandler = async () => {
  const client = getClient();
  const approvedId = privateEnv.PRIVATE_ASSISTANT_APPROVED_STORE_ID;

  if (!client || !approvedId) {
    return new Response("Strict endpoint not configured", { status: 501 });
  }

  // No-op placeholder to keep route compiling without side-effects
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
};
