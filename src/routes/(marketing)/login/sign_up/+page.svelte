<script lang="ts">
  type PasswordRule = {
    id: string;
    label: string;
    test: (value: string) => boolean;
  };

  const PASSWORD_GUIDANCE =
    'Use at least 6 characters and include uppercase, lowercase, and numeric characters.';

  const PASSWORD_RULES: PasswordRule[] = [
    {
      id: 'length',
      label: 'At least 6 characters',
      test: (value) => value.length >= 6,
    },
    {
      id: 'lowercase',
      label: 'Contains a lowercase letter',
      test: (value) => /[a-z]/.test(value),
    },
    {
      id: 'uppercase',
      label: 'Contains an uppercase letter',
      test: (value) => /[A-Z]/.test(value),
    },
    {
      id: 'number',
      label: 'Contains a number',
      test: (value) => /\d/.test(value),
    },
  ];

  const FRIENDLY_PASSWORD_ERROR =
    'Passwords must be at least 6 characters and include uppercase, lowercase, and numeric characters.';

  let { data } = $props();

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let message = $state('');
  let error = $state('');

  const passwordChecklist = $derived(
    PASSWORD_RULES.map((rule) => ({
      ...rule,
      satisfied: rule.test(password),
    })),
  );

  function getPasswordValidationError(value: string) {
    for (const rule of PASSWORD_RULES) {
      if (!rule.test(value)) {
        return FRIENDLY_PASSWORD_ERROR;
      }
    }

    return null;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const supabase = data?.supabase;
    const redirectTo = data?.url ? `${data.url}/auth/callback` : undefined;

    message = '';
    error = '';

    if (!supabase) {
      error = 'Unable to reach the authentication service. Please try again later.';
      return;
    }

    const trimmedEmail = email.trim();
    email = trimmedEmail;

    if (!trimmedEmail || !password) {
      error = 'Email and password are required.';
      return;
    }

    const passwordValidationError = getPasswordValidationError(password);

    if (passwordValidationError) {
      error = passwordValidationError;
      return;
    }

    loading = true;

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          error = 'An account with this email already exists. Please sign in instead.';
        } else if (
          signUpError.message.includes('Password should be at least 6 characters') ||
          signUpError.message.includes('Password should contain at least one character')
        ) {
          error = FRIENDLY_PASSWORD_ERROR;
        } else {
          error = signUpError.message;
        }
        return;
      }

      const signUpUser = signUpData?.user ?? null;
      const signUpSession = signUpData?.session ?? null;

      if (signUpUser && Array.isArray(signUpUser.identities) && signUpUser.identities.length === 0) {
        error = 'An account with this email already exists. Please sign in instead.';
        return;
      }

      if (!signUpSession) {
        message = '🎉 Confirmation sent! Peek at your inbox for the magic link to finish setting things up.';
      } else {
        message = '🎉 You are all set! Your account has been created.';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Sign up</title>
</svelte:head>

<div class="w-full max-w-lg md:max-w-xl mx-auto px-4 py-10">
  <form class="space-y-6" method="post" onsubmit={handleSubmit}>
    <div class="space-y-4">
      <div class="form-control">
        <label class="label" for="email">
          <span class="label-text">Email address</span>
        </label>
        <input
          id="email"
          class="input input-bordered w-full"
          type="email"
          name="email"
          bind:value={email}
          autocomplete="email"
          required
        />
      </div>

      <div class="form-control">
        <label class="label" for="password">
          <span class="label-text">Create a password</span>
          <button
            type="button"
            class="label-text-alt tooltip tooltip-left"
            data-tip={PASSWORD_GUIDANCE}
            aria-label={PASSWORD_GUIDANCE}
          >
            <span aria-hidden="true" class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-base-300 text-xs font-semibold">
              i
            </span>
          </button>
        </label>
        <div class="relative">
          <input
            id="password"
            class="input input-bordered w-full pr-12"
            type={showPassword ? 'text' : 'password'}
            name="password"
            bind:value={password}
            autocomplete="new-password"
            aria-describedby="password-guidelines"
            required
          />
            <button
              type="button"
              class="btn btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2"
              onclick={() => (showPassword = !showPassword)}
            aria-pressed={showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {#if showPassword}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.77 21.77 0 0 1 5.06-6.94" />
                <path d="m1 1 22 22" />
                <path d="M9.53 9.53a3 3 0 0 0 4.95 3.11" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            {/if}
            <span class="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
          </button>
        </div>
        <ul id="password-guidelines" class="mt-2 space-y-1 text-sm">
          {#each passwordChecklist as rule (rule.id)}
            <li class={`flex items-center gap-2 ${rule.satisfied ? 'text-success' : 'text-base-content/70'}`}>
              <span
                class={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                  rule.satisfied ? 'border-success bg-success/10 text-success' : 'border-base-300 text-base-content/60'
                }`}
                aria-hidden="true"
              >
                {#if rule.satisfied}
                  ✓
                {:else}
                  ·
                {/if}
              </span>
              <span>{rule.label}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    {#if error}
      <div class="alert alert-error shadow-lg">
        <span class="font-semibold">{error}</span>
      </div>
    {/if}

    {#if message}
      <div class="alert bg-gradient-to-r from-success via-emerald-400 to-success text-white shadow-lg border border-success">
        <div class="flex items-start gap-3">
          <span class="text-2xl" aria-hidden="true">✨</span>
          <div class="text-left">
            <p class="font-semibold">You're almost there!</p>
            <p class="text-sm md:text-base leading-snug">{message}</p>
          </div>
        </div>
      </div>
    {/if}

    <button class="btn btn-primary w-full" type="submit" disabled={loading}>
      {#if loading}
        Signing up...
      {:else}
        Create account
      {/if}
    </button>

  </form>
</div>
