<script lang="ts">
  // Svelte 5 runes state for the toggle
  let billingInterval = $state<'month' | 'year'>('month');

  // Stripe Price IDs
  const STANDARD_MONTHLY = 'price_1OtoRqKLg7O2VGgDn5t5kB4n';
  const STANDARD_YEARLY  = 'price_1OtoWYKLg7O2VGgDUgm7hmLL';
  const PRO_MONTHLY      = 'price_1OtoSZKLg7O2VGgDU66pqdqm';
  const PRO_YEARLY       = 'price_1OtoXXKLg7O2VGgD6EUiD0Aw';

  // Display amounts
  const PRICE = {
    standard: { month: 'A$29.00', year: 'A$290.00', monthlyNumber: 29, yearlyNumber: 290 },
    pro:      { month: 'A$79.00', year: 'A$790.00', monthlyNumber: 79, yearlyNumber: 790 }
  };

  // Savings copy (2 months free)
  function savings(plan: 'standard' | 'pro') {
    const save = PRICE[plan].monthlyNumber * 2;
    return `2 months free (save A$${save})`;
  }

  function isYearly() {
    return billingInterval === 'year';
  }

  function hrefStandard() {
    return `/account/subscribe/${isYearly() ? STANDARD_YEARLY : STANDARD_MONTHLY}`;
  }
  function hrefPro() {
    return `/account/subscribe/${isYearly() ? PRO_YEARLY : PRO_MONTHLY}`;
  }

  function toggleBtn(active: boolean) {
    return `btn btn-sm ${active ? 'bg-primary text-primary-content' : ''}`;
  }
</script>

<svelte:head>
  <title>Pricing</title>
</svelte:head>

<!-- Hero -->
<section class="max-w-4xl mx-auto px-4 pt-10">
  <h1 class="text-3xl font-bold text-center">Straightforward pricing for Aussie tradies</h1>
  <p class="mt-3 text-gray-600 text-center">
    Save hours on quotes, proposals, job notes and emails. Upgrade to Pro to unlock the AI Assistant — answers from your manuals, standards and past jobs.
  </p>
</section>

<!-- Toggle + Note -->
<section class="max-w-5xl mx-auto px-4 mt-8">
  <div class="flex items-center justify-center gap-2">
    <button class={toggleBtn(billingInterval === 'month')} onclick={() => billingInterval = 'month'}>Monthly</button>
    <button class={toggleBtn(billingInterval === 'year')}  onclick={() => billingInterval = 'year'}>Yearly</button>
  </div>
  <p class="mt-3 text-sm text-gray-500 text-center">
    Prices include GST. Single user per account. Cancel anytime. Billing by Stripe.
  </p>
</section>

<!-- Cards -->
<section class="max-w-6xl mx-auto px-4 py-8">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
    <!-- Free -->
    <div class="card card-bordered shadow-lg h-full">
      <div class="card-body flex flex-col">
        <h3 class="card-title">Free</h3>
        <p class="text-gray-600">Good for getting started</p>

        <div class="pt-4">
          <div class="text-3xl font-bold">
            A$0.00 <span class="text-base font-normal text-gray-400">/ month</span>
          </div>
          <div class="text-xs mt-1 text-gray-500">No credit card required</div>
        </div>

        <ul class="mt-4 text-sm space-y-1">
          <li>✅ Access basic tools</li>
          <li>✅ Community support</li>
        </ul>

        <div class="mt-auto pt-6">
          <a class="btn btn-outline w-full" href="/account">Get started</a>
        </div>
      </div>
    </div>

    <!-- Standard -->
    <div class="card card-bordered shadow-lg h-full border-primary">
      <div class="card-body flex flex-col">
        <div class="flex items-center justify-between">
          <h3 class="card-title">Standard</h3>
          {#if isYearly()}
            <span class="badge badge-primary badge-outline whitespace-nowrap">{savings('standard')}</span>
          {/if}
        </div>
        <p class="text-gray-600">Tools + AI Chat for busy tradies</p>

        <div class="pt-4">
          <div class="text-3xl font-bold">
            {isYearly() ? PRICE.standard.year : PRICE.standard.month}
            <span class="text-base font-normal text-gray-400">/ {billingInterval}</span>
          </div>
          <div class="text-xs mt-1 text-gray-500">14-day free trial</div>
        </div>

        <ul class="mt-4 text-sm space-y-1">
          <li>✅ Unlimited Tools (quotes, proposals, socials)</li>
          <li>✅ AI Chat for job notes & emails</li>
          <li>✅ Single user, cancel anytime</li>
        </ul>

        <div class="mt-auto pt-6">
          <a class="btn btn-primary w-full" href={hrefStandard()}>Get started</a>
        </div>
      </div>
    </div>

    <!-- Pro -->
    <div class="card card-bordered shadow-lg h-full">
      <div class="card-body flex flex-col">
        <div class="flex items-center justify-between">
          <h3 class="card-title">Pro</h3>
          {#if isYearly()}
            <span class="badge badge-primary badge-outline whitespace-nowrap">{savings('pro')}</span>
          {/if}
        </div>
        <p class="text-gray-600">Everything in Standard + the AI Assistant</p>

        <div class="pt-4">
          <div class="text-3xl font-bold">
            {isYearly() ? PRICE.pro.year : PRICE.pro.month}
            <span class="text-base font-normal text-gray-400">/ {billingInterval}</span>
          </div>
          <div class="text-xs mt-1 text-gray-500">14-day free trial</div>
        </div>

        <ul class="mt-4 text-sm space-y-1">
          <li>✅ AI Assistant answers from your manuals, quotes & emails</li>
          <li>✅ Upload & search your own docs</li>
          <li>✅ Best for tradies who live in their paperwork</li>
        </ul>

        <div class="mt-auto pt-6">
          <a class="btn btn-primary w-full" href={hrefPro()}>Get started</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- What's included (now has Free column too) -->
<section class="max-w-6xl mx-auto px-4 pb-16">
  <h2 class="text-2xl font-semibold mb-4 text-center">What’s included</h2>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Free</th>
          <th>Standard</th>
          <th>Pro</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Proposal / Quote generators</td><td>—</td><td>✅</td><td>✅</td></tr>
        <tr><td>Social post generator</td><td>—</td><td>✅</td><td>✅</td></tr>
        <tr><td>General AI Chat</td><td>—</td><td>✅</td><td>✅</td></tr>
        <tr><td>AI Assistant (library-powered)</td><td>—</td><td>—</td><td>✅</td></tr>
        <tr><td>Upload &amp; search your own docs</td><td>—</td><td>—</td><td>✅</td></tr>
        <tr><td>Email support</td><td>✅</td><td>✅</td><td>✅</td></tr>
      </tbody>
    </table>
  </div>
</section>
