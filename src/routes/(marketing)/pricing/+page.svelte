<script lang="ts">
  import { pricingPlans } from "./pricing_plans";

  let yearly = false;

  function priceId(plan: any) {
    return yearly ? plan.yearlyPriceId : plan.monthlyPriceId;
  }
  function priceLabel(plan: any) {
    if (plan.id === 'free') return 'Free';
    const amt = yearly ? plan.yearlyAmountAUD : plan.monthlyAmountAUD;
    const unit = yearly ? '/ year' : '/ month';
    return `A$${amt?.toFixed(0)} ${unit}`;
  }
  function ctaHref(plan: any) {
    if (plan.id === 'free') return '/login/sign_up';
    const pid = priceId(plan);
    return pid ? `/account/subscribe/${pid}` : '/account/select_plan';
  }
  function ctaText(plan: any) {
    if (plan.id === 'free') return 'Get started free';
    return plan.trialDays ? `Start ${plan.trialDays}-day free trial` : 'Get started';
  }
</script>

<section class="px-4 py-12 max-w-6xl mx-auto">
  <div class="text-center mb-8">
    <h1 class="text-3xl md:text-4xl font-bold">Straightforward pricing for Aussie tradies</h1>
    <p class="mt-2 opacity-80">Save hours on quotes, proposals, job notes and emails. Upgrade to Pro to unlock the AI Assistant — answers from your manuals, standards and past jobs.</p>
  </div>

  <div class="mb-6 flex items-center justify-center gap-3">
    <span class="opacity-70">Monthly</span>
    <label class="swap">
      <input type="checkbox" bind:checked={yearly} />
      <div class="swap-on badge badge-primary">Yearly</div>
      <div class="swap-off badge">Monthly</div>
    </label>
    <span class="opacity-70">Yearly <span class="badge badge-outline ml-1">2 months free</span></span>
  </div>

  <div class="grid md:grid-cols-3 gap-6">
    {#each pricingPlans as plan}
      <div class="card bg-base-100 shadow-lg border {plan.isPopular ? 'border-primary' : 'border-base-200'}">
        <div class="card-body">
          <div class="flex items-center justify-between">
            <h3 class="card-title">{plan.name}</h3>
            {#if plan.isPopular}<span class="badge badge-primary">Most popular</span>{/if}
          </div>
          <p class="opacity-80">{plan.tagline}</p>

          <div class="mt-4">
            <div class="text-3xl font-bold">{priceLabel(plan)}</div>
            {#if plan.trialDays && plan.id !== 'free'}
              <div class="text-sm opacity-70 mt-1">{plan.trialDays}-day free trial</div>
            {/if}
          </div>

          <ul class="mt-4 space-y-2 text-sm">
            {#each plan.features as f}
              <li class="flex items-start gap-2"><span>✅</span><span>{f}</span></li>
            {/each}
          </ul>

          <div class="card-actions mt-6">
            <a class="btn btn-primary w-full" href={ctaHref(plan)}>{ctaText(plan)}</a>
          </div>

          <p class="text-xs opacity-60 mt-3">Prices include GST. Single user per account. Cancel anytime. Billing by Stripe.</p>
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-10">
    <h2 class="text-xl font-semibold mb-3">What’s included</h2>
    <div class="overflow-x-auto">
      <table class="table table-zebra text-sm">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Free</th>
            <th>Standard</th>
            <th>Pro</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Proposal / Quote generators</td><td>✅</td><td>✅</td><td>✅</td></tr>
          <tr><td>Social post generator</td><td>✅</td><td>✅</td><td>✅</td></tr>
          <tr><td>General AI Chat</td><td>✅</td><td>✅</td><td>✅</td></tr>
          <tr><td>AI Assistant (library-powered)</td><td>—</td><td>—</td><td>✅</td></tr>
          <tr><td>Upload & search your docs</td><td>—</td><td>—</td><td>✅</td></tr>
          <tr><td>Email support</td><td>✅</td><td>✅</td><td>✅</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
