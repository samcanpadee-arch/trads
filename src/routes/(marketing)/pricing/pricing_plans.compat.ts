// Backward-compatible pricing API just for /account/billing.
// Do not change this unless billing changes too.

export type LegacyPlan = {
  id: "free" | "standard" | "pro";
  name: string;
  monthlyPriceId?: string;   // Stripe price IDs
  yearlyPriceId?: string;
  monthlyAmount?: number;    // in AUD (optional; billing page usually doesn't need exact numbers)
  yearlyAmount?: number;     // in AUD (optional)
  trialDays?: number;        // 14-day trial for paid plans
  features?: string[];       // optional
};

const FREE_ID = "free" as const;
const STD_ID  = "standard" as const;
const PRO_ID  = "pro" as const;

// If your repo uses PUBLIC_STRIPE_* env vars on client, billing still runs server-side.
// We keep IDs here so billing has a stable source of truth.
export const legacyPlans: LegacyPlan[] = [
  {
    id: FREE_ID,
    name: "Free",
    trialDays: 0,
    features: ["Basic access"]
  },
  {
    id: STD_ID,
    name: "Standard",
    monthlyPriceId: process.env.PUBLIC_STRIPE_PRICE_STD ?? process.env.STD_MONTHLY ?? "price_1OtoRqKLg7O2VGgDn5t5kB4n",
    yearlyPriceId:  process.env.PUBLIC_STRIPE_PRICE_STD_YEARLY ?? process.env.STD_YEARLY ?? undefined,
    trialDays: 14,
    features: ["All tools", "General AI Chat"]
  },
  {
    id: PRO_ID,
    name: "Pro",
    monthlyPriceId: process.env.PUBLIC_STRIPE_PRICE_PRO ?? process.env.PRO_MONTHLY ?? undefined,
    yearlyPriceId:  process.env.PUBLIC_STRIPE_PRICE_PRO_YEARLY ?? process.env.PRO_YEARLY ?? undefined,
    trialDays: 14,
    features: ["Everything in Standard", "AI Assistant (library-powered)"]
  }
];

// Billing used to import `pricingPlans` and `defaultPlanId`.
export const pricingPlans = legacyPlans;
export const defaultPlanId: LegacyPlan["id"] = STD_ID;

// Tiny helpers some pages used before
export const findPlanByPriceId = (priceId?: string | null) =>
  legacyPlans.find(p => p.monthlyPriceId === priceId || p.yearlyPriceId === priceId) ?? null;

export const getPlan = (id: LegacyPlan["id"]) =>
  legacyPlans.find(p => p.id === id) ?? null;
