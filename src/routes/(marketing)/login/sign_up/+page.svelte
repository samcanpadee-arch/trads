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

<section class="bg-gradient-to-b from-amber-50/70 via-white to-white">
  <div class="mx-auto w-full max-w-lg px-4 py-16">
    <h1 class="text-3xl font-bold text-slate-900">Create your account</h1>
    <p class="mt-2 text-base text-slate-600">Sign up in seconds. You'll confirm via email before heading to the dashboard.</p>

    <form class="mt-8 space-y-6" method="post" onsubmit={handleSubmit}>
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
</section>
