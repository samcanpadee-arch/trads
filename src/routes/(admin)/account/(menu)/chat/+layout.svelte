<script lang="ts">
  import { page } from '$app/stores';
</script>

{#if !$page.data?.allowed}
  <section class="max-w-3xl mx-auto px-4 py-10">
    <div class="alert alert-info">
      <span class="space-y-1">
        <strong>Smart Chat is included with Standard and Pro.</strong>
        <span>
          Upgrade to unlock AI-written quotes, SMS replies, and site-ready updates that stay in your Tradie Assistant
          history alongside files and prompts.
        </span>
      </span>
    </div>
    <div class="mt-4 flex flex-wrap gap-3">
      <a class="btn btn-primary" href="/pricing?upgrade=chat">Upgrade for Smart Chat</a>
      <a class="btn btn-ghost" href="/account">Back to account</a>
    </div>
  </section>
{:else}
  <slot />
{/if}
