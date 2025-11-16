<script lang="ts">
  import { onMount } from 'svelte';

  let { data } = $props();

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');
  let showPassword = $state(false);

  onMount(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const supa = data?.supabase;
        if (!supa) return;

        const sessionResponse = await supa.auth.getSession();
        if (sessionResponse?.data?.session) {
          location.replace('/account');
          return;
        }

        const { data: sub } = supa.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            location.replace('/account');
          }
        });

        unsubscribe = () => sub?.subscription?.unsubscribe?.();
      } catch (e) {
        console.error('signin redirect hook failed', e);
      }
    })();

    return () => {
      unsubscribe?.();
    };
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const supabase = data?.supabase;
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

    loading = true;
    error = '';

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInError) {
        error = signInError.message;
        return;
      }

      if (signInData?.session) {
        location.replace('/account');
      } else {
        error = 'Sign-in succeeded, but we could not start a session. Please refresh and try again.';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Sign in</title>
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
          <span class="label-text">Password</span>
        </label>
        <div class="relative">
          <input
            id="password"
            class="input input-bordered w-full pr-12"
            type={showPassword ? 'text' : 'password'}
            name="password"
            bind:value={password}
            autocomplete="current-password"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.77 21.77 0 0 1 5.06-6.94" />
                <path d="m1 1 22 22" />
                <path d="M9.53 9.53a3 3 0 0 0 4.95 3.11" />
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7S1 12 1 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            {/if}
            <span class="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
          </button>
        </div>
      </div>
    </div>

    {#if error}
      <div class="alert alert-error shadow-lg">
        <span class="font-semibold">{error}</span>
      </div>
    {/if}

    <button class="btn btn-primary w-full" type="submit" disabled={loading}>
      {#if loading}
        Signing in...
      {:else}
        Sign in
      {/if}
    </button>
  </form>
</div>
