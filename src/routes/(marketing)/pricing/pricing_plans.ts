export const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Good for getting started',
    // legacy single-price fallback
    price: 'A$0.00',
    priceIntervalName: '/month',
    stripe_price_id: null,
    stripe_product_id: null,
    // new variants (kept null to avoid linking checkout)
    prices: {
      month: { id: null, amount: 'A$0.00', intervalName: '/month' },
      year:  { id: null, amount: 'A$0.00', intervalName: '/year' }
    },
    features: [
      'Access basic tools',
      'Community support'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Tools + AI Chat for busy tradies',
    // default (legacy) – monthly
    stripe_price_id: 'price_1OtoRqKLg7O2VGgDn5t5kB4n',
    stripe_product_id: 'prod_PjGzjqrk4e9jqn',
    prices: {
      month: {
        id: 'price_1OtoRqKLg7O2VGgDn5t5kB4n',
        amount: 'A$29.00',
        intervalName: '/month'
      },
      year: {
        id: 'price_1OtoWYKLg7O2VGgDUgm7hmLL',
        amount: 'A$290.00',
        intervalName: '/year'
      }
    },
    features: [
      'Unlimited Tools (quotes, proposals, socials)',
      'AI Chat for job notes & emails',
      'Single user, cancel anytime'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Everything in Standard + the AI Assistant',
    // default (legacy) – monthly
    stripe_price_id: 'price_1OtoSZKLg7O2VGgDU66pqdqm',
    stripe_product_id: 'prod_PjH0rFWuElVBjW',
    prices: {
      month: {
        id: 'price_1OtoSZKLg7O2VGgDU66pqdqm',
        amount: 'A$79.00',
        intervalName: '/month'
      },
      year: {
        id: 'price_1OtoXXKLg7O2VGgD6EUiD0Aw',
        amount: 'A$790.00',
        intervalName: '/year'
      }
    },
    features: [
      'AI Assistant answers from your manuals, quotes & emails',
      'Upload & search your own docs',
      'Best for tradies who live in their paperwork'
    ]
  }
];
