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
    debug?: any;
  };

  function fmt(iso: string | null) {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
</script>

<section class="max-w-3xl mx-auto px-4 py-10 space-y-6">
  <header>
    <h1 class="text-2xl font-bold">Billing</h1>
    <p class="mt-2 text-gray-600">Manage your subscription, payment method and invoices in Stripe.</p>
  </header>

  <div class="rounded-xl border border-gray-200 p-5">
    {#if data.sub}
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
    {:else}
      <div class="text-gray-600">No active subscription found.</div>
    {/if}
  </div>

  <div>
    {#if data.portalUrl}
      <a class="btn btn-primary" href={data.portalUrl}>Manage Billing</a>
    {:else}
      <button class="btn" disabled>Manage Billing (unavailable)</button>
      <p class="mt-2 text-sm text-error">
        Portal link unavailable. Try again after signing in — or contact support.
      </p>
    {/if}
  </div>

  {#if data.debug}
    <details class="mt-6">
      <summary class="cursor-pointer text-sm opacity-70">Debug details</summary>
      <pre class="mt-3 text-xs bg-base-200 p-3 rounded overflow-x-auto">{JSON.stringify(data.debug, null, 2)}</pre>
    </details>
  {/if}
</section>
