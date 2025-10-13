<script lang="ts">
  import { applyAction, enhance } from "$app/forms"
  import type { SubmitFunction } from "@sveltejs/kit"
  import "../../../../app.css"

  interface User {
    email: string
  }

  interface Profile {
    full_name?: string
  }

  interface Props {
    data: { user: User; profile: Profile }
    form: FormAccountUpdateResult
  }

  let { data, form }: Props = $props()

  let { user, profile } = data

  let loading = $state(false)
  let fullName: string = profile?.full_name ?? ""
  const REQUIRED_NAME_HELP_TEXT = "Name is required"

  const fieldError = (liveForm: FormAccountUpdateResult, name: string) => {
    let errors = liveForm?.errorFields ?? []
    return errors.includes(name)
  }

  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ update, result }) => {
      await update({ reset: false })
      await applyAction(result)
      loading = false
    }
  }
</script>

<svelte:head>
  <title>Create Profile</title>
</svelte:head>

<div
  class="text-center content-center max-w-lg mx-auto min-h-[100vh] pb-12 flex items-center place-content-center"
>
  <div class="flex flex-col w-64 lg:w-80">
    <div>
      <h1 class="text-2xl font-bold mb-2">Create Profile</h1>
      <p class="text-base-content/80 mb-6">
        You&apos;re almost there—add your name so we can personalise your workspace.
      </p>
      <form
        class="form-widget"
        method="POST"
        action="/account/api?/updateProfile"
        use:enhance={handleSubmit}
      >
        <div class="mt-4">
          <label for="fullName" class="flex items-center gap-1 justify-between">
            <span class="text-l text-left">Your Name</span>
            <span class="text-xs font-semibold uppercase text-error">Required</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your full name"
            class="{fieldError(form, 'fullName')
              ? 'input-error'
              : ''} mt-1 input input-bordered w-full max-w-xs"
            value={form?.fullName ?? fullName}
            maxlength="50"
            required
            aria-describedby="fullName-help"
          />
          <p
            id="fullName-help"
            class="mt-2 text-sm {fieldError(form, 'fullName') ? 'text-error' : 'text-base-content/70'}"
          >
            {fieldError(form, "fullName") ? REQUIRED_NAME_HELP_TEXT : "We use this to personalise your experience."}
          </p>
        </div>

        {#if form?.errorMessage}
          <p class="text-red-700 text-sm font-bold text-center mt-3">
            {form?.errorMessage}
          </p>
        {/if}
        <div class="mt-4">
          <input
            type="submit"
            class="btn btn-primary mt-3 btn-wide"
            value={loading ? "..." : "Create Profile"}
            disabled={loading}
          />
        </div>
      </form>

      <div class="text-sm text-slate-800 mt-14">
        You are logged in as {user?.email}.
        <br />
        <a class="underline" href="/account/sign_out"> Sign out </a>
      </div>
    </div>
  </div>
</div>
