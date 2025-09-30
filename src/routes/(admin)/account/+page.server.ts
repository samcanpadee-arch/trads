import type { PageServerLoad } from "./$types";
import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import Stripe from "stripe";

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });

export const load: PageServerLoad = async ({ url }) => {
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) return { checkoutSuccess: null };

  try {
    const cs = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "subscription.items.data.price"]
    });

    const sub = cs.subscription && typeof cs.subscription !== "string" ? cs.subscription : null;
    const item = sub?.items?.data?.[0];
    const price = item?.price || null;

    const interval = price?.recurring?.interval ?? null;
    const nextBill = sub?.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;
    const trialEnds = sub?.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;

    return {
      checkoutSuccess: { interval, nextBill, trialEnds }
    };
  } catch {
    return { checkoutSuccess: null };
  }
};
