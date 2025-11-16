<script lang="ts">
  import SettingsModule from "../settings_module.svelte"
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("settings")

  let { data } = $props()

  let { profile } = data
</script>

<svelte:head>
  <title>Edit Profile</title>
</svelte:head>

<div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
  <h1 class="text-2xl font-bold">Edit Profile</h1>
  <a class="btn btn-ghost self-start text-sm sm:self-auto" href="/account/settings">← Back to Settings</a>
</div>

<SettingsModule
  editable={true}
  title="Edit Profile"
  successTitle="Saved Profile"
  formTarget="/account/api?/updateProfile"
  fields={[
    {
      id: "fullName",
      label: "Name",
      initialValue: profile?.full_name ?? "",
      placeholder: "Your full name",
      maxlength: 50,
    },
    {
      id: "companyName",
      label: "Company Name",
      initialValue: profile?.company_name ?? "",
      maxlength: 50,
    },
    {
      id: "website",
      label: "Company Website",
      initialValue: profile?.website ?? "",
      maxlength: 50,
    },
  ]}
/>
