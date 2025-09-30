export type Plan = {
  id: 'free' | 'standard' | 'pro';
  name: string;
  tagline: string;
  monthlyAmountAUD: number | null;  // show-only
  yearlyAmountAUD: number | null;   // show-only
  monthlyPriceId?: string;          // Stripe price for /account/subscribe/*
  yearlyPriceId?: string;
  features: string[];
  trialDays: number;
  isPopular?: boolean;
};

const STANDARD_MONTHLY = 'price_1OtoRqKLg7O2VGgDn5t5kB4n'; // known working
const STANDARD_YEARLY  = 'price_1OtoWYKLg7O2VGgDUgm7hmLL'; // known working
// TODO: replace these two with your real Pro price IDs when ready
const PRO_MONTHLY = '';
const PRO_YEARLY  = '';

export const pricingPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Kick the tyres — basic tools, 0 cost',
    monthlyAmountAUD: 0,
    yearlyAmountAUD: 0,
    // no Stripe price IDs for free — just sends user to sign up
    features: [
      'Proposal / Quote generators',
      'Social post generator',
      'General AI Chat',
      'Email support'
    ],
    trialDays: 0
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Tools + AI Chat for busy tradies',
    monthlyAmountAUD: 29,
    yearlyAmountAUD: 290, // 2 months free
    monthlyPriceId: STANDARD_MONTHLY,
    yearlyPriceId: STANDARD_YEARLY,
    features: [
      'Unlimited Tools (quotes, proposals, socials)',
      'AI Chat for job notes & emails',
      'Single user, cancel anytime'
    ],
    trialDays: 14,
    isPopular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Everything in Standard + the AI Assistant',
    monthlyAmountAUD: 79,
    yearlyAmountAUD: 790, // 2 months free
    monthlyPriceId: PRO_MONTHLY, // leave empty until you have real IDs
    yearlyPriceId: PRO_YEARLY,
    features: [
      'AI Assistant: answers from manuals, quotes & emails',
      'Upload & search your own docs',
      'Best for tradies living in paperwork'
    ],
    trialDays: 14
  }
];

// Keep older imports happy (billing used to import these)
export const defaultPlanId: Plan['id'] = 'standard';
export const legacyPlans = pricingPlans;
