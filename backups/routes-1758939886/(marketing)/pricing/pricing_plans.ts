export const defaultPlanId = "free"

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "A free plan to get you started!",
    price: "$0",
    priceIntervalName: "per month",
    stripe_price_id: null,
    features: ["MIT Licence", "Fast Performance", "Stripe Integration"],
  },
  {
    id: "pro",
    name: "Pro",
    description:
      "A plan to test the purchase experience. Try buying this with the test credit card 4242424242424242.",
    price: "$29",
    priceIntervalName: "per month",
    stripe_price_id: "price_1OtoRqKLg7O2VGgDn5t5kB4n",
    stripe_product_id: "prod_PjGzjqrk4e9jqn",
    features: [
      "Everything in Free",
      "Support us with fake money",
      "Test the purchase experience",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "A plan to test the upgrade experience. Try buying this with the test credit card 4242424242424242.",
    price: "$49",
    priceIntervalName: "per month",
    stripe_price_id: "price_1OtoSZKLg7O2VGgDU66pqdqm",
    stripe_product_id: "prod_PjH0rFWuElVBjW",
    features: [
      "Everything in Pro",
      "Try the 'upgrade plan' UX",
      "Still actually free!",
    ],
  },
]
