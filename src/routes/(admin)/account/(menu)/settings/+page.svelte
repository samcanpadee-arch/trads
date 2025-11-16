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
    <p class="text-sm font-semibold uppercase tracking-widest text-amber-700">Account</p>
    <h1 class="mt-3 text-3xl font-bold text-gray-900">Settings</h1>
    <p class="mt-2 text-gray-700 max-w-3xl">
      Give your Tradie Assistant profile a once-over: refresh your details, swap the login email, set a new password, or
      delete the account when the job&rsquo;s done. Quick tune-up, then back on the tools.
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
          title="Change Email"
          editable={false}
          fields={[{ id: "email", label: "Login email", initialValue: user?.email || "" }]}
          editButtonTitle="Change Email"
          editLink="/account/settings/change_email"
          className="mt-0"
        />

        <SettingsModule
          title="Change Password"
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
              Removing your account cuts off access to billing and clears your saved company details. Only continue when you’ve wrapped up billing jobs.
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
            <span>Once it’s gone you can’t log back in, so double-check any open jobs or team invites.</span>
          </li>
        </ul>
      </div>
    </div>

    <aside class="space-y-6">
      <div class="rounded-3xl border border-white/60 bg-white/80 px-6 py-6 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-widest text-amber-600">Why it matters</p>
        <h3 class="mt-2 text-xl font-semibold text-gray-900">Keep Smart Tools in the loop</h3>
        <p class="mt-2 text-sm text-gray-700">
          Smart Chat, Smart Assistant, and every Smart Tool pull your name, business name, and business website straight from these settings so replies land with the right context.
        </p>
        <ul class="mt-4 space-y-2 text-sm text-gray-800">
          <li class="flex gap-2">
            <span class="text-amber-500">•</span>
            <span>Your name keeps greetings and sign-offs sounding like you, not a robot.</span>
          </li>
          <li class="flex gap-2">
            <span class="text-amber-500">•</span>
            <span>Your business name lets proposals and estimates stay on-brand.</span>
          </li>
          <li class="flex gap-2">
            <span class="text-amber-500">•</span>
            <span>Your business website gives Smart Tools the context they need to back up the chat.</span>
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
