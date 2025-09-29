/**
 * Final pricing config: two plans, monthly + yearly IDs.
 * IMPORTANT:
 * - Keep `stripe_price_id` as MONTHLY (string) so legacy code still works.
 * - `stripe_price_id_year` is used by the new toggle-aware UI.
 */
export type PlanId = 'standard' | 'pro';

export interface PricingPlan {
  id: PlanId;
  name: string;
  subtitle: string;
  bullets: string[];
  display: {
    monthAud: number;
    yearAud: number;
    yearlySavingsLabel?: string;
    trialLabel?: string; // e.g., "14-day free trial"
  };
  // Legacy monthly price id (string) — kept for backward compatibility
  stripe_price_id: string;
  // NEW: yearly price id (string or null if not set)
  stripe_price_id_year: string | null;
  // Features for comparison table
  features: {
    label: string;
    standard: boolean | string;
    pro: boolean | string;
  }[];
}

// 👉 UPDATE THESE with your real Stripe Price IDs (monthly & yearly)
const STD_MONTHLY = 'price_1OtoRqKLg7O2VGgDn5t5kB4n';
const STD_YEARLY  = null; // e.g., 'price_xxx'; leave null until you create it
const PRO_MONTHLY = 'price_1OtoSZKLg7O2VGgDU66pqdqm';
const PRO_YEARLY  = null; // e.g., 'price_yyy'

export const pricingPlans: PricingPlan[] = [
  {
    id: 'standard',
    name: 'Standard',
    subtitle: 'Tools + AI Chat for busy tradies',
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
    stripe_price_id: STD_MONTHLY,
    stripe_price_id_year: STD_YEARLY,
    features: [
      { label: 'Proposal / Quote generators', standard: true, pro: true },
      { label: 'Social post generator', standard: true, pro: true },
      { label: 'General AI Chat', standard: true, pro: true },
      { label: 'AI Assistant (library-powered)', standard: false, pro: true },
      { label: 'Upload & search your own docs', standard: false, pro: true },
      { label: 'Email support', standard: true, pro: true }
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Everything in Standard + the AI Assistant',
    bullets: [
      'AI Assistant answers from your manuals, quotes & emails',
      'Upload & search your own docs',
      'Best for tradies who live in their paperwork'
    ],
    display: {
      monthAud: 79,
      yearAud: 790,
      yearlySavingsLabel: '2 months free',
      trialLabel: '14-day free trial'
    },
    stripe_price_id: PRO_MONTHLY,
    stripe_price_id_year: PRO_YEARLY,
    features: [
      { label: 'Proposal / Quote generators', standard: true, pro: true },
      { label: 'Social post generator', standard: true, pro: true },
      { label: 'General AI Chat', standard: true, pro: true },
      { label: 'AI Assistant (library-powered)', standard: false, pro: 'Included' },
      { label: 'Upload & search your own docs', standard: false, pro: 'Included' },
      { label: 'Email support', standard: true, pro: 'Priority' }
    ]
  }
];

export const planById = Object.fromEntries(pricingPlans.map(p => [p.id, p]));

export const defaultPlanId: PlanId = 'standard';
