import { PRIVATE_STRIPE_API_KEY } from "$env/static/private"
import Stripe from "stripe"
import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"
import { getExistingCustomerId } from "../subscription_helpers.server"

const stripe = new Stripe(PRIVATE_STRIPE_API_KEY, { apiVersion: "2023-08-16" })

const normalizeSubscription = (sub: Stripe.Subscription | null, productName: string | null) => {
  if (!sub) return null
  const item = sub.items.data[0]
  const price = item?.price ?? null
  const interval = price?.recurring?.interval ?? null
  const trialEnds = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null
  const nextBill = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null
  return {
    status: sub.status,
    planName: productName ?? "Subscription",
    interval,
    trialEnds,
    nextBill,
  }
}

const resolveProductName = async (sub: Stripe.Subscription): Promise<string | null> => {
  const item = sub.items.data[0]
  const price = item?.price
  const prodId = typeof price?.product === "string" ? price.product : price?.product?.id
  if (!prodId) return null
  try {
    const product = await stripe.products.retrieve(prodId)
    return product?.name ?? null
  } catch (error) {
    return null
  }
}

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabaseServiceRole } }) => {
  const { session, user } = await safeGetSession()
  if (!session || !user) {
    return { billingSummary: null }
  }

  const { error: idError, customerId } = await getExistingCustomerId({
    supabaseServiceRole,
    userId: user.id,
  })
  if (idError || !customerId) {
    return { billingSummary: null }
  }

  let found: Stripe.Subscription | null = null
  let productName: string | null = null

  try {
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.items.data.price"],
      limit: 25,
    })

    found = subs.data.find((s) => s.status !== "canceled") ?? subs.data[0] ?? null

    if (!found) {
      const sessions = await stripe.checkout.sessions.list({ customer: customerId, limit: 10 })
      const withSub = sessions.data.find((s) => typeof s.subscription === "string")
      if (withSub && typeof withSub.subscription === "string") {
        found = await stripe.subscriptions.retrieve(withSub.subscription, { expand: ["items.data.price"] })
      }
    }

    if (found) {
      productName = await resolveProductName(found)
    }
  } catch (error) {
    // non-fatal for dashboard
  }

  return { billingSummary: normalizeSubscription(found, productName) }
}

export const actions = {
  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()
    if (session) {
      await supabase.auth.signOut()
      redirect(303, "/")
    }
  },
}
