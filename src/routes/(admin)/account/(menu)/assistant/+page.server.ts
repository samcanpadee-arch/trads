import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getUserTier } from "$lib/server/subscription_tiers";

export const load: PageServerLoad = async ({ locals }) => {
  const tier = await getUserTier(locals);
  if (tier !== "pro") {
    // Only Pro can access Assistant
    throw redirect(303, "/pricing?upgrade=assistant");
  }
  return { tier };
};
