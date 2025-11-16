<script lang="ts">
  import { enhance, applyAction } from "$app/forms"
  import { page } from "$app/stores"
  import type { SubmitFunction } from "@sveltejs/kit"

  const fieldError = (liveForm: FormAccountUpdateResult, name: string) => {
    let errors = liveForm?.errorFields ?? []
    return errors.includes(name)
  }

  // Page state
  let loading = $state(false)
  let showSuccess = $state(false)

  type Field = {
    inputType?: string // default is "text"
    id: string
    label?: string
    initialValue: string | boolean
    placeholder?: string
    maxlength?: number
  }

  type ConfirmMessage = string | null | ((data: FormData) => string | null)

  interface Props {
    // Module context
    editable?: boolean
    dangerous?: boolean
    title?: string
    message?: string
    fields: Field[]
    formTarget?: string
    successTitle?: string
    successBody?: string
    editButtonTitle?: string | null
    editLink?: string | null
    saveButtonTitle?: string
    className?: string
    confirmMessage?: ConfirmMessage
  }

  let {
    editable = false,
    dangerous = false,
    title = "",
    message = "",
    fields,
    formTarget = "",
    successTitle = "Success",
    successBody = "",
    editButtonTitle = null,
    editLink = null,
    saveButtonTitle = "Save",
    className = "mt-8",
    confirmMessage = null,
  }: Props = $props()

  const maybeConfirm = (event: SubmitEvent) => {
    if (!confirmMessage) {
      return
    }

    const form = event.currentTarget as HTMLFormElement | null
    if (!form) {
      return
    }

    const data = new FormData(form)
    const message =
      typeof confirmMessage === "function" ? confirmMessage(data) : confirmMessage

    if (message && !confirm(message)) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ update, result }) => {
      await update({ reset: false })
      await applyAction(result)
      loading = false
      if (result.type === "success") {
        showSuccess = true
      }
    }
  }
</script>

<div
  class={
    `${className} rounded-2xl border shadow-sm w-full flex flex-col md:flex-row gap-5 p-6 ${dangerous
      ? 'border-rose-200 bg-rose-50/80'
      : 'border-gray-200 bg-white/80'}`
  }
>
  {#if title}
    <div class="flex-none md:w-52 space-y-1">
      <p
        class={
          `text-xs font-semibold uppercase tracking-widest ${dangerous
            ? 'text-rose-500'
            : 'text-amber-700'}`
        }
      >
        {dangerous ? "Caution" : "Details"}
      </p>
      <div class="text-xl font-semibold text-gray-900">{title}</div>
    </div>
  {/if}

  <div class="w-full min-w-48">
    {#if !showSuccess}
      {#if message}
        <div
          class={
            `mb-5 rounded-2xl border px-4 py-3 text-sm ${dangerous
              ? 'border-rose-200 bg-white/60 text-rose-900'
              : 'border-amber-100 bg-amber-50 text-amber-900'}`
          }
        >
          {message}
        </div>
      {/if}
      <form
        class="form-widget flex flex-col"
        method="POST"
        action={formTarget}
        on:submit={maybeConfirm}
        use:enhance={handleSubmit}
      >
        {#each fields as field}
          {#if field.label}
            <label for={field.id}>
              <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">{field.label}</span>
            </label>
          {/if}
          {#if editable}
            <input
              id={field.id}
              name={field.id}
              type={field.inputType ?? "text"}
              disabled={!editable}
              placeholder={field.placeholder ?? field.label ?? ""}
              class="{fieldError($page?.form, field.id)
                ? 'input-error'
                : ''} input-sm mt-1 input input-bordered w-full max-w-xs mb-3 text-base py-4"
              value={$page.form ? $page.form[field.id] : field.initialValue}
              maxlength={field.maxlength ? field.maxlength : null}
            />
          {:else}
            <div class="text-base font-medium text-gray-900 mb-3">
              {field.initialValue}
            </div>
          {/if}
        {/each}

        {#if $page?.form?.errorMessage}
          <p class="text-red-700 text-sm font-bold mt-1">
            {$page?.form?.errorMessage}
          </p>
        {/if}

        {#if editable}
          <div>
            <button
              type="submit"
              class="ml-auto btn btn-sm mt-3 min-w-[145px] {dangerous
                ? 'btn-error btn-outline'
                : 'btn-primary btn-outline'}"
              disabled={loading}
            >
              {#if loading}
                <span
                  class="loading loading-spinner loading-md align-middle mx-3"
                ></span>
              {:else}
                {saveButtonTitle}
              {/if}
            </button>
          </div>
        {:else if editButtonTitle && editLink}
          <!-- !editable -->
          <a href={editLink} class="mt-1">
            <button
              class="btn btn-outline btn-sm {dangerous
                ? 'btn-error'
                : ''} min-w-[145px]"
            >
              {editButtonTitle}
            </button>
          </a>
        {/if}
      </form>
    {:else}
      <!-- showSuccess -->
      <div>
        <div class="text-l font-bold">{successTitle}</div>
        <div class="text-base">{successBody}</div>
      </div>
      <a href="/account/settings">
        <button class="btn btn-outline btn-sm mt-3 min-w-[145px]">
          Return to Settings
        </button>
      </a>
    {/if}
  </div>
</div>
