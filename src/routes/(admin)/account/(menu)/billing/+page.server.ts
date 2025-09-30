import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import Stripe from "stripe";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getOrCreateCustomerId } from "../../subscription_helpers.server";

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabaseServiceRole } }) => {
  const { session, user } = await safeGetSession();
  if (!session) redirect(303, "/login");

  const { error: idError, customerId } = await getOrCreateCustomerId({ supabaseServiceRole, user });
  if (idError || !customerId) {
    // Don’t crash — just render the page with no portalUrl, the button will be disabled.
    return { portalUrl: null };
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${url.origin}/account/billing`
    });
    return { portalUrl: portalSession.url ?? null };
  } catch (e) {
    console.error("Billing portal error:", e);
    return { portalUrl: null };
  }
};
