<script lang="ts">
  export let data: {
    checkoutSuccess: { interval: string | null; nextBill: string | null; trialEnds: string | null } | null
  };

  function fmt(iso: string | null) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
</script>

<section class="max-w-3xl mx-auto px-4 py-10 space-y-6">
  {#if data.checkoutSuccess}
    <div class="alert alert-success">
      <span>
        🎉 You’re all set!
        {#if data.checkoutSuccess.trialEnds}
          Trial ends on <b>{fmt(data.checkoutSuccess.trialEnds)}</b>.
        {:else if data.checkoutSuccess.nextBill}
          Next bill on <b>{fmt(data.checkoutSuccess.nextBill)}</b>.
        {/if}
        {#if data.checkoutSuccess.interval}
          Billing interval: <b>{data.checkoutSuccess.interval}</b>.
        {/if}
      </span>
    </div>
  {/if}

  <h1 class="text-2xl font-bold">Account</h1>
  <p class="text-gray-600">Welcome back.</p>

  <div class="mt-6">
    <a class="btn" href="/account/billing">Go to Billing</a>
  </div>
</section>
