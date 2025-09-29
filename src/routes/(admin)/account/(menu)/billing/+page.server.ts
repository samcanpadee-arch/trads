import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getOrCreateCustomerId, fetchSubscription } from "../../subscription_helpers.server";

/**
 * Safe loader for /account/billing:
 * - Never throws 500; always returns { isActiveCustomer: boolean, subscriptionStatus?: string }
 * - Leaves the existing UI logic intact (plan cards use anchors to /account/subscribe/<price_id>)
 */
export const load: PageServerLoad = async ({ locals: { safeGetSession, supabaseServiceRole } }) => {
  const { session, user } = await safeGetSession();
  if (!session) throw redirect(303, "/login");

  try {
    const { customerId } = await getOrCreateCustomerId({ supabaseServiceRole, user });
    if (!customerId) return { isActiveCustomer: false };

    const { primarySubscription } = await fetchSubscription({ customerId });

    // If you only need a boolean for the page, this is enough:
    const active = !!primarySubscription;

    // If your helper returns status, include it; otherwise fall back:
    const status = (primarySubscription && (primarySubscription.status as string)) || null;

    return { isActiveCustomer: active, subscriptionStatus: status };
  } catch (e) {
    console.log("[billing load] non-fatal error:", (e as Error)?.message || e);
    return { isActiveCustomer: false };
  }
};
