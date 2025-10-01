import type { PageServerLoad } from "./$types";
import { getUserTier } from "$lib/server/subscription_tiers";

export const load: PageServerLoad = async ({ locals }) => {
  const tier = await getUserTier(locals);
  const allowed = tier === "pro";
  // No redirect here — the +layout.svelte renders the upgrade panel when !allowed
  return { tier, allowed, needed: "pro" as const };
};
