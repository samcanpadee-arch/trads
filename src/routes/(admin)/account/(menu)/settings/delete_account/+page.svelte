<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import SettingsModule from "../settings_module.svelte"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("settings")

  let { data } = $props()
  let { session } = data
</script>

<svelte:head>
  <title>Delete Account</title>
</svelte:head>

<section class="max-w-3xl mx-auto px-4 py-10 space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
    <a href="/account/settings" class="btn btn-ghost btn-sm text-sm">← Back to Settings</a>
  </div>

  <header class="rounded-3xl bg-gradient-to-r from-rose-100 via-amber-100 to-white border border-rose-200/70 px-6 py-8 shadow-sm">
    <p class="text-xs font-semibold uppercase tracking-widest text-rose-600">Danger zone</p>
    <h1 class="mt-2 text-3xl font-bold text-gray-900">Delete your Tradie Assistant account</h1>
    <p class="mt-3 text-sm text-gray-700">
      This permanently removes your login, chat history, documents, and access to the Stripe billing portal. Once deleted, you can’t
      download invoices, update payment methods, or restart your subscription without creating a fresh account.
    </p>
  </header>

  <div class="rounded-2xl border border-rose-200 bg-white/80 px-6 py-5 shadow-sm">
    <p class="text-sm font-semibold text-gray-900">Before you delete:</p>
    <ul class="mt-3 space-y-2 text-sm text-gray-700">
      <li class="flex gap-2">
        <span class="text-rose-500">•</span>
        <span>Cancel any paid plan in Stripe so future invoices stop.</span>
      </li>
      <li class="flex gap-2">
        <span class="text-rose-500">•</span>
        <span>Download all invoices, receipts, and tax records for your files.</span>
      </li>
      <li class="flex gap-2">
        <span class="text-rose-500">•</span>
        <span>Export any quotes, manuals, or notes that you still need.</span>
      </li>
    </ul>
    <p class="mt-3 text-xs text-rose-700">
      Once the account is removed you will not be able to reopen the Stripe portal or recover saved content.
    </p>
  </div>

  <SettingsModule
    title="Confirm deletion"
    editable={true}
    dangerous={true}
    message={`You are logged in as ${session?.user?.email ?? 'your account'}. Enter your password to confirm you want to permanently delete your account and lose billing access.`}
    saveButtonTitle="Delete account"
    successTitle="Account queued for deletion"
    successBody="Your account will be deleted shortly."
    formTarget="/account/api?/deleteAccount"
    fields={[
      {
        id: "currentPassword",
        label: "Current password",
        initialValue: "",
        inputType: "password",
      },
    ]}
  />
</section>
