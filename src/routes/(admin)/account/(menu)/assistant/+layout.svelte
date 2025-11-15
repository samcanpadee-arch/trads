<script lang="ts">
  import { page } from '$app/stores';
</script>

{#if !$page.data?.allowed}
  <section class="max-w-3xl mx-auto px-4 pt-6">
    <div class="alert alert-info">
      <span class="space-y-1">
        <strong>Smart Assistant lives on the Pro plan.</strong>
        <span>
          Upgrade to unlock the Tradie Library so every answer cites manuals, guides, compliance standards, and job-ready
          worksheets tailored to your trade.
        </span>
      </span>
    </div>
    <div class="mt-4 flex flex-wrap gap-3">
      <a class="btn btn-primary" href="/pricing?upgrade=assistant">Upgrade to Pro</a>
      <a class="btn btn-ghost" href="/account">Back to account</a>
    </div>
  </section>
{:else}
  <slot />
{/if}
