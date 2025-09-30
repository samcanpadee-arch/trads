<script lang="ts">
  export let data: { portalUrl: string | null };
</script>

<section class="max-w-3xl mx-auto px-4 py-10">
  <h1 class="text-2xl font-bold">Billing</h1>
  <p class="mt-2 text-gray-600">Manage your subscription, payment method and invoices in Stripe.</p>

  <div class="mt-6">
    {#if data.portalUrl}
      <a class="btn btn-primary" href={data.portalUrl}>Manage Billing</a>
    {:else}
      <button class="btn" disabled>Manage Billing (unavailable)</button>
      <p class="mt-2 text-sm text-error">
        Portal link unavailable. Try again after signing in — or contact support.
      </p>
    {/if}
  </div>

  <div class="mt-10">
    <a class="link" href="/pricing">Change plan</a>
  </div>
</section>
