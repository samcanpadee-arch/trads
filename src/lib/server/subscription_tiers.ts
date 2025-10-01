import Stripe from "stripe";
import { PRIVATE_STRIPE_API_KEY } from "$env/static/private";
import type { Database } from "$lib/types/supabase"; // if you don't have this, remove the type and use 'any'
import { getOrCreateCustomerId } from "$routes/(admin)/account/(menu)/subscription_helpers.server"; // adjust path if needed

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" });

// Map Stripe price IDs to our app tiers
const TIER_BY_PRICE: Record<string, "free" | "standard" | "pro"> = {
  // Standard
  "price_1OtoRqKLg7O2VGgDn5t5kB4n": "standard", // monthly
  "price_1OtoWYKLg7O2VGgDUgm7hmLL": "standard", // yearly
  // Pro
  "price_1OtoSZKLg7O2VGgDU66pqdqm": "pro",      // monthly
  "price_1OtoXXKLg7O2VGgD6EUiD0Aw": "pro",      // yearly
};

export type Tier = "free" | "standard" | "pro";

export async function getUserTier(locals: {
  safeGetSession: () => Promise<{ session: any; user: { id: string } | null }>;
  supabaseServiceRole: any;
}): Promise<Tier> {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) return "free";

  // Resolve Stripe customer
  const { error, customerId } = await getOrCreateCustomerId({
    supabaseServiceRole: locals.supabaseServiceRole,
    user
  });
  if (error || !customerId) return "free";

  // Fetch latest subscription and derive tier by price id
  try {
    const subs = await stripe.subscriptions.list({
      customer: customerId as string,
      status: "all",
      expand: ["data.items.data.price"],
      limit: 10
    });

    // pick an active (not canceled) subscription first
    const current = subs.data.find(s => s.status !== "canceled") ?? subs.data[0];
    if (!current) return "free";

    const firstItem = current.items.data[0];
    const priceId =
      typeof firstItem?.price?.id === "string" ? firstItem.price.id : null;

    if (priceId && TIER_BY_PRICE[priceId]) {
      return TIER_BY_PRICE[priceId];
    }
    // unknown price -> treat as free (conservative)
    return "free";
  } catch {
    return "free";
  }
}
