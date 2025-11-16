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
  dangerous={true}
  message="Enter the new address twice so we know you're sure about the change."
  successTitle="Email change underway"
  successBody="We've emailed both inboxes. Click the links to finalise the switch, then keep signing in with your current email until it's confirmed."
  formTarget="/account/api?/updateEmail"
  fields={[
    {
      id: "email",
      label: "New email",
      initialValue: "",
      placeholder: "new@email.com",
    },
    {
      id: "confirmEmail",
      label: "Confirm new email",
      initialValue: "",
      placeholder: "Type it again to confirm",
    },
  ]}
/>
