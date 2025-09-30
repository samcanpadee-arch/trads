<script lang="ts">
  import PricingModule from "./pricing_module.svelte";

  // Svelte 5 runes state for the toggle
  let billingInterval = $state<'month' | 'year'>('month');

  // Stripe Price IDs (you provided these)
  const STANDARD_MONTHLY = 'price_1OtoRqKLg7O2VGgDn5t5kB4n';
  const STANDARD_YEARLY  = 'price_1OtoWYKLg7O2VGgDUgm7hmLL';
  const PRO_MONTHLY      = 'price_1OtoSZKLg7O2VGgDU66pqdqm';
  const PRO_YEARLY       = 'price_1OtoXXKLg7O2VGgD6EUiD0Aw';

  // Display amounts
  const PRICE = {
    standard: { month: 'A$29.00', year: 'A$290.00' },
    pro:      { month: 'A$79.00', year: 'A$790.00' }
  };

  function btn(cls: string, active: boolean) {
    return `btn btn-sm ${cls} ${active ? 'bg-primary text-primary-content' : ''}`;
  }

  // Helpers for current interval
  function standardHref() {
    return `/account/subscribe/${billingInterval === 'month' ? STANDARD_MONTHLY : STANDARD_YEARLY}`;
  }
  function proHref() {
    return `/account/subscribe/${billingInterval === 'month' ? PRO_MONTHLY : PRO_YEARLY}`;
  }
</script>

<svelte:head>
  <title>Pricing</title>
</svelte:head>

<!-- Hero -->
<section class="max-w-4xl mx-auto px-4 py-10">
  <h1 class="text-3xl font-bold">Straightforward pricing for Aussie tradies</h1>
  <p class="mt-3 text-gray-600">
    Save hours on quotes, proposals, job notes and emails. Upgrade to Pro to unlock the AI Assistant — answers from your manuals, standards and past jobs.
  </p>
</section>

<!-- Existing cards (unchanged logic) -->
<section class="max-w-5xl mx-auto px-4">
  <PricingModule highlightedPlanId="pro" callToAction="Get started" />
  <p class="mt-4 text-sm text-gray-500">
    Prices include GST. Single user per account. Cancel anytime. Billing by Stripe.
  </p>
</section>

<!-- NEW: Interval toggle + explicit CTAs (page-only, no module edits) -->
<section class="max-w-5xl mx-auto px-4 py-8">
  <div class="rounded-xl border border-gray-200 p-6">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <h2 class="text-xl font-semibold">Choose your billing interval</h2>
      <div class="flex gap-2">
        <button class={btn('', billingInterval === 'month')}  onclick={() => billingInterval = 'month'}>Monthly</button>
        <button class={btn('', billingInterval === 'year')}   onclick={() => billingInterval = 'year'}>Yearly</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <!-- Standard -->
      <div class="p-5 rounded-xl bg-base-200">
        <div class="font-semibold text-lg">Standard</div>
        <div class="mt-1 text-sm text-gray-600">Tools + AI Chat for busy tradies</div>
        <div class="mt-4">
          <div class="text-3xl font-bold">
            {billingInterval === 'month' ? PRICE.standard.month : PRICE.standard.year}
            <span class="text-base font-normal text-gray-400">/ {billingInterval}</span>
          </div>
          <div class="text-xs mt-1 text-gray-500">14-day free trial</div>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <a class="btn btn-primary" href={standardHref()}>
            Get Standard — {billingInterval === 'month' ? 'Monthly' : 'Yearly'}
          </a>
        </div>
        <ul class="mt-4 text-sm space-y-1">
          <li>✅ Unlimited Tools (quotes, proposals, socials)</li>
          <li>✅ AI Chat for job notes & emails</li>
          <li>✅ Single user, cancel anytime</li>
        </ul>
        <p class="mt-3 text-xs text-gray-500">Prices include GST. Single user per account. Cancel anytime. Billing by Stripe.</p>
      </div>

      <!-- Pro -->
      <div class="p-5 rounded-xl bg-base-200">
        <div class="font-semibold text-lg">Pro</div>
        <div class="mt-1 text-sm text-gray-600">Everything in Standard + the AI Assistant</div>
        <div class="mt-4">
          <div class="text-3xl font-bold">
            {billingInterval === 'month' ? PRICE.pro.month : PRICE.pro.year}
            <span class="text-base font-normal text-gray-400">/ {billingInterval}</span>
          </div>
          <div class="text-xs mt-1 text-gray-500">14-day free trial</div>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <a class="btn btn-primary" href={proHref()}>
            Get Pro — {billingInterval === 'month' ? 'Monthly' : 'Yearly'}
          </a>
        </div>
        <ul class="mt-4 text-sm space-y-1">
          <li>✅ AI Assistant answers from your manuals, quotes & emails</li>
          <li>✅ Upload & search your own docs</li>
          <li>✅ Best for tradies who live in their paperwork</li>
        </ul>
        <p class="mt-3 text-xs text-gray-500">Prices include GST. Single user per account. Cancel anytime. Billing by Stripe.</p>
      </div>
    </div>
  </div>
</section>

<!-- What's included -->
<section class="max-w-5xl mx-auto px-4 py-10">
  <h2 class="text-2xl font-semibold mb-4">What’s included</h2>
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
        <tr><td>Proposal / Quote generators</td><td>✅</td><td>✅</td></tr>
        <tr><td>Social post generator</td><td>✅</td><td>✅</td></tr>
        <tr><td>General AI Chat</td><td>✅</td><td>✅</td></tr>
        <tr><td>AI Assistant (library-powered)</td><td>—</td><td>✅</td></tr>
        <tr><td>Upload &amp; search your own docs</td><td>—</td><td>✅</td></tr>
        <tr><td>Email support</td><td>✅</td><td>✅</td></tr>
      </tbody>
    </table>
  </div>
</section>

<!-- FAQs -->
<section class="max-w-3xl mx-auto px-4 pb-16">
  <h2 class="text-2xl font-semibold mb-4">Pricing FAQs</h2>

  <div class="mb-6">
    <h3 class="font-semibold">Do I get a free trial?</h3>
    <p class="text-gray-600">Yes — Standard and Pro include a 14-day free trial.</p>
  </div>

  <div class="mb-6">
    <h3 class="font-semibold">What’s the difference between Standard and Pro?</h3>
    <p class="text-gray-600">Pro adds the AI Assistant that answers from your manuals, quotes and emails, plus document upload and search.</p>
  </div>

  <div class="mb-6">
    <h3 class="font-semibold">Can I switch plans later?</h3>
    <p class="text-gray-600">Yes — upgrade or downgrade anytime in your billing portal.</p>
  </div>

  <div class="mb-6">
    <h3 class="font-semibold">Are prices inclusive of GST?</h3>
    <p class="text-gray-600">Yes — all prices include GST.</p>
  </div>
</section>
