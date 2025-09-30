import type { RequestHandler } from "./$types";
import Stripe from "stripe";
import { getOrCreateCustomerId } from "../../subscription_helpers.server";
import { error, redirect } from "@sveltejs/kit";

const stripe = new Stripe(process.env.PRIVATE_STRIPE_API_KEY as string, { apiVersion: "2024-06-20" });

export const GET: RequestHandler = async ({ url, locals }) => {
  const { user, supabaseServiceRole } = locals;
  if (!user) throw redirect(303, "/login");

  const { customerId } = await getOrCreateCustomerId({ supabaseServiceRole, user });
  if (!customerId) {
    // No customer means no active subscription yet → go choose a plan
    throw redirect(303, "/account/select_plan");
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${url.origin}/account/billing`
  });

  if (!portal.url) throw error(500, "Stripe did not return a portal URL");
  throw redirect(303, portal.url);
};
