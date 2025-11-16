<script lang="ts">
  import SettingsModule from "../settings_module.svelte"
  let { data } = $props()
  let { profile } = data
  let unsubscribed = profile?.unsubscribed
</script>

<svelte:head>
  <title>Change Email Subscription</title>
</svelte:head>

<div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
  <h1 class="text-2xl font-bold">Email Subscription</h1>
  <a class="btn btn-ghost self-start text-sm sm:self-auto" href="/account/settings">← Back to Settings</a>
</div>

<SettingsModule
  editable={true}
  title="Subscription"
  message={unsubscribed
    ? "You are currently unsubscribed from emails"
    : "You are currently subscribed to emails"}
  saveButtonTitle={unsubscribed ? "Re-subscribe" : "Unsubscribe"}
  successBody={unsubscribed
    ? "You have been re-subscribed to emails"
    : "You have been unsubscribed from emails"}
  formTarget="/account/api?/toggleEmailSubscription"
  fields={[]}
/>
