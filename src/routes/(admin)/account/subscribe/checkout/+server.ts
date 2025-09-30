import type { RequestHandler } from "./$types";
import Stripe from "stripe";
import { getOrCreateCustomerId } from "../../subscription_helpers.server";
import { error, redirect } from "@sveltejs/kit";

const stripe = new Stripe(process.env.PRIVATE_STRIPE_API_KEY as string, { apiVersion: "2024-06-20" });

export const GET: RequestHandler = async ({ url, locals }) => {
  const price = url.searchParams.get("price");
  if (!price) throw error(400, "Missing price");

  const { user, supabaseServiceRole } = locals;
  if (!user) throw redirect(303, "/login");

  const { customerId } = await getOrCreateCustomerId({ supabaseServiceRole, user });
  if (!customerId) throw error(500, "Could not resolve Stripe customer id");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    // 14-day trial handled at product/price level in Stripe, or uncomment below to force:
    // subscription_data: { trial_period_days: 14 },
    success_url: `${url.origin}/account/billing?success=1`,
    cancel_url: `${url.origin}/account/billing?canceled=1`
  });

  if (!session.url) throw error(500, "Stripe did not return a session URL");
  throw redirect(303, session.url);
};
