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
        <!-- Equal header stack height so price rows align -->
        <div class="min-h-24">
          <h3 class="card-title">Free</h3>
          <p class="text-gray-600">Good for getting started</p>
          <!-- badge placeholder to match other cards -->
          <div class="h-6"></div>
        </div>

        <div class="pt-4">
          <div class="text-3xl font-bold">
            A$0.00 <span class="text-base font-normal text-gray-400">/ {billingInterval}</span>
          </div>
          <div class="text-xs mt-1 text-gray-500">No credit card required</div>
        </div>

        <!-- Top 3 bullets only -->
        <ul class="mt-4 text-sm space-y-1">
          <li>✅ 6 Smart Tools (calculator, estimator, proposal)</li>
          <li>✅ Save &amp; reuse outputs</li>
          <li>✅ Mobile friendly</li>
        </ul>

        <div class="mt-auto pt-6">
          <a class="btn btn-outline w-full" href="/account">Get started</a>
        </div>
      </div>
    </div>

    <!-- Standard -->
    <div class="card card-bordered shadow-lg h-full border-primary">
      <div class="card-body flex flex-col">
        <div class="min-h-24">
          <div class="flex items-center justify-between">
            <h3 class="card-title">Standard</h3>
            {#if isYearly()}
              <span class="badge badge-primary badge-outline whitespace-nowrap">{savings('standard')}</span>
            {:else}
              <span class="h-6 inline-block"></span>
            {/if}
          </div>
          <p class="text-gray-600">Tools + AI Chat for busy tradies</p>
        </div>

        <div class="pt-4">
          <div class="text-3xl font-bold">
            {isYearly() ? PRICE.standard.year : PRICE.standard.month}
            <span class="text-base font-normal text-gray-400">/ {billingInterval}</span>
          </div>
          <div class="text-xs mt-1 text-gray-500">14-day free trial</div>
        </div>

        <!-- Top 3 bullets only -->
        <ul class="mt-4 text-sm space-y-1">
          <li>✅ Everything in Free</li>
          <li>✅ Smart Chat (advice &amp; drafts)</li>
          <li>✅ Longer chats &amp; better session memory</li>
        </ul>

        <div class="mt-auto pt-6">
          <a class="btn btn-primary w-full" href={hrefStandard()}>Get started</a>
        </div>
      </div>
    </div>

    <!-- Pro -->
    <div class="card card-bordered shadow-lg h-full">
      <div class="card-body flex flex-col">
        <div class="min-h-24">
          <div class="flex items-center justify-between">
            <h3 class="card-title">Pro</h3>
            {#if isYearly()}
              <span class="badge badge-primary badge-outline whitespace-nowrap">{savings('pro')}</span>
            {:else}
              <span class="h-6 inline-block"></span>
            {/if}
          </div>
          <p class="text-gray-600">Everything in Standard + the AI Assistant</p>
        </div>

        <div class="pt-4">
          <div class="text-3xl font-bold">
            {isYearly() ? PRICE.pro.year : PRICE.pro.month}
            <span class="text-base font-normal text-gray-400">/ {billingInterval}</span>
          </div>
          <div class="text-xs mt-1 text-gray-500">14-day free trial</div>
        </div>

        <!-- Top 3 bullets only -->
        <ul class="mt-4 text-sm space-y-1">
          <li>✅ Everything in Standard</li>
          <li>✅ Smart Assistant (manuals/standards)</li>
          <li>✅ Upload your PDFs &amp; notes</li>
        </ul>

        <div class="mt-auto pt-6">
          <a class="btn btn-primary w-full" href={hrefPro()}>Get started</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- What's included (content only) -->
<section class="max-w-6xl mx-auto px-4 pb-12">
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
        <tr><td>6 Smart Tools (calculator, estimator, proposal, reviews, captions, emails)</td><td>✅</td><td>✅</td><td>✅</td></tr>
        <tr><td>Smart Chat (advice &amp; drafting)</td><td>—</td><td>✅</td><td>✅</td></tr>
        <tr><td>Smart Assistant (manual/standards search)</td><td>—</td><td>—</td><td>✅</td></tr>
        <tr><td>Upload your docs (private by default)</td><td>—</td><td>—</td><td>✅</td></tr>
        <tr><td>Access shared manual library (sanitised, read-only)</td><td>—</td><td>—</td><td>✅</td></tr>
        <tr><td>Mobile friendly (phone, tablet, desktop)</td><td>✅</td><td>✅</td><td>✅</td></tr>
        <tr><td>Email support</td><td>✅</td><td>✅</td><td>✅</td></tr>
        <tr><td>Priority support</td><td>—</td><td>✅</td><td>✅</td></tr>
        <tr><td>14-day free trial (paid plans)</td><td>—</td><td>✅</td><td>✅</td></tr>
        <tr><td>Billing via Stripe (secure; cancel anytime)</td><td>✅</td><td>✅</td><td>✅</td></tr>
        <tr><td>GST invoices available</td><td>✅</td><td>✅</td><td>✅</td></tr>
      </tbody>
    </table>
  </div>
</section>

<!-- Pricing FAQs -->
<section class="max-w-4xl mx-auto px-4 pb-20">
  <h2 class="text-2xl font-semibold mb-4 text-center">Pricing FAQs</h2>
  <div class="max-w-3xl mx-auto">
    <div class="collapse collapse-arrow bg-base-200 my-2">
      <input type="checkbox" />
      <div class="collapse-title text-base font-medium">Can I cancel anytime?</div>
      <div class="collapse-content">
        <p>Yep. Go <strong>Account → Billing → Manage billing</strong> to open your Stripe portal. Cancel any time; your plan stays active until the end of the current period (no pro-rata refunds).</p>
      </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200 my-2">
      <input type="checkbox" />
      <div class="collapse-title text-base font-medium">What happens after the 14-day trial?</div>
      <div class="collapse-content">
        <p>If you don’t cancel during the trial, your plan starts automatically on the selected tier. You can switch or cancel from Billing at any time.</p>
      </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200 my-2">
      <input type="checkbox" />
      <div class="collapse-title text-base font-medium">Do you store my card details?</div>
      <div class="collapse-content">
        <p>No. Stripe handles payments and is PCI DSS Level 1 compliant. We don’t store card numbers.</p>
      </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200 my-2">
      <input type="checkbox" />
      <div class="collapse-title text-base font-medium">Do you issue GST invoices?</div>
      <div class="collapse-content">
        <p>Yes. Stripe receipts include GST details suitable for bookkeeping.</p>
      </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200 my-2">
      <input type="checkbox" />
      <div class="collapse-title text-base font-medium">What’s different about Pro?</div>
      <div class="collapse-content">
        <p>Pro includes Smart Assistant with our manuals/standards library, uploads of your own PDFs &amp; notes (private by default), and higher usage limits.</p>
      </div>
    </div>

    <div class="collapse collapse-arrow bg-base-200 my-2">
      <input type="checkbox" />
      <div class="collapse-title text-base font-medium">Can I use it on multiple devices?</div>
      <div class="collapse-content">
        <p>Absolutely. Sign in on your phone, tablet, or desktop — same login, same workspace.</p>
      </div>
    </div>
  </div>
</section>
