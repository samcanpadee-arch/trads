<script lang="ts">
  export let data: {
    portalUrl: string | null;
    sub: {
      id: string;
      status: string;
      planName: string;
      interval: 'day' | 'week' | 'month' | 'year' | null;
      trialEnds: string | null;
      nextBill: string | null;
    } | null;
  };

  function fmt(iso: string | null) {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Stripe price IDs (from your pricing)
  const STANDARD_MONTHLY = 'price_1OtoRqKLg7O2VGgDn5t5kB4n';
  const PRO_MONTHLY = 'price_1OtoSZKLg7O2VGgDU66pqdqm';

  type PlanTier = 'free' | 'standard' | 'pro' | 'paid';

  const planTier: PlanTier = (() => {
    if (!data.sub) return 'free';
    const name = (data.sub.planName ?? '').toLowerCase();
    if (name.includes('pro')) return 'pro';
    if (name.includes('standard')) return 'standard';
    return 'paid';
  })();

  const upsell = (() => {
    if (planTier === 'free') {
      return {
        title: 'Ready for site-ready AI?',
        body:
          'Unlock Standard for smarter chat, or go Pro to add the Tradie Library, quoting workflows, and priority help.',
        badges: ['Standard', 'Pro'],
        actions: [
          { label: 'Upgrade to Standard', href: `/account/subscribe/${STANDARD_MONTHLY}`, primary: true },
          { label: 'Go Pro', href: `/account/subscribe/${PRO_MONTHLY}`, primary: false }
        ],
        list: [
          'Unlimited smart chat responses',
          'Tradie Library answers with manuals & guides',
          'Job-ready workflows for pricing & paperwork'
        ]
      };
    }

    if (planTier === 'standard') {
      return {
        title: 'Pro keeps your whole crew in the know',
        body:
          'Layer in manuals, specs, and the Tradie Library so every quote, SMS, and site note is backed by technical references.',
        badges: ['Pro plan'],
        actions: [{ label: 'Upgrade to Pro', href: `/account/subscribe/${PRO_MONTHLY}`, primary: true }],
        list: [
          'Priority Tradie Assistant chat replies',
          'Tradie Library answers with manuals, specs & guides on tap',
          'Advanced quoting + paperwork automations'
        ]
      };
    }

    return null;
  })();
</script>

<svelte:head>
  <title>Billing</title>
</svelte:head>

<section class="max-w-5xl mx-auto px-4 py-10 space-y-8">
  <header class="rounded-3xl bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 border border-amber-200/70 px-6 py-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Billing & subscriptions</p>
    <h1 class="mt-3 text-3xl font-bold text-gray-900">Keep your plan site-ready</h1>
    <p class="mt-2 text-gray-700 max-w-3xl">
      Review your current plan, check when the next invoice lands, and jump into Stripe to switch tiers,
      update payment methods, download invoices, or manage seats. Everything lives in Stripe so changes are applied instantly.
    </p>
  </header>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <div class="space-y-6">
      <!-- Subscription summary (if present) -->
      {#if data.sub}
        <div class="rounded-xl border border-gray-200 p-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
            <div><span class="font-semibold">Plan:</span> {data.sub.planName}</div>
            <div><span class="font-semibold">Interval:</span> {data.sub.interval ?? '—'}</div>
            <div><span class="font-semibold">Status:</span> {data.sub.status}</div>
            {#if data.sub.trialEnds}
              <div><span class="font-semibold">Trial ends:</span> {fmt(data.sub.trialEnds)}</div>
            {:else if data.sub.nextBill}
              <div><span class="font-semibold">Next bill:</span> {fmt(data.sub.nextBill)}</div>
            {:else}
              <div class="sm:col-span-2 text-gray-500 text-sm">No upcoming billing date available.</div>
            {/if}
          </div>
        </div>

      {:else}
        <!-- FREE PLAN STATE (summary card) -->
        <div class="rounded-xl border border-gray-200 p-5">
          <h2 class="text-lg font-semibold">You’re on the Free plan</h2>
          <p class="mt-1 text-gray-600">
            Upgrade to unlock Standard chat tools or jump to Pro for the full Tradie Library with technical guides and quoting workflows.
          </p>
          <div class="mt-4 flex flex-col sm:flex-row gap-3">
            <a class="btn btn-primary" href={"/account/subscribe/" + STANDARD_MONTHLY}>Get started — Standard</a>
            <a class="btn btn-outline" href={"/account/subscribe/" + PRO_MONTHLY}>Go Pro</a>
          </div>
          <p class="mt-2 text-xs text-gray-500">14-day free trial on paid plans. Prices include GST. Cancel anytime.</p>
        </div>
      {/if}

      <div class="rounded-2xl border border-gray-200 bg-white/80 px-5 py-6 shadow-sm">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Need to make a change?</h3>
            <p class="text-sm text-gray-600">Stripe handles upgrades, downgrades, invoices, and payment info securely.</p>
          </div>
          {#if data.portalUrl}
            <a class="btn btn-primary" href={data.portalUrl}>Manage billing in Stripe</a>
          {:else}
            <button class="btn" disabled>Portal unavailable</button>
          {/if}
        </div>
        <ul class="mt-4 grid gap-2 text-sm text-gray-700">
          <li class="flex items-start gap-2">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-amber-500"></span>
            Update payment method or billing contact details
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-amber-500"></span>
            Change plan tier, start a trial, or cancel
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-amber-500"></span>
            Download invoices and receipts for your records
          </li>
        </ul>
      </div>
    </div>

    {#if upsell}
      <aside class="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 shadow-inner space-y-5">
        <div class="flex gap-2 flex-wrap text-xs font-semibold uppercase tracking-widest text-amber-700">
          {#each upsell.badges as badge}
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm">{badge}</span>
          {/each}
        </div>
        <div>
          <h3 class="text-2xl font-bold text-gray-900">{upsell.title}</h3>
          <p class="mt-2 text-sm text-gray-700">{upsell.body}</p>
        </div>
        <ul class="space-y-2 text-sm text-gray-800">
          {#each upsell.list as item}
            <li class="flex gap-2">
              <span class="text-amber-600">•</span>
              <span>{item}</span>
            </li>
          {/each}
        </ul>
        <div class="flex flex-col gap-2">
          {#each upsell.actions as action}
            <a
              class={`btn ${action.primary ? 'btn-primary' : 'btn-outline'}`}
              href={action.href}
            >{action.label}</a>
          {/each}
        </div>
        <p class="text-xs text-gray-600">All upgrades run through Stripe so you can change tiers anytime.</p>
      </aside>
    {:else}
      <aside class="rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-inner">
        <h3 class="text-lg font-semibold text-gray-900">You're all set</h3>
        <p class="mt-2 text-sm text-gray-600">
          Pro plans already include the Tradie Library, workflows, and priority chat. Visit Stripe any time if you need to update billing.
        </p>
        {#if data.portalUrl}
          <a class="btn btn-ghost mt-4" href={data.portalUrl}>Open billing portal</a>
        {/if}
      </aside>
    {/if}
  </div>
</section>
