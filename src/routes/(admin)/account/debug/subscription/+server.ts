import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GET = async () => {
  const key = env.PRIVATE_STRIPE_API_KEY;

  if (!key) {
    return new Response(JSON.stringify({ message: 'no stripe key' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }

  return json({
    hasStripeKey: true,
    keyStartsWith: key.slice(0, 7), // e.g. "sk_test"
    prices: {
      STD_MONTHLY: env.STD_MONTHLY ?? null,
      STD_YEARLY: env.STD_YEARLY ?? null,
      PUBLIC_STRIPE_PRICE_STD: env.PUBLIC_STRIPE_PRICE_STD ?? null,
      PUBLIC_STRIPE_PRICE_STD_YEARLY: env.PUBLIC_STRIPE_PRICE_STD_YEARLY ?? null,
      PUBLIC_STRIPE_PRICE_PRO: env.PUBLIC_STRIPE_PRICE_PRO ?? null,
      PUBLIC_STRIPE_PRICE_PRO_YEARLY: env.PUBLIC_STRIPE_PRICE_PRO_YEARLY ?? null
    }
  });
};
