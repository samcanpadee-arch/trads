import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import Stripe from "stripe";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getOrCreateCustomerId } from "../../subscription_helpers.server";

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabaseServiceRole } }) => {
  const { session, user } = await safeGetSession();
  if (!session) redirect(303, "/login");

  // 1) Get or create Stripe customer id for this user
  const { error: idError, customerId } = await getOrCreateCustomerId({ supabaseServiceRole, user });
  if (idError || !customerId) {
    console.error("Stripe customer error:", idError);
    return { portalUrl: null, sub: null };
  }

  // 2) Create portal link (never throw)
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

  // 3) Read current subscription (never throw)
  try {
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.items.data.price.product"],
      limit: 3
    });

    // Prefer a non-canceled sub; fallback to the most recent if all canceled
    const sub = subs.data.find(s => s.status !== "canceled") ?? subs.data[0] ?? null;
    if (!sub) return { portalUrl, sub: null };

    const item = sub.items.data[0];
    const price = item?.price ?? null;
    const product = (price?.product ?? null) as Stripe.Product | null;

    const interval = price?.recurring?.interval ?? null; // 'day' | 'week' | 'month' | 'year' | null
    const trialEnds = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
    const nextBill = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;

    return {
      portalUrl,
      sub: {
        status: sub.status,
        planName: product?.name ?? "Subscription",
        interval,
        trialEnds,
        nextBill
      }
    };
  } catch (e) {
    console.error("Read subscription error:", e);
    return { portalUrl, sub: null };
  }
};
