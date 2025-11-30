<script lang="ts">
  import { page } from '$app/stores';
</script>

{#if !$page.data?.allowed}
  <section class="max-w-3xl mx-auto px-4 py-10">
    <div class="alert alert-info">
      <span class="space-y-1">
        <strong>Smart Vision is included with Standard and Pro.</strong>
        <span>
          Upgrade to unlock photo-based diagnostics with trade-grade, vision-powered answers alongside Smart Chat and Assistant.
        </span>
      </span>
    </div>
    <div class="mt-4 flex flex-wrap gap-3">
      <a class="btn btn-primary" href="/pricing?upgrade=vision">Upgrade for Smart Vision</a>
      <a class="btn btn-ghost" href="/account">Back to account</a>
    </div>
  </section>
{:else}
  <slot />
{/if}
