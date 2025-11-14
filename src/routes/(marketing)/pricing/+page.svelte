<script lang="ts">
  let billingInterval = $state<'month' | 'year'>('month');

  const STANDARD_MONTHLY = 'price_1OtoRqKLg7O2VGgDn5t5kB4n';
  const STANDARD_YEARLY = 'price_1OtoWYKLg7O2VGgDUgm7hmLL';
  const PRO_MONTHLY = 'price_1OtoSZKLg7O2VGgDU66pqdqm';
  const PRO_YEARLY = 'price_1OtoXXKLg7O2VGgD6EUiD0Aw';

  const PRICE = {
    standard: { month: 'A$29.00', year: 'A$290.00', monthlyNumber: 29, yearlyNumber: 290 },
    pro: { month: 'A$79.00', year: 'A$790.00', monthlyNumber: 79, yearlyNumber: 790 }
  };

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
    return `btn btn-sm rounded-full ${active ? 'bg-white text-slate-900 shadow' : 'bg-transparent text-white/80'}`;
  }
</script>

<svelte:head>
  <title>Pricing</title>
</svelte:head>

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 text-slate-900">
  <!-- HERO -->
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-60"
      style="background: radial-gradient(circle at 15% 20%, rgba(251, 191, 36, 0.35), transparent 45%),
        radial-gradient(circle at 85% 0%, rgba(248, 187, 208, 0.35), transparent 60%),
        radial-gradient(circle at 50% 100%, rgba(59, 130, 246, 0.18), transparent 55%);"
    ></div>
    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
      <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Pricing</p>
      <h1 class="text-4xl md:text-5xl font-bold text-slate-900">Straightforward pricing for Aussie tradies</h1>
      <p class="text-lg text-slate-700">
        Save hours on quotes, proposals, job notes, and emails. Upgrade to Pro to unlock the Tradie Library — thousands of manuals and technical guides with Smart Assistant answers.
      </p>
      <div class="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-2 py-1 shadow-sm">
        <button class={toggleBtn(billingInterval === 'month')} onclick={() => (billingInterval = 'month')}>
          Monthly
        </button>
        <button class={toggleBtn(billingInterval === 'year')} onclick={() => (billingInterval = 'year')}>
          Yearly
        </button>
        {#if isYearly()}
          <span class="text-xs text-amber-600 px-3">2 months free</span>
        {/if}
      </div>
      <p class="text-xs text-slate-500">
        Prices include GST. One tradie per seat. Billing handled securely via Stripe — upgrade, downgrade, or cancel anytime.
      </p>
      <div class="rounded-[28px] border border-dashed border-amber-200 bg-white/80 max-w-3xl mx-auto p-6 text-sm font-medium text-amber-500">
        Pricing graphic placeholder — add plan comparison art here
      </div>
    </div>
  </section>

  <!-- PLAN CARDS -->
  <section class="py-12 bg-white/60">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
      <!-- Free -->
      <article class="rounded-[32px] border border-slate-200 bg-white/90 p-6 flex flex-col shadow-sm">
        <header class="space-y-1">
          <p class="text-sm uppercase tracking-[0.3em] text-slate-500">Free</p>
          <h3 class="text-3xl font-semibold text-slate-900">A$0</h3>
          <p class="text-sm text-slate-600">Stay nimble while you test the waters.</p>
        </header>
        <div class="mt-6 text-sm text-slate-600 space-y-1">
          <p>Unlimited access to Smart Tools</p>
          <p>Export-ready quotes, proposals, socials & emails</p>
          <p>Mobile-friendly — perfect on site</p>
        </div>
        <ul class="mt-6 space-y-3 text-sm">
          <li class="rounded-2xl border border-slate-200 bg-white/80 p-3">Material & Cost Calculator</li>
          <li class="rounded-2xl border border-slate-200 bg-white/80 p-3">Job Estimation Wizard</li>
          <li class="rounded-2xl border border-slate-200 bg-white/80 p-3">Review, social & email generators</li>
        </ul>
        <div class="mt-8">
          <a class="btn btn-outline btn-block border-slate-300 text-slate-900" href="/account">Start free</a>
        </div>
      </article>

      <!-- Standard -->
      <article class="rounded-[32px] border border-amber-200/80 bg-amber-50/80 p-6 flex flex-col shadow-md">
        <header class="space-y-1">
          <p class="text-sm uppercase tracking-[0.3em] text-amber-600">Standard</p>
          <div class="flex items-center justify-between">
            <h3 class="text-3xl font-semibold text-slate-900">
              {isYearly() ? PRICE.standard.year : PRICE.standard.month}
              <span class="text-sm text-slate-500 font-normal">/ {billingInterval}</span>
            </h3>
            {#if isYearly()}
              <span class="badge badge-outline badge-sm border-amber-300 text-amber-600">{savings('standard')}</span>
            {/if}
          </div>
          <p class="text-sm text-slate-700">Everything in Free plus Smart Chat.</p>
        </header>
        <div class="mt-5 text-sm text-slate-600 space-y-2">
          <p>Unlimited Smart Chat conversations</p>
          <p>Ask for quotes, emails, troubleshooting & compliance notes</p>
          <p>Fast responses tuned for trade work</p>
        </div>
        <ul class="mt-6 space-y-3 text-sm">
          <li class="rounded-2xl border border-amber-200 bg-white/70 p-3">All six Smart Tools + Smart Chat</li>
          <li class="rounded-2xl border border-amber-200 bg-white/70 p-3">Keep convo history, docs & prompts synced</li>
          <li class="rounded-2xl border border-amber-200 bg-white/70 p-3">Priority feature updates & support</li>
        </ul>
        <div class="mt-8">
          <a class="btn btn-primary btn-block" href={hrefStandard()}>Go Standard</a>
        </div>
      </article>

      <!-- Pro -->
      <article class="rounded-[32px] border border-slate-200 bg-white/90 p-6 flex flex-col shadow-sm">
        <header class="space-y-1">
          <p class="text-sm uppercase tracking-[0.3em] text-slate-500">Pro</p>
          <div class="flex items-center justify-between">
            <h3 class="text-3xl font-semibold text-slate-900">
              {isYearly() ? PRICE.pro.year : PRICE.pro.month}
              <span class="text-sm text-slate-500 font-normal">/ {billingInterval}</span>
            </h3>
            {#if isYearly()}
              <span class="badge badge-outline badge-sm border-slate-300 text-slate-600">{savings('pro')}</span>
            {/if}
          </div>
          <p class="text-sm text-slate-700">Unlock the Tradie Library + Smart Assistant.</p>
        </header>
        <div class="mt-5 text-sm text-slate-600 space-y-2">
          <p>Smart Assistant answers from manuals, codes & spec sheets</p>
          <p>Reference callouts where possible</p>
          <p>Perfect for teams handling complex installs & compliance</p>
        </div>
        <ul class="mt-6 space-y-3 text-sm">
          <li class="rounded-2xl border border-slate-200 bg-white/80 p-3">Everything in Standard</li>
          <li class="rounded-2xl border border-slate-200 bg-white/80 p-3">Tradie Library with 1,200+ technical documents</li>
          <li class="rounded-2xl border border-slate-200 bg-white/80 p-3">Best-response mode for deep research</li>
        </ul>
        <div class="mt-8">
          <a class="btn btn-outline btn-block border-slate-300 text-slate-900" href={hrefPro()}>Upgrade to Pro</a>
        </div>
      </article>
    </div>
  </section>

  <!-- STRIPE NOTE -->
  <section class="py-12 bg-gradient-to-b from-white to-slate-100/70">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">Manage everything through Stripe</h2>
      <p class="text-sm text-slate-600">
        Change plan tier, update billing info, download invoices, or cancel any time via the secure Stripe portal. Head to <a class="link" href="/account/billing">Account → Billing</a> to open it.
      </p>
    </div>
  </section>
</div>
