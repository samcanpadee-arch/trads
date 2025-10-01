import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getUserTier } from "$lib/server/subscription_tiers";

export const load: PageServerLoad = async ({ locals }) => {
  const tier = await getUserTier(locals);
  if (tier === "free") {
    // Free users can't access Chat; send to pricing with a helpful param
    throw redirect(303, "/pricing?upgrade=chat");
  }
  return { tier };
};
