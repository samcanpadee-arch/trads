import Stripe from "stripe";
import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });

/** Map Stripe price IDs to tiers */
const TIER_BY_PRICE: Record<string, "free" | "standard" | "pro"> = {
  // Standard
  "price_1OtoRqKLg7O2VGgDn5t5kB4n": "standard", // monthly
  "price_1OtoWYKLg7O2VGgDUgm7hmLL": "standard", // yearly
  // Pro
  "price_1OtoSZKLg7O2VGgDU66pqdqm": "pro",      // monthly
  "price_1OtoXXKLg7O2VGgD6EUiD0Aw": "pro",      // yearly
};

type Tier = "free" | "standard" | "pro";
export type { Tier };

async function ensureCustomerId(locals: {
  supabaseServiceRole: any;
  safeGetSession: () => Promise<{ session: any; user: { id: string; email?: string|null } | null }>;
}): Promise<string | null> {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) return null;

  // 1) Try profiles.stripe_customer_id
  const { data: prof } = await locals.supabaseServiceRole
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (prof?.stripe_customer_id) return prof.stripe_customer_id as string;

  // 2) Fallback: try to find existing customer by email
  const email = user.email ?? undefined;
  let customerId: string | null = null;

  try {
    if (email) {
      const found = await stripe.customers.list({ email, limit: 1 });
      if (found.data[0]?.id) customerId = found.data[0].id;
    }

    // 3) If not found, create a new customer
    if (!customerId) {
      const created = await stripe.customers.create({
        email,
        metadata: { user_id: user.id }
      });
      customerId = created.id;
    }

    // 4) Persist to profiles
    await locals.supabaseServiceRole
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);

    return customerId;
  } catch {
    return null;
  }
}

export async function getUserTier(locals: {
  safeGetSession: () => Promise<{ session: any; user: { id: string; email?: string|null } | null }>;
  supabaseServiceRole: any;
}): Promise<Tier> {
  const customerId = await ensureCustomerId(locals);
  if (!customerId) return "free";

  try {
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.items.data.price"],
      limit: 10
    });

    if (!subs.data.length) return "free";

    // Prefer: active > trialing > past_due > unpaid > everything else
    const rank: Record<string, number> = {
      active: 0,
      trialing: 1,
      past_due: 2,
      unpaid: 3,
      incomplete: 4,
      incomplete_expired: 5,
      paused: 6,
      canceled: 99
    };

    const current = [...subs.data].sort((a, b) => (rank[a.status] ?? 50) - (rank[b.status] ?? 50))[0];
    const firstItem = current?.items?.data?.[0];
    const priceId = typeof firstItem?.price?.id === "string" ? firstItem.price.id : null;

    if (priceId && TIER_BY_PRICE[priceId]) return TIER_BY_PRICE[priceId];
    return "free";
  } catch {
    return "free";
  }
}
