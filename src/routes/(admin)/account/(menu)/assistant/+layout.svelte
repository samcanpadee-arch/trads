<script lang="ts">
  import { page } from '$app/stores';
</script>

{#if !$page.data?.allowed}
  <section class="max-w-3xl mx-auto px-4 pt-6">
    <div class="alert alert-info">
      <span>
        <strong>Smart Assistant is a Pro-plan feature.</strong>
        Upgrade to unlock the Smart Assistant to get specific and technical help with manuals, guides, standards, and more. 
      </span>
    </div>
    <div class="mt-4 flex gap-3">
      <a class="btn btn-primary" href="/pricing?upgrade=assistant">See plans</a>
      <a class="btn btn-ghost" href="/account">Back to account</a>
    </div>
  </section>
{:else}
  <slot />
{/if}
