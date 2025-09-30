import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import Stripe from 'stripe';
import { getOrCreateCustomerId } from '../../subscription_helpers.server';

export const GET: RequestHandler = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();
  if (!session || !user) throw error(401, 'not authed');

  const key = env.PRIVATE_STRIPE_API_KEY;
  if (!key) throw error(500, 'no stripe key');

  const stripe = new Stripe(key, { apiVersion: '2024-06-20' } as any);

  const { customerId, error: custErr } = await getOrCreateCustomerId({
    supabaseServiceRole: locals.supabaseServiceRole, user
  });
  if (custErr || !customerId) throw error(500, 'no customer id');

  const subs = await stripe.subscriptions.list({
    customer: customerId, status: 'all',
    expand: ['data.items.data.price.product']
  });

  // Return only the fields we need to wire up pricing_plans.compat.ts
  const out = subs.data.map(s => ({
    id: s.id,
    status: s.status,
    items: s.items.data.map(it => ({
      price_id: it.price?.id,
      price_recurring_interval: it.price?.recurring?.interval,
      product_id: typeof it.price?.product === 'string'
        ? it.price?.product
        : (it.price?.product as any)?.id,
      product_name: typeof it.price?.product === 'string' ? null
        : (it.price?.product as any)?.name
    }))
  }));

  return json({ customerId, subscriptions: out });
};
