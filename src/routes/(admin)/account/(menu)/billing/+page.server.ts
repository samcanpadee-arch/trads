import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

/**
 * TEMP SAFE LOADER:
 * - No external calls (Stripe/Supabase), so it cannot 500.
 * - Keeps the page usable: plan cards show and buttons link to checkout.
 * - Once the page is stable in prod, we can re-enable Stripe lookups.
 */
export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  if (!session) throw redirect(303, "/login");
  return {
    isActiveCustomer: false,         // show plan selection
    subscriptionStatus: null         // optional field used in some templates
  };
};
