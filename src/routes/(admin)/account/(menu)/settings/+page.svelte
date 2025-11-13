<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import SettingsModule from "./settings_module.svelte"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("settings")

  let { data } = $props()
  let { profile, user } = data
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<section class="max-w-5xl mx-auto px-4 py-10 space-y-8">
  <header class="rounded-3xl bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 border border-amber-200/70 px-6 py-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-widest text-amber-700">Account settings</p>
    <h1 class="mt-3 text-3xl font-bold text-gray-900">Polish every detail before clients see it</h1>
    <p class="mt-2 text-gray-700 max-w-3xl">
      Keep your company profile, logins, and email preferences in sync so every quote, SMS, and Tradie Library reply
      lands with the right branding. Updates here flow straight through the app, across devices.
    </p>
  </header>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
    <div class="space-y-6">
      <div class="space-y-4">
        <SettingsModule
          title="Profile"
          editable={false}
          fields={[
            { id: "fullName", label: "Name", initialValue: profile?.full_name ?? "" },
            {
              id: "companyName",
              label: "Company Name",
              initialValue: profile?.company_name ?? "",
            },
            {
              id: "website",
              label: "Company Website",
              initialValue: profile?.website ?? "",
            },
          ]}
          editButtonTitle="Edit Profile"
          editLink="/account/settings/edit_profile"
          className="mt-0"
        />

        <SettingsModule
          title="Email"
          editable={false}
          fields={[{ id: "email", label: "Login email", initialValue: user?.email || "" }]}
          editButtonTitle="Change Email"
          editLink="/account/settings/change_email"
          className="mt-0"
        />

        <SettingsModule
          title="Password"
          editable={false}
          fields={[{ id: "password", label: "Password", initialValue: "••••••••••••••••" }]}
          editButtonTitle="Change Password"
          editLink="/account/settings/change_password"
          className="mt-0"
        />

        <SettingsModule
          title="Email subscription"
          editable={false}
          fields={[
            {
              id: "subscriptionStatus",
              label: "Status",
              initialValue: profile?.unsubscribed ? "Unsubscribed" : "Subscribed",
            },
          ]}
          editButtonTitle="Manage updates"
          editLink="/account/settings/change_email_subscription"
          className="mt-0"
        />
      </div>

      <div class="rounded-3xl border border-rose-200 bg-rose-50/70 px-6 py-6 shadow-inner space-y-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-rose-500">Danger zone</p>
            <h3 class="text-xl font-semibold text-gray-900">Close & delete your account</h3>
            <p class="text-sm text-rose-900/80">
              Removing your account wipes chat history, docs, and access to billing. Only continue when you’ve wrapped up billing tasks.
            </p>
          </div>
          <a
            class="btn btn-outline btn-sm border-rose-300 text-rose-700 hover:bg-rose-600 hover:text-white"
            href="/account/settings/delete_account"
          >Delete account</a>
        </div>
        <ul class="text-sm text-rose-900/80 space-y-2">
          <li class="flex gap-2">
            <span class="text-rose-500">•</span>
            <span>Download invoices and receipts from Stripe first.</span>
          </li>
          <li class="flex gap-2">
            <span class="text-rose-500">•</span>
            <span>Cancel paid subscriptions so future charges stop.</span>
          </li>
          <li class="flex gap-2">
            <span class="text-rose-500">•</span>
            <span>Save any manuals, quotes, or chats you’ll need later.</span>
          </li>
        </ul>
      </div>
    </div>

    <aside class="space-y-6">
      <div class="rounded-3xl border border-white/60 bg-white/80 px-6 py-6 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-widest text-amber-600">Consistency matters</p>
        <h3 class="mt-2 text-xl font-semibold text-gray-900">Look pro across every workflow</h3>
        <p class="mt-2 text-sm text-gray-700">
          Smart Chat replies, Tradie Library answers, quotes, and SMS templates all pull from these settings. Keep names, numbers,
          and websites up to date so clients always see the right details.
        </p>
        <ul class="mt-4 space-y-2 text-sm text-gray-800">
          <li class="flex gap-2">
            <span class="text-amber-500">•</span>
            <span>Share one profile across mobile and desktop.</span>
          </li>
          <li class="flex gap-2">
            <span class="text-amber-500">•</span>
            <span>Company info appears on quotes & paperwork workflows.</span>
          </li>
          <li class="flex gap-2">
            <span class="text-amber-500">•</span>
            <span>Ensure the Tradie Assistant greets clients with the right brand.</span>
          </li>
        </ul>
      </div>

      <div class="rounded-3xl border border-gray-200/80 bg-white/70 px-6 py-6 shadow-sm space-y-3">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-500">Need help?</p>
        <h3 class="text-xl font-semibold text-gray-900">Talk with support</h3>
        <p class="text-sm text-gray-700">
          Questions about email changes, lost access, or moving teams? Send the crew a note and we’ll guide you through it.
        </p>
        <a class="btn btn-ghost btn-sm w-full" href="mailto:help@tradieassistant.com">Email help@tradieassistant.com</a>
      </div>
    </aside>
  </div>
</section>
