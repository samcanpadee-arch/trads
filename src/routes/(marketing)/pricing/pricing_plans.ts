/**
 * Pricing plans config used by the Pricing page UI.
 * Keep structure minimal to avoid breaking template code.
 * NOTE: Update the stripe_price_id fields to your real Price IDs.
 */

export type PlanId = 'standard' | 'pro';
export type BillingInterval = 'month' | 'year';

export interface PricingPlan {
  id: PlanId;
  name: string;
  tagline: string;
  // The UI reads this short description list
  bullets: string[];
  // Shown on the card price line; amounts are for display only
  display: {
    monthAud: number;
    yearAud: number;
    // text shown near the yearly toggle (e.g., "2 months free")
    yearlySavingsLabel?: string;
    trialLabel?: string; // "14-day free trial"
  };
  // Stripe Price IDs for Checkout (use null to disable a button)
  stripe_price_id: {
    month: string | null;
    year: string | null;
  };
  // Feature list shown in the comparison table / FAQ snippets
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Tools + Chat for busy tradies',
    bullets: [
      'Unlimited Tools (quotes, proposals, socials)',
      'AI Chat for job notes & emails',
      'Single user, cancel anytime'
    ],
    display: {
      monthAud: 29,
      yearAud: 290,
      yearlySavingsLabel: '2 months free',
      trialLabel: '14-day free trial'
    },
    stripe_price_id: {
      // ⬇️ replace with your real Standard price IDs
      month: 'price_1OtoRqKLg7O2VGgDn5t5kB4n',
      year: null // add your yearly price id when ready
    },
    features: [
      'All Tools (proposal, post, quote generators)',
      'General AI Chat',
      'Email support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Adds the AI Assistant (library-powered)',
    bullets: [
      'Everything in Standard',
      'AI Assistant answers from your manuals, quotes & emails',
      'Upload & search your own docs'
    ],
    display: {
      monthAud: 79,
      yearAud: 790,
      yearlySavingsLabel: '2 months free',
      trialLabel: '14-day free trial'
    },
    stripe_price_id: {
      // ⬇️ replace with your real Pro price IDs
      month: 'price_1OtoSZKLg7O2VGgDU66pqdqm',
      year: null // add your yearly price id when ready
    },
    features: [
      'All Tools + AI Chat',
      'AI Assistant (library-powered)',
      'Email support'
    ]
  }
];

// Optional helpers some templates use
export const planById = Object.fromEntries(pricingPlans.map(p => [p.id, p]));
export const defaultPlanId: PlanId = 'standard';
