import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import Stripe from "stripe";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getOrCreateCustomerId } from "../../subscription_helpers.server";

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabaseServiceRole } }) => {
  const { session, user } = await safeGetSession();
  if (!session) redirect(303, "/login");

  // 1) Resolve Stripe customer
  const { error: idError, customerId } = await getOrCreateCustomerId({ supabaseServiceRole, user });
  if (idError || !customerId) {
    console.error("Stripe customer error:", idError);
    return { portalUrl: null, sub: null };
  }

  // 2) Create portal link (best-effort)
  let portalUrl: string | null = null;
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${url.origin}/account/billing`
    });
    portalUrl = portalSession.url ?? null;
  } catch (e) {
    console.error("Billing portal create error:", e);
  }

  // Helper to normalize a Stripe subscription to the UI shape
  const normalize = (sub: Stripe.Subscription | null) => {
    if (!sub) return null;
    const item = sub.items.data[0];
    const price = item?.price ?? null;
    const product = (price?.product ?? null) as Stripe.Product | null;
    const interval = price?.recurring?.interval ?? null;
    const trialEnds = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
    const nextBill = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;
    return {
      status: sub.status,
      planName: product?.name ?? "Subscription",
      interval,
      trialEnds,
      nextBill
    };
  };

  // 3) Try subscriptions.list first (broad + bigger limit)
  try {
    let found: Stripe.Subscription | null = null;

    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.items.data.price.product"],
      limit: 100
    });

    // Prefer non-canceled; otherwise the most recent entry (Stripe returns sorted by created desc)
    found = subs.data.find(s => s.status !== "canceled") ?? subs.data[0] ?? null;

    // 4) Fallback via checkout sessions if list is empty
    if (!found) {
      const sessions = await stripe.checkout.sessions.list({
        customer: customerId,
        limit: 10
      });
      const withSub = sessions.data.find(s => typeof s.subscription === "string");
      if (withSub && typeof withSub.subscription === "string") {
        const sub = await stripe.subscriptions.retrieve(withSub.subscription, {
          expand: ["items.data.price.product"]
        });
        found = sub;
      }
    }

    return { portalUrl, sub: normalize(found) };
  } catch (e) {
    console.error("Read subscription error:", e);
    return { portalUrl, sub: null };
  }
};
