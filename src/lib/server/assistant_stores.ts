import { env as privateEnv } from "$env/dynamic/private";

export function getApprovedStoreId(): string | null {
  const id = privateEnv.PRIVATE_ASSISTANT_APPROVED_STORE_ID?.trim();
  return id || null;
}
