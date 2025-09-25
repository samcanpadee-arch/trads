import { P as PRIVATE_STRIPE_API_KEY } from "../../../../../../chunks/private.js";
import { r as redirect, e as error } from "../../../../../../chunks/index2.js";
import Stripe from "stripe";
import { g as getOrCreateCustomerId, f as fetchSubscription } from "../../../../../../chunks/subscription_helpers.server.js";
const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });
const load = async ({
  params,
  url,
  locals: { safeGetSession, supabaseServiceRole }
}) => {
  const { session, user } = await safeGetSession();
  if (!session) {
    redirect(303, "/login");
  }
  if (params.slug === "free_plan") {
    redirect(303, "/account");
  }
  const { error: idError, customerId } = await getOrCreateCustomerId({
    supabaseServiceRole,
    user
  });
  if (idError || !customerId) {
    console.error("Error creating customer id", idError);
    error(500, {
      message: "Unknown error. If issue persists, please contact us."
    });
  }
  const { primarySubscription } = await fetchSubscription({
    customerId
  });
  if (primarySubscription) {
    redirect(303, "/account/billing");
  }
  let checkoutUrl;
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: params.slug,
          quantity: 1
        }
      ],
      customer: customerId,
      mode: "subscription",
      success_url: `${url.origin}/account`,
      cancel_url: `${url.origin}/account/billing`
    });
    checkoutUrl = stripeSession.url;
  } catch (e) {
    console.error("Error creating checkout session", e);
    error(500, "Unknown Error (SSE): If issue persists please contact us.");
  }
  redirect(303, checkoutUrl ?? "/pricing");
};
export {
  load
};
