<script lang="ts">
  import { page } from "$app/stores"
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import SettingsModule from "../settings_module.svelte"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("settings")

  let { data } = $props()
  let { user, supabase } = data

  // True if definitely has a password, but can be false if they
  // logged in with oAuth or email link

  // @ts-expect-error: we ignore because Supabase does not maintain an AMR typedef
  let hasPassword = user?.amr?.find((x) => x.method === "password")
    ? true
    : false

  // @ts-expect-error: we ignore because Supabase does not maintain an AMR typedef
  let usingOAuth = user?.amr?.find((x) => x.method === "oauth") ? true : false

  let sendBtnDisabled = $state(false)
  let sendBtnText = $state("Send Set Password Email")
  let sentEmail = $state(false)
  let sendForgotPassword = () => {
    sendBtnDisabled = true
    sendBtnText = "Sending..."

    let email = user?.email
    if (email) {
      supabase.auth
        .resetPasswordForEmail(email, {
          redirectTo: `${$page.url.origin}/auth/callback?next=%2Faccount%2Fsettings%2Freset_password`,
        })
        .then((d) => {
          sentEmail = d.error ? false : true
          sendBtnDisabled = false
          sendBtnText = "Send Forgot Password Email"
        })
    }
  }
</script>

<svelte:head>
  <title>Change Password</title>
</svelte:head>

<div class="mb-6 flex flex-wrap items-center justify-between gap-3">
  <h1 class="text-2xl font-bold">Settings</h1>
  <a href="/account/settings" class="btn btn-ghost btn-sm text-sm">← Back to Settings</a>
</div>

{#if hasPassword}
  <SettingsModule
    title="Change Password"
    editable={true}
    saveButtonTitle="Change Password"
    successTitle="Password Changed"
    successBody="On next sign in, use your new password."
    formTarget="/account/api?/updatePassword"
    fields={[
      {
        id: "newPassword1",
        label: "New Password",
        initialValue: "",
        inputType: "password",
      },
      {
        id: "newPassword2",
        label: "Confirm New Password",
        initialValue: "",
        inputType: "password",
      },
      {
        id: "currentPassword",
        label: "Current Password",
        initialValue: "",
        inputType: "password",
      },
    ]}
  />
{:else}
  <div
    class="mt-8 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm w-full flex flex-col gap-5 md:flex-row"
  >
    <div class="flex-none md:w-52 space-y-1">
      <p class="text-xs font-semibold uppercase tracking-widest text-amber-700">Details</p>
      <div class="text-xl font-semibold text-gray-900">
        {usingOAuth ? "Set Password by Email" : "Change Password by Email"}
      </div>
    </div>

    <div class="w-full min-w-48 space-y-4">
      {#if usingOAuth}
        <p class="text-sm text-gray-700">
          You currently sign in with an OAuth provider such as GitHub or Google. You can keep using that method, but if you
          would like a password on file we can send you a quick link.
        </p>
      {:else}
        <p class="text-sm text-gray-700">
          Your account does not have a password yet. Use the button below to receive a secure link where you can create one.
        </p>
      {/if}

      <p class="text-sm text-gray-700">
        We will email {user?.email ?? "your account email"}. Follow the link inside to set your password.
      </p>

      <button
        type="button"
        class="btn btn-outline btn-sm min-w-[165px] {sentEmail ? 'hidden' : ''}"
        disabled={sendBtnDisabled}
        onclick={sendForgotPassword}
      >
        {sendBtnText}
      </button>

      {#if sentEmail}
        <div class="alert alert-success text-sm">
          Sent! Please check your inbox and use the link to set your password.
        </div>
      {/if}
    </div>
  </div>
{/if}
