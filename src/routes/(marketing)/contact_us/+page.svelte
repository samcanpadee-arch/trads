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

<div class="bg-slate-950 text-slate-50 min-h-screen">
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-50"
      style="background: radial-gradient(circle at 20% 20%, rgba(251, 191, 36, 0.35), transparent 50%),
        radial-gradient(circle at 80% 0%, rgba(248, 113, 113, 0.35), transparent 55%);"
    ></div>
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
      <p class="text-xs uppercase tracking-[0.3em] text-amber-200">Contact</p>
      <h1 class="text-4xl font-bold">Got a question? Flick us a message.</h1>
      <p class="text-base text-slate-100/80">
        We’re a small team that actually reads this stuff. Tell us what you need and we’ll point you in the right direction, answer queries, share a quick demo, or help you get unstuck.
      </p>
      <p class="text-sm text-slate-400">Prefer email? <a class="link" href="mailto:support@tradieassistant.app">support@tradieassistant.app</a></p>
    </div>
  </section>

  <section class="py-16 bg-slate-900/70">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
      <article class="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur p-8 space-y-6">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-amber-200">How we can help</p>
          <h2 class="text-3xl font-semibold mt-3">Support from real humans</h2>
          <p class="text-sm text-slate-300 mt-3">
            Ask anything about pricing, onboarding, Smart Tools, Smart Assistant, integrations, or how to get the crew set up on site. We usually reply within a business day.
          </p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-black/30 p-5 space-y-3 text-sm text-slate-200">
          <div>
            <p class="font-semibold">Billing & subscriptions</p>
            <p class="text-slate-300">Need to change plans or update payment details? Tap “Manage subscription” in your account or mention it below.</p>
          </div>
          <div class="divider divider-ghost"></div>
          <div>
            <p class="font-semibold">Product or data questions</p>
            <p class="text-slate-300">We can share demos, talk through the Tradie Library, or point you at the right workflow.</p>
          </div>
        </div>
        <p class="text-xs text-slate-400">By submitting, you agree to our Privacy Policy.</p>
      </article>

      <div>
        {#if showSuccess}
          <div class="rounded-[32px] border border-emerald-200/50 bg-emerald-500/10 backdrop-blur p-8 text-center">
            <p class="text-2xl font-semibold text-emerald-100">Thank you!</p>
            <p class="text-sm text-emerald-50 mt-2">We've received your message and will be in touch soon.</p>
            <button class="btn btn-ghost mt-6" onclick={() => (showSuccess = false)}>Send another</button>
          </div>
        {:else}
          <div class="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur p-6">
            <form class="form-widget flex flex-col gap-4" method="POST" action="?/submitContactUs" use:enhance={handleSubmit}>
              {#each formFields as field}
                <label for={field.id} class="text-sm font-semibold text-slate-200">
                  <div class="flex items-center justify-between">
                    <span>{field.label}</span>
                    {#if errors[field.id]}
                      <span class="text-xs text-red-300">{errors[field.id]}</span>
                    {/if}
                  </div>
                  {#if field.inputType === 'textarea'}
                    <textarea
                      id={field.id}
                      name={field.id}
                      autocomplete={field.autocomplete}
                      rows={4}
                      class={`mt-1 w-full rounded-2xl border bg-slate-950/40 p-3 text-base ${errors[field.id] ? 'border-red-400' : 'border-white/10'}`}
                    ></textarea>
                  {:else}
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.inputType}
                      autocomplete={field.autocomplete}
                      class={`mt-1 w-full rounded-2xl border bg-slate-950/40 p-3 text-base ${errors[field.id] ? 'border-red-400' : 'border-white/10'}`}
                    />
                  {/if}
                </label>
              {/each}

              {#if Object.keys(errors).length > 0}
                <p class="text-xs text-red-300">Please resolve the issues above.</p>
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
