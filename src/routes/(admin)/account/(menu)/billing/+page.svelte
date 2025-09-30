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
  const PRO_MONTHLY      = 'price_1OtoSZKLg7O2VGgDU66pqdqm';
</script>

<section class="max-w-3xl mx-auto px-4 py-10 space-y-6">
  <header>
    <h1 class="text-2xl font-bold">Billing</h1>
    <p class="mt-2 text-gray-600">Manage your subscription, payment method and invoices in Stripe.</p>
  </header>

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

    <div>
      {#if data.portalUrl}
        <a class="btn btn-primary" href={data.portalUrl}>Manage Billing</a>
      {:else}
        <button class="btn" disabled>Manage Billing (unavailable)</button>
      {/if}
    </div>

  {:else}
    <!-- FREE PLAN STATE -->
    <div class="rounded-xl border border-gray-200 p-5">
      <h2 class="text-lg font-semibold">You’re on the Free plan</h2>
      <p class="mt-1 text-gray-600">
        Upgrade to unlock AI Chat (Standard) or the full AI Assistant with your manuals & quotes (Pro).
      </p>
      <div class="mt-4 flex flex-col sm:flex-row gap-3">
        <a class="btn btn-primary" href={"/account/subscribe/" + STANDARD_MONTHLY}>Get started — Standard</a>
        <a class="btn btn-outline" href={"/account/subscribe/" + PRO_MONTHLY}>Get started — Pro</a>
        <a class="btn btn-ghost" href="/pricing">See pricing</a>
      </div>
      <p class="mt-2 text-xs text-gray-500">14-day free trial on paid plans. Prices include GST. Cancel anytime.</p>
    </div>
  {/if}
</section>
