<script lang="ts">
  import { pricingPlans } from "./pricing_plans";

  type Interval = 'month' | 'year';
  let interval: Interval = 'month';

  // format helpers
  const money = (n: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD" }).format(n);

  const priceIdFor = (plan: any, when: Interval) =>
    when === 'month' ? plan.stripe_price_id : plan.stripe_price_id_year;

  const hrefFor = (plan: any, when: Interval) => {
    const pid = priceIdFor(plan, when);
    return pid ? `/account/subscribe/${pid}` : undefined;
  };
</script>

<!-- Hero / intro -->
<section class="mx-auto max-w-5xl px-4 pt-10 pb-4 text-center">
  <h1 class="text-3xl md:text-4xl font-bold">Straightforward pricing for Aussie tradies</h1>
  <p class="mt-3 text-base md:text-lg opacity-80">
    Save hours on quotes, proposals, job notes and emails. Upgrade to Pro to unlock the
    <b>AI Assistant</b> — answers from your manuals, standards and past jobs.
  </p>

  <!-- interval toggle -->
  <div class="mt-6 inline-flex items-center gap-3 rounded-xl border px-3 py-2">
    <button
      class="btn btn-sm"
      class:btn-primary={interval === 'month'}
      class:btn-ghost={interval !== 'month'}
      on:click={() => (interval = 'month')}
      aria-pressed={interval === 'month'}
    >
      Monthly
    </button>
    <span class="opacity-60">/</span>
    <button
      class="btn btn-sm"
      class:btn-primary={interval === 'year'}
      class:btn-ghost={interval !== 'year'}
      on:click={() => (interval = 'year')}
      aria-pressed={interval === 'year'}
    >
      Yearly <span class="ml-1 text-xs opacity-70">(2 months free)</span>
    </button>
  </div>
</section>

<!-- Plans -->
<section class="mx-auto max-w-5xl px-4 pb-10 grid md:grid-cols-2 gap-6">
  {#each pricingPlans as plan}
    <article class="card bg-base-100 shadow-md border">
      <div class="card-body">
        <h3 class="card-title text-2xl">{plan.name}</h3>
        <p class="opacity-80">{plan.subtitle}</p>

        <!-- price line -->
        <div class="mt-4 flex items-end gap-2">
          <div class="text-4xl font-extrabold leading-none">
            {interval === 'month' ? money(plan.display.monthAud) : money(plan.display.yearAud)}
          </div>
          <div class="opacity-70 mb-1">
            / {interval === 'month' ? 'month' : 'year'}
          </div>
        </div>

        <!-- badges -->
        <div class="mt-2 flex flex-wrap items-center gap-2">
          {#if plan.display.trialLabel}
            <span class="badge badge-info">{plan.display.trialLabel}</span>
          {/if}
          {#if interval === 'year' && plan.display.yearlySavingsLabel}
            <span class="badge badge-success">{plan.display.yearlySavingsLabel}</span>
          {/if}
        </div>

        <!-- bullets -->
        <ul class="mt-4 space-y-2">
          {#each plan.bullets as b}
            <li class="flex items-start gap-2">
              <span class="mt-1">✅</span>
              <span>{b}</span>
            </li>
          {/each}
        </ul>

        <!-- CTA -->
        <div class="mt-6">
          {#if hrefFor(plan, interval)}
            <a class="btn btn-primary w-full" href={hrefFor(plan, interval)}>Get started</a>
          {:else}
            <button class="btn w-full" disabled>Yearly price coming soon</button>
          {/if}
        </div>

        <p class="mt-2 text-xs opacity-70">
          Prices include GST. Single user per account. Cancel anytime. Billing by Stripe.
        </p>
      </div>
    </article>
  {/each}
</section>

<!-- Feature comparison -->
<section class="mx-auto max-w-5xl px-4 pb-10">
  <h2 class="text-xl font-semibold mb-3">What’s included</h2>
  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Standard</th>
          <th>Pro</th>
        </tr>
      </thead>
      <tbody>
        {#each pricingPlans[0].features as row, i}
          <tr>
            <td class="whitespace-normal">{row.label}</td>
            <td>{typeof row.standard === 'boolean' ? (row.standard ? '✅' : '—') : row.standard}</td>
            <td>{typeof row.pro === 'boolean' ? (row.pro ? '✅' : '—') : row.pro}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<!-- FAQ -->
<section class="mx-auto max-w-5xl px-4 pb-16">
  <h2 class="text-xl font-semibold mb-4">Pricing FAQs</h2>
  <div class="join join-vertical w-full">
    <div class="collapse collapse-arrow join-item border">
      <input type="checkbox" />
      <div class="collapse-title text-base font-medium">
        Do I get a free trial?
      </div>
      <div class="collapse-content">
        <p>Yep — both Standard and Pro include a <b>14-day free trial</b>. You can cancel anytime before it ends.</p>
      </div>
    </div>

    <div class="collapse collapse-arrow join-item border">
      <input type="checkbox" />
      <div class="collapse-title text-base font-medium">
        What’s the difference between Standard and Pro?
      </div>
      <div class="collapse-content">
        <p><b>Standard</b> gives you all the Tools and AI Chat. <b>Pro</b> adds the AI Assistant that can answer questions from your own manuals, quotes and emails, plus upload & search your docs.</p>
      </div>
    </div>

    <div class="collapse collapse-arrow join-item border">
      <input type="checkbox" />
      <div class="collapse-title text-base font-medium">
        Can I switch plans later?
      </div>
      <div class="collapse-content">
        <p>Yep. You can upgrade or downgrade anytime from the billing portal. Changes prorate automatically.</p>
      </div>
    </div>

    <div class="collapse collapse-arrow join-item border">
      <input type="checkbox" />
      <div class="collapse-title text-base font-medium">
        Are prices inclusive of GST?
      </div>
      <div class="collapse-content">
        <p>Yes, all prices are in AUD and include GST.</p>
      </div>
    </div>
  </div>
</section>
