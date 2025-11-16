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
  const sendBtnDefaultText = "Send password reset email"
  let sendBtnText = $state(sendBtnDefaultText)
  let sentEmail = $state(false)
  let sendForgotPassword = () => {
    const email = user?.email
    if (!email) {
      return
    }

    const confirmed = confirm(
      `Send a password reset link to ${email}? You'll be able to pick a new password from that email.`,
    )
    if (!confirmed) {
      return
    }

    sendBtnDisabled = true
    sendBtnText = "Sending..."

    supabase.auth
      .resetPasswordForEmail(email, {
        redirectTo: `${$page.url.origin}/auth/callback?next=%2Faccount%2Fsettings%2Freset_password`,
      })
      .then((d) => {
        sentEmail = d.error ? false : true
        sendBtnDisabled = false
        sendBtnText = sendBtnDefaultText
      })
  }
</script>

<svelte:head>
  <title>Change Password</title>
</svelte:head>

<div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
  <h1 class="text-2xl font-bold">Change Password</h1>
  <a class="btn btn-ghost self-start text-sm sm:self-auto" href="/account/settings">← Back to Settings</a>
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
  <div class="card p-6 pb-7 mt-8 max-w-xl flex flex-col md:flex-row shadow-sm max-w-md">
    <div class="flex flex-col gap-y-4">
      {#if usingOAuth}
        <div class="font-bold">Set a password from your inbox</div>
        <div>
          You usually sign in with oAuth ("Sign in with GitHub" or similar),
          but you can add a Tradie password too. We'll send the same reset link
          below so you can pick one.
        </div>
      {:else}
        <div class="font-bold">Reset your password via email</div>
      {/if}
      <div>
        The button below emails {user?.email} a secure reset link so you can set
        a fresh password. We'll double-check you're sure before we send it.
      </div>
      <button
        class="btn btn-outline btn-wide {sentEmail ? 'hidden' : ''}"
        disabled={sendBtnDisabled}
        onclick={sendForgotPassword}
      >
        {sendBtnText}
      </button>
      <div class="success alert alert-success {sentEmail ? '' : 'hidden'}">
        Reset email sent! Check your inbox and follow the link to choose your
        new password.
      </div>
    </div>
  </div>
{/if}
