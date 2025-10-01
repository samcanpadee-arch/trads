<script lang="ts">
  // Monthly/Yearly toggle (Svelte 5 runes)
  let billingInterval = $state<'month' | 'year'>('month');

  // Stripe price IDs
  const STANDARD_MONTHLY = 'price_1OtoRqKLg7O2VGgDn5t5kB4n';
  const STANDARD_YEARLY  = 'price_1OtoWYKLg7O2VGgDUgm7hmLL';
  const PRO_MONTHLY      = 'price_1OtoSZKLg7O2VGgDU66pqdqm';
  const PRO_YEARLY       = 'price_1OtoXXKLg7O2VGgD6EUiD0Aw';

  // Display amounts
  const PRICE = {
    standard: { month: 'A$29.00', year: 'A$290.00', m: 29 },
    pro:      { month: 'A$79.00', year: 'A$790.00', m: 79 }
  };

  const savings = (p: 'standard' | 'pro') => `2 months free (save A$${PRICE[p].m * 2})`;

  // CTA hrefs
  const hrefStd = () =>
    `/account/subscribe/${billingInterval === 'month' ? STANDARD_MONTHLY : STANDARD_YEARLY}`;
  const hrefPro = () =>
    `/account/subscribe/${billingInterval === 'month' ? PRO_MONTHLY : PRO_YEARLY}`;
</script>

<section class="max-w-4xl mx-auto px-4 pt-10">
  <h1 class="text-3xl font-bold text-center">Select a Plan</h1>
  <p class="mt-3 text-gray-600 text-center">
    View our pricing page for details, or choose below to continue to checkout.
  </p>
</section>

<!-- Toggle + note -->
<section class="max-w-5xl mx-auto px-4 mt-8">
  <div class="flex items-center justify-center gap-2">
    <button class={"btn btn-sm " + (billingInterval === 'month' ? 'bg-primary text-primary-content' : '')}
            onclick={() => billingInterval = 'month'}>Monthly</button>
    <button class={"btn btn-sm " + (billingInterval === 'year' ? 'bg-primary text-primary-content' : '')}
            onclick={() => billingInterval = 'year'}>Yearly</button>
  </div>
  <p class="mt-3 text-sm text-gray-500 text-center">
    Prices include GST. Single user per account. Cancel anytime. Billing by Stripe.
  </p>
</section>

<!-- 3 cards -->
<section class="max-w-6xl mx-auto px-4 py-8">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
    <!-- Free -->
    <div class="card card-bordered shadow-lg h-full">
      <div class="card-body flex flex-col">
        <h3 class="card-title">Free</h3>
        <p class="text-gray-600">Good for getting started</p>
        <div class="pt-4">
          <div class="text-3xl font-bold">A$0.00 <span class="text-base text-gray-400">/ month</span></div>
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
          {#if billingInterval === 'year'}
            <span class="badge badge-primary badge-outline whitespace-nowrap">{savings('standard')}</span>
          {/if}
        </div>
        <p class="text-gray-600">Tools + AI Chat for busy tradies</p>
        <div class="pt-4">
          <div class="text-3xl font-bold">
            {billingInterval === 'month' ? PRICE.standard.month : PRICE.standard.year}
            <span class="text-base text-gray-400">/ {billingInterval}</span>
          </div>
          <div class="text-xs mt-1 text-gray-500">14-day free trial</div>
        </div>
        <ul class="mt-4 text-sm space-y-1">
          <li>✅ Unlimited Tools (quotes, proposals, socials)</li>
          <li>✅ AI Chat for job notes & emails</li>
          <li>✅ Single user, cancel anytime</li>
        </ul>
        <div class="mt-auto pt-6">
          <a class="btn btn-primary w-full" href={hrefStd()}>Get started</a>
        </div>
      </div>
    </div>

    <!-- Pro -->
    <div class="card card-bordered shadow-lg h-full">
      <div class="card-body flex flex-col">
        <div class="flex items-center justify-between">
          <h3 class="card-title">Pro</h3>
          {#if billingInterval === 'year'}
            <span class="badge badge-primary badge-outline whitespace-nowrap">{savings('pro')}</span>
          {/if}
        </div>
        <p class="text-gray-600">Everything in Standard + the AI Assistant</p>
        <div class="pt-4">
          <div class="text-3xl font-bold">
            {billingInterval === 'month' ? PRICE.pro.month : PRICE.pro.year}
            <span class="text-base text-gray-400">/ {billingInterval}</span>
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

<!-- What's included -->
<section class="max-w-6xl mx-auto px-4 pb-16">
  <h2 class="text-2xl font-semibold mb-4 text-center">What’s included</h2>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Feature</th><th>Free</th><th>Standard</th><th>Pro</th>
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
