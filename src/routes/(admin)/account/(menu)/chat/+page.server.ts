import type { PageServerLoad } from "./$types";
import { getUserTier } from "$lib/server/subscription_tiers";

export const load: PageServerLoad = async ({ locals }) => {
  const tier = await getUserTier(locals);
  const allowed = tier === "standard" || tier === "pro";
  return { tier, allowed, needed: "standard" as const };
};
