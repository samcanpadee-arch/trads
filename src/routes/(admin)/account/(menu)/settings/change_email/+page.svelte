<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import SettingsModule from "../settings_module.svelte"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("settings")

  let { data } = $props()

  let { user } = data
</script>

<svelte:head>
  <title>Change Email</title>
</svelte:head>

<div class="mb-6 flex flex-wrap items-center justify-between gap-3">
  <h1 class="text-2xl font-bold">Settings</h1>
  <a href="/account/settings" class="btn btn-ghost btn-sm text-sm">← Back to Settings</a>
</div>

<SettingsModule
  title="Change Email"
  editable={true}
  successTitle="Email change initiated"
  successBody="You should receive emails at both the old and new address to confirm the change. Please click the link in both emails to finalized the change. Until finalized, you must sign in with your current email."
  formTarget="/account/api?/updateEmail"
  fields={[
    {
      id: "email",
      label: "Email",
      initialValue: user?.email ?? "",
      placeholder: "Email address",
    },
  ]}
/>
