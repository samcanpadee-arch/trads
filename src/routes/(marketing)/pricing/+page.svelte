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
    return `btn btn-sm rounded-full transition ${
      active
        ? 'bg-amber-500 text-white shadow-lg'
        : 'bg-white/40 text-slate-700 hover:bg-white/70'
    }`;
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
      <div class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
        <span>✨ 14-day free trial on Standard &amp; Pro for new accounts</span>
      </div>
      <div class="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-2 py-1 shadow-sm">
        <button class={toggleBtn(billingInterval === 'month')} onclick={() => (billingInterval = 'month')}>
          Monthly
        </button>
        <button class={toggleBtn(billingInterval === 'year')} onclick={() => (billingInterval = 'year')}>
          Yearly
        </button>
        {#if isYearly()}
          <span class="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 whitespace-nowrap">
            2 months free
          </span>
        {/if}
      </div>
      <p class="text-xs text-slate-500">
        Prices include GST. One tradie per seat. Billing handled securely via Stripe — upgrade, downgrade, or cancel anytime.
      </p>
      <div class="rounded-[28px] border border-amber-100 bg-white/85 max-w-4xl mx-auto p-6 md:p-8 shadow-lg text-left">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Return on time</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Why tradies say it pays for itself</h2>
        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-slate-100 bg-gradient-to-b from-amber-50/80 to-white p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-600">Hours saved weekly</p>
            <p class="mt-2 text-4xl font-bold text-slate-900">6.5</p>
            <p class="text-sm text-slate-600">Average time back from quotes, emails & manuals.</p>
          </div>
          <div class="rounded-2xl border border-slate-100 bg-gradient-to-b from-emerald-50/70 to-white p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Jobs won</p>
            <p class="mt-2 text-4xl font-bold text-slate-900">+32%</p>
            <p class="text-sm text-slate-600">Subscribers send faster follow-ups & polished comms.</p>
          </div>
          <div class="rounded-2xl border border-slate-100 bg-gradient-to-b from-sky-50/80 to-white p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-sky-600">Payback</p>
            <p class="mt-2 text-4xl font-bold text-slate-900">1 quote</p>
            <p class="text-sm text-slate-600">One signed $3k job covers a year of Standard.</p>
          </div>
        </div>
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p class="text-sm font-semibold text-slate-900">Standard plan</p>
            <p class="text-sm text-slate-600">Unlimited Smart Chat + Smart Tools</p>
            <ul class="mt-3 text-sm text-slate-600 space-y-1">
              <li>• 15–20 mins saved per quote & job note</li>
              <li>• Templates ready to paste into SMS/email</li>
              <li>• Rate-limit meter keeps teams on track</li>
            </ul>
          </div>
          <div class="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <p class="text-sm font-semibold text-slate-900">Pro plan</p>
            <p class="text-sm text-slate-600">Tradie Library + Smart Assistant</p>
            <ul class="mt-3 text-sm text-slate-600 space-y-1">
              <li>• Cite manuals & standards in every answer</li>
              <li>• Upload your own PDFs for niche jobs</li>
              <li>• Best for compliance-heavy installs</li>
            </ul>
          </div>
        </div>
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
          <li class="rounded-2xl border border-slate-200 bg-white/80 p-3">Terms &amp; Conditions Generator</li>
          <li class="rounded-2xl border border-slate-200 bg-white/80 p-3">Job Estimation Wizard</li>
          <li class="rounded-2xl border border-slate-200 bg-white/80 p-3">Scope Guard Day Log + review/social/email generators</li>
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
              <span class="inline-flex items-center rounded-full border border-amber-300 bg-white/80 px-3 py-1 text-xs font-semibold text-amber-600 whitespace-nowrap">
                {savings('standard')}
              </span>
            {/if}
          </div>
          <p class="text-sm text-slate-700">Everything in Free plus Smart Chat.</p>
          <p class="text-xs font-semibold text-emerald-700">Includes a 14-day free trial for new accounts.</p>
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
              <span class="inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap">
                {savings('pro')}
              </span>
            {/if}
          </div>
          <p class="text-sm text-slate-700">Unlock the Tradie Library + Smart Assistant.</p>
          <p class="text-xs font-semibold text-emerald-700">Includes a 14-day free trial for new accounts.</p>
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

  <!-- WHAT'S INCLUDED -->
  <section class="py-12 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-semibold text-center text-slate-900">What’s included</h2>
      <p class="text-sm text-center text-slate-600 mt-2">Same content as before — now in a cleaner table so it’s easier to scan.</p>
      <div class="mt-6 overflow-x-auto rounded-[32px] border border-slate-200 bg-white/90 shadow-sm">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-slate-50 text-slate-900">
              <th class="py-4 px-4 text-left font-semibold">Feature</th>
              <th class="py-4 px-4 text-center font-semibold">Free</th>
              <th class="py-4 px-4 text-center font-semibold">Standard</th>
              <th class="py-4 px-4 text-center font-semibold">Pro</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td class="py-3 px-4">Unlimited usage</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td class="py-3 px-4">6 Smart Tools (quotes, proposals, calculators, reviews, captions, emails)</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td class="py-3 px-4">Smart Chat (AI answers & drafting)</td>
              <td class="text-center">—</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td class="py-3 px-4">Smart Assistant (manual library + your uploads)</td>
              <td class="text-center">—</td>
              <td class="text-center">—</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td class="py-3 px-4">Works on mobile, tablet & desktop</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td class="py-3 px-4">Self-serve upgrades, downgrades & cancellations</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td class="py-3 px-4">14-day free trial</td>
              <td class="text-center">—</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
            </tr>
            <tr>
              <td class="py-3 px-4">GST invoices & Stripe billing</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
              <td class="text-center">✅</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- PRICING FAQ -->
  <section class="py-16 bg-gradient-to-b from-white to-slate-100/70">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-semibold text-center text-slate-900">Pricing FAQs</h2>
      <div class="mt-6 space-y-3">
        <div class="collapse collapse-arrow rounded-2xl border border-slate-200 bg-white">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium">Can I cancel anytime?</div>
          <div class="collapse-content text-sm text-slate-600">
            <p>Yep. Go <strong>Account → Billing → Manage subscription</strong> to open your Stripe portal. Cancel any time; your plan stays active until the end of the current period (no pro-rata refunds).</p>
          </div>
        </div>
        <div class="collapse collapse-arrow rounded-2xl border border-slate-200 bg-white">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium">What happens after the 14-day trial?</div>
          <div class="collapse-content text-sm text-slate-600">
            <p>If you don’t cancel during the trial, your plan starts automatically on the selected tier. You can switch or cancel from Billing at any time.</p>
          </div>
        </div>
        <div class="collapse collapse-arrow rounded-2xl border border-slate-200 bg-white">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium">Do you store my card details?</div>
          <div class="collapse-content text-sm text-slate-600">
            <p>No. Stripe handles payments and is PCI DSS Level 1 compliant. We don’t store card numbers.</p>
          </div>
        </div>
        <div class="collapse collapse-arrow rounded-2xl border border-slate-200 bg-white">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium">Do you issue GST invoices?</div>
          <div class="collapse-content text-sm text-slate-600">
            <p>Yes. Stripe receipts include GST details suitable for bookkeeping.</p>
          </div>
        </div>
        <div class="collapse collapse-arrow rounded-2xl border border-slate-200 bg-white">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium">What’s different about Pro?</div>
          <div class="collapse-content text-sm text-slate-600">
            <p>Pro includes Smart Assistant with our manuals/standards library, uploads of your own PDFs & notes (private by default), and higher usage limits.</p>
          </div>
        </div>
        <div class="collapse collapse-arrow rounded-2xl border border-slate-200 bg-white">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium">Can I use it on multiple devices?</div>
          <div class="collapse-content text-sm text-slate-600">
            <p>Absolutely. Sign in on your phone, tablet, or desktop — same login, same workspace.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
