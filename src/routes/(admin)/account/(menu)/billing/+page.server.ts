import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import Stripe from "stripe";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getOrCreateCustomerId } from "../../subscription_helpers.server";

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabaseServiceRole } }) => {
  const debug = url.searchParams.get('debug') === '1';

  const { session, user } = await safeGetSession();
  if (!session) redirect(303, "/login");

  // 1) Resolve Stripe customer
  const { error: idError, customerId } = await getOrCreateCustomerId({ supabaseServiceRole, user });
  if (idError || !customerId) {
    return { portalUrl: null, sub: null, debug: debug ? { customerId: null, error: String(idError || 'no_customer') } : undefined };
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
    // swallow
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
      status: sub.status,
      planName: product?.name ?? "Subscription",
      interval,
      trialEnds,
      nextBill
    };
  }

  // 3) Collect data defensively
  let found: Stripe.Subscription | null = null;
  let dbg: any = debug ? { customerId, steps: [] as any[] } : undefined;

  try {
    // a) make sure the customer exists
    const customer = await stripe.customers.retrieve(customerId as string).catch(() => null);
    if (dbg) dbg.steps.push({ step: 'retrieve_customer', ok: !!customer, customerId });

    // b) list subscriptions broadly
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.items.data.price.product"],
      limit: 100
    });
    if (dbg) dbg.steps.push({
      step: 'list_subscriptions',
      count: subs.data.length,
      ids: subs.data.map(s => ({ id: s.id, status: s.status }))
    });

    // prefer a non-canceled one; otherwise most recent
    found = subs.data.find(s => s.status !== "canceled") ?? subs.data[0] ?? null;

    // c) fallback: recent checkout sessions that created a sub
    if (!found) {
      const sessions = await stripe.checkout.sessions.list({ customer: customerId, limit: 10 });
      if (dbg) dbg.steps.push({
        step: 'list_checkout_sessions',
        count: sessions.data.length,
        subs: sessions.data.map(s => ({
          id: s.id,
          subscription: typeof s.subscription === 'string' ? s.subscription : null,
          mode: s.mode
        }))
      });
      const withSub = sessions.data.find(s => typeof s.subscription === "string");
      if (withSub && typeof withSub.subscription === "string") {
        const sub = await stripe.subscriptions.retrieve(withSub.subscription, {
          expand: ["items.data.price.product"]
        });
        found = sub;
        if (dbg) dbg.steps.push({ step: 'retrieve_fallback_sub', id: sub.id, status: sub.status });
      }
    }
  } catch (e: any) {
    if (dbg) dbg.steps.push({ step: 'error', message: String(e?.message || e) });
  }

  return {
    portalUrl,
    sub: normalize(found),
    debug: dbg
  };
};
