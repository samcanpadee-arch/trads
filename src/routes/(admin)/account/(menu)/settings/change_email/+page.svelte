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

<h1 class="text-2xl font-bold mb-6">Settings</h1>

<SettingsModule
  title="Change Email"
  editable={true}
  successTitle="Email change initiated"
  successBody="We've emailed both inboxes. Click each link to finalise the change, then keep signing in with your current email until it's confirmed."
  formTarget="/account/api?/updateEmail"
  confirmMessage={(data) => {
    const nextEmail = (data.get("email") as string)?.trim()
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
