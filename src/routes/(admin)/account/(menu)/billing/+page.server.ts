import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import Stripe from "stripe";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getOrCreateCustomerId } from "../../subscription_helpers.server";

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabaseServiceRole } }) => {
  const { session, user } = await safeGetSession();
  if (!session) redirect(303, "/login");

  // Resolve Stripe customer
  const { error: idError, customerId } = await getOrCreateCustomerId({ supabaseServiceRole, user });
  if (idError || !customerId) {
    return { portalUrl: null, sub: null };
  }

  // Create portal link (best-effort)
  let portalUrl: string | null = null;
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${url.origin}/account/billing`
    });
    portalUrl = portalSession.url ?? null;
  } catch {}

  // Normalize a subscription
  function normalize(sub: Stripe.Subscription | null, productName: string | null) {
    if (!sub) return null;
    const item = sub.items.data[0];
    const price = item?.price ?? null;
    const interval = price?.recurring?.interval ?? null;
    const trialEnds = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
    const nextBill = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;
    return {
      id: sub.id,
      status: sub.status,
      planName: productName ?? "Subscription",
      interval,
      trialEnds,
      nextBill
    };
  }

  async function getProductNameFromSub(sub: Stripe.Subscription): Promise<string | null> {
    const item = sub.items.data[0];
    const price = item?.price;
    const prodId = typeof price?.product === "string" ? price.product : (price?.product?.id ?? null);
    if (!prodId) return null;
    try {
      const product = await stripe.products.retrieve(prodId);
      return product?.name ?? null;
    } catch {
      return null;
    }
  }

  // Find current subscription (expand price only; fetch product separately)
  let found: Stripe.Subscription | null = null;
  let productName: string | null = null;

  try {
    await stripe.customers.retrieve(customerId as string).catch(() => null);

    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.items.data.price"], // keep within expand depth limits
      limit: 100
    });

    found = subs.data.find(s => s.status !== "canceled") ?? subs.data[0] ?? null;

    if (!found) {
      const sessions = await stripe.checkout.sessions.list({ customer: customerId, limit: 10 });
      const withSub = sessions.data.find(s => typeof s.subscription === "string");
      if (withSub && typeof withSub.subscription === "string") {
        const sub = await stripe.subscriptions.retrieve(withSub.subscription, {
          expand: ["items.data.price"]
        });
        found = sub;
      }
    }

    if (found) {
      productName = await getProductNameFromSub(found);
    }
  } catch {
    // non-fatal
  }

  return { portalUrl, sub: normalize(found, productName) };
};
