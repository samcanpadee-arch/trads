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

<div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
  <h1 class="text-2xl font-bold">Change Email</h1>
  <a class="btn btn-ghost self-start text-sm sm:self-auto" href="/account/settings">← Back to Settings</a>
</div>

<SettingsModule
  title="Change Email"
  editable={true}
  successTitle="Email change initiated"
  successBody="You'll get emails at both inboxes. Click each link to finalise the change, and keep signing in with your current email until it's confirmed."
  formTarget="/account/api?/updateEmail"
  confirmMessage={(data) => {
    const entry = data.get("email")
    const nextEmail = typeof entry === "string" ? entry.trim() : ""
    return nextEmail
      ? `Change your login email to ${nextEmail}? We'll send confirmation links to both addresses.`
      : "Change your login email?"
  }}
  fields={[
    {
      id: "email",
      label: "Email",
      initialValue: user?.email ?? "",
      placeholder: "Email address",
    },
  ]}
/>
