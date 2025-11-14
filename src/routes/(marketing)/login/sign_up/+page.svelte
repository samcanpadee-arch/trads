<script lang="ts">
  const SIGNIN = '/login/sign_in';

  let { data } = $props();

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let message = $state('');
  let error = $state('');

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
        message = 'Check your email for the confirmation link.';
      } else {
        message = 'Your account has been created.';
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

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 min-h-screen flex items-center px-4 py-16 text-slate-900">
  <div class="w-full max-w-4xl mx-auto grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-center">
    <div class="rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-lg">
      <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Sign up</p>
      <h1 class="text-3xl font-semibold mt-2">Create your Tradie Assistant account</h1>
      <p class="text-sm text-slate-600">Same trusted flow as before — just wrapped in a nicer card.</p>
      <form class="mt-6 space-y-6" method="post" onsubmit={handleSubmit}>
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
            </label>
            <input
              id="password"
              class="input input-bordered w-full"
              type="password"
              name="password"
              bind:value={password}
              autocomplete="new-password"
              required
            />
          </div>
        </div>

        {#if error}
          <div class="alert alert-error">
            <span>{error}</span>
          </div>
        {/if}

        {#if message}
          <div class="alert alert-success">
            <span>{message}</span>
          </div>
        {/if}

        <button class="btn btn-primary w-full" type="submit" disabled={loading}>
          {#if loading}
            Signing up...
          {:else}
            Create account
          {/if}
        </button>

        <p class="text-sm text-center text-slate-600">
          Already have an account?
          <a class="link" href={SIGNIN}>Sign in</a>.
        </p>
      </form>
    </div>
    <div class="rounded-[32px] border border-dashed border-amber-200 bg-white/80 p-10 text-center text-sm font-medium text-amber-500">
      Placeholder for onboarding illustration
    </div>
  </div>
</div>
