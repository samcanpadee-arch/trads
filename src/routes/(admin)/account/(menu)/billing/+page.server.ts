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

  // Prepare debug object up-front
  const debug: any = {
    customerId: customerId ?? null,
    getOrCreateError: idError ? String(idError) : null,
    steps: [] as any[]
  };

  if (!customerId) {
    return { portalUrl: null, sub: null, debug };
  }

  // 2) Create a billing portal link (non-fatal)
  let portalUrl: string | null = null;
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${url.origin}/account/billing`
    });
    portalUrl = portalSession.url ?? null;
    debug.steps.push({ step: "create_portal_session", ok: !!portalUrl });
  } catch (e: any) {
    debug.steps.push({ step: "create_portal_session_error", message: String(e?.message || e) });
  }

  // helper: normalize a subscription for UI
  function normalize(sub: Stripe.Subscription | null) {
    if (!sub) return null;
    const item = sub.items.data[0];
    const price = item?.price ?? null;
    const product = (price?.product ?? null) as Stripe.Product | null;
    const interval = price?.recurring?.interval ?? null;
    const trialEnds = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
    const nextBill = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;
    return {
      id: sub.id,
      status: sub.status,
      planName: product?.name ?? "Subscription",
      interval,
      trialEnds,
      nextBill
    };
  }

  // 3) Robust find: list subs (all) then fallback via checkout sessions
  let found: Stripe.Subscription | null = null;
  try {
    // a) Customer presence
    const customer = await stripe.customers.retrieve(customerId as string).catch(() => null);
    debug.steps.push({ step: "retrieve_customer", ok: !!customer });

    // b) List subscriptions (broad)
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.items.data.price.product"],
      limit: 100
    });
    debug.steps.push({
      step: "list_subscriptions",
      count: subs.data.length,
      ids: subs.data.map(s => ({ id: s.id, status: s.status }))
    });

    found = subs.data.find(s => s.status !== "canceled") ?? subs.data[0] ?? null;

    // c) Fallback: recent checkout sessions
    if (!found) {
      const sessions = await stripe.checkout.sessions.list({ customer: customerId, limit: 10 });
      debug.steps.push({
        step: "list_checkout_sessions",
        count: sessions.data.length,
        subs: sessions.data.map(s => ({
          id: s.id,
          subscription: typeof s.subscription === "string" ? s.subscription : null,
          mode: s.mode
        }))
      });
      const withSub = sessions.data.find(s => typeof s.subscription === "string");
      if (withSub && typeof withSub.subscription === "string") {
        const sub = await stripe.subscriptions.retrieve(withSub.subscription, {
          expand: ["items.data.price.product"]
        });
        found = sub;
        debug.steps.push({ step: "retrieve_fallback_subscription", id: sub.id, status: sub.status });
      }
    }
  } catch (e: any) {
    debug.steps.push({ step: "read_error", message: String(e?.message || e) });
  }

  const sub = normalize(found);
  if (sub) debug.steps.push({ step: "normalized", sub });

  return { portalUrl, sub, debug };
};
