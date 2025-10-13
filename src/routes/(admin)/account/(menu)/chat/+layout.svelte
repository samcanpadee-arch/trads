<script lang="ts">
  import { page } from '$app/stores';
</script>

{#if !$page.data?.allowed}
  <section class="max-w-3xl mx-auto px-4 py-10">
    <div class="alert alert-info">
      <span>
        <strong>Smart Chat is a Standard-plan feature.</strong>
        Upgrade to unlock Smart Chat (included in Standard and Pro subscriptions).
      </span>
    </div>
    <div class="mt-4 flex gap-3">
      <a class="btn btn-primary" href="/pricing?upgrade=chat">See plans</a>
      <a class="btn btn-ghost" href="/account">Back to account</a>
    </div>
  </section>
{:else}
  <slot />
{/if}
