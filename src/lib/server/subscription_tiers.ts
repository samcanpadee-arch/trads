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

export type Tier = "free" | "standard" | "pro";

/**
 * Read the user's tier without mutating anything:
 * - Reads profiles.stripe_customer_id via service role
 * - If missing, returns "free"
 * - Otherwise, reads Stripe subscriptions and maps the first active item's price id to a tier
 */
export async function getUserTier(locals: {
  safeGetSession: () => Promise<{ session: any; user: { id: string } | null }>;
  supabaseServiceRole: any;
}): Promise<Tier> {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) return "free";

  // 1) Read stripe_customer_id from profiles
  const { data: profile, error: profErr } = await locals.supabaseServiceRole
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profErr || !profile?.stripe_customer_id) {
    // No customer yet => treat as free (don't create one here)
    return "free";
  }

  const customerId = profile.stripe_customer_id as string;

  // 2) Get subs and map to tier
  try {
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.items.data.price"],
      limit: 10
    });

    // Prefer a non-canceled subscription
    const current = subs.data.find((s) => s.status !== "canceled") ?? subs.data[0];
    if (!current) return "free";

    const firstItem = current.items.data[0];
    const priceId = typeof firstItem?.price?.id === "string" ? firstItem.price.id : null;
    if (priceId && TIER_BY_PRICE[priceId]) {
      return TIER_BY_PRICE[priceId];
    }
    return "free";
  } catch {
    return "free";
  }
}
