<script lang="ts">
  import { enhance, applyAction } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { FullAutoFill } from 'svelte/elements';

  let errors: { [fieldName: string]: string } = $state({});
  let loading = $state(false);
  let showSuccess = $state(false);

  interface FormField {
    id: string;
    label: string;
    inputType: string;
    autocomplete: FullAutoFill;
  }

  const formFields: FormField[] = [
    { id: 'first_name', label: 'First name *', inputType: 'text', autocomplete: 'given-name' },
    { id: 'last_name', label: 'Last name *', inputType: 'text', autocomplete: 'family-name' },
    { id: 'email', label: 'Email *', inputType: 'email', autocomplete: 'email' },
    { id: 'phone', label: 'Phone number', inputType: 'tel', autocomplete: 'tel' },
    { id: 'message', label: 'Message', inputType: 'textarea', autocomplete: 'off' }
  ];

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    errors = {};
    return async ({ update, result }) => {
      await update({ reset: false });
      await applyAction(result);
      loading = false;
      if (result.type === 'success') {
        showSuccess = true;
      } else if (result.type === 'failure') {
        errors = result.data?.errors ?? {};
      } else if (result.type === 'error') {
        errors = { _: 'An error occurred. Please check inputs and try again.' };
      }
    };
  };
</script>

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 text-slate-900 min-h-screen">
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-50"
      style="background: radial-gradient(circle at 20% 20%, rgba(251, 191, 36, 0.35), transparent 50%),
        radial-gradient(circle at 80% 0%, rgba(248, 187, 208, 0.35), transparent 55%);"
    ></div>
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
      <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Contact</p>
      <h1 class="text-4xl font-bold text-slate-900">Got a question? Flick us a message.</h1>
      <p class="text-base text-slate-700">
        We’re a small team that actually reads this stuff. Tell us what you need and we’ll point you in the right direction, answer queries, share a quick demo, or help you get unstuck.
      </p>
      <p class="text-sm text-slate-500">Prefer email? <a class="link" href="mailto:support@tradieassistant.app">support@tradieassistant.app</a></p>
      <div class="rounded-[28px] border border-dashed border-amber-200 bg-white/80 max-w-2xl mx-auto p-5 text-sm font-medium text-amber-500">
        Contact hero image placeholder — drop support photo or illustration here
      </div>
    </div>
  </section>

  <section class="py-16 bg-white/70">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
      <article class="rounded-[32px] border border-slate-200 bg-white/90 p-8 space-y-6 shadow-sm">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-amber-600">How we can help</p>
          <h2 class="text-3xl font-semibold mt-3 text-slate-900">Support from real humans</h2>
          <p class="text-sm text-slate-600 mt-3">
            Ask anything about pricing, onboarding, Smart Tools, Smart Assistant, integrations, or how to get the crew set up on site. We usually reply within a business day.
          </p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white/80 p-5 space-y-3 text-sm text-slate-700">
          <div>
            <p class="font-semibold text-slate-900">Billing & subscriptions</p>
            <p class="text-slate-600">Need to change plans or update payment details? Tap “Manage subscription” in your account or mention it below.</p>
          </div>
          <div class="divider"></div>
          <div>
            <p class="font-semibold text-slate-900">Product or data questions</p>
            <p class="text-slate-600">We can share demos, talk through the Tradie Library, or point you at the right workflow.</p>
          </div>
        </div>
        <p class="text-xs text-slate-500">By submitting, you agree to our Privacy Policy.</p>
      </article>

      <div>
        {#if showSuccess}
          <div class="rounded-[32px] border border-emerald-200/60 bg-emerald-50 p-8 text-center">
            <p class="text-2xl font-semibold text-emerald-900">Thank you!</p>
            <p class="text-sm text-emerald-700 mt-2">We've received your message and will be in touch soon.</p>
            <button class="btn btn-outline border-emerald-300 text-emerald-900 mt-6" onclick={() => (showSuccess = false)}>
              Send another
            </button>
          </div>
        {:else}
          <div class="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm">
            <form class="form-widget flex flex-col gap-4" method="POST" action="?/submitContactUs" use:enhance={handleSubmit}>
              {#each formFields as field}
                <label for={field.id} class="text-sm font-semibold text-slate-800">
                  <div class="flex items-center justify-between">
                    <span>{field.label}</span>
                    {#if errors[field.id]}
                      <span class="text-xs text-red-500">{errors[field.id]}</span>
                    {/if}
                  </div>
                  {#if field.inputType === 'textarea'}
                    <textarea
                      id={field.id}
                      name={field.id}
                      autocomplete={field.autocomplete}
                      rows={4}
                      class={`mt-1 w-full rounded-2xl border bg-white/60 p-3 text-base text-slate-900 ${errors[field.id] ? 'border-red-400' : 'border-slate-200'}`}
                    ></textarea>
                  {:else}
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.inputType}
                      autocomplete={field.autocomplete}
                      class={`mt-1 w-full rounded-2xl border bg-white/60 p-3 text-base text-slate-900 ${errors[field.id] ? 'border-red-400' : 'border-slate-200'}`}
                    />
                  {/if}
                </label>
              {/each}

              {#if Object.keys(errors).length > 0}
                <p class="text-xs text-red-500">Please resolve the issues above.</p>
              {/if}

              <button class={`btn btn-primary ${loading ? 'btn-disabled loading' : ''}`}>
                {loading ? 'Submitting' : 'Submit'}
              </button>
            </form>
          </div>
        {/if}
      </div>
    </div>
  </section>
</div>
