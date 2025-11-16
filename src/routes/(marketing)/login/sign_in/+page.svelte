<script lang="ts">
  import { goto } from '$app/navigation';

  let { data } = $props();

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');
  let message = $state('');

  const verifiedNotice = data?.url?.searchParams?.get('verified') === 'true';

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const supabase = data?.supabase;

    error = '';
    message = '';

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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          error = 'That email and password combination did not work. Double-check and try again.';
        } else if (signInError.message === 'Email not confirmed') {
          error = 'Please confirm your email before signing in. Peek at your inbox for the link.';
        } else {
          error = signInError.message;
        }
        return;
      }

      message = "Too easy! We'll scoot you over to your account in a tick...";
      await goto('/account');
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

<div class="w-full max-w-lg md:max-w-xl mx-auto px-4 py-10 space-y-6">
  {#if verifiedNotice}
    <div class="alert alert-success" role="status" aria-live="polite">
      <span class="font-semibold">Email verified!</span>
      <span>You can now sign in with your password.</span>
    </div>
  {/if}

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
        <input
          id="password"
          class="input input-bordered w-full"
          type="password"
          name="password"
          bind:value={password}
          autocomplete="current-password"
          required
        />
      </div>
    </div>

    {#if error}
      <div class="alert alert-error" role="alert" aria-live="assertive">
        <span class="font-semibold">{error}</span>
      </div>
    {/if}

    {#if message}
      <div class="alert alert-success" role="status" aria-live="polite">
        <span>{message}</span>
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

  <div class="text-center space-y-2 text-sm opacity-80">
    <p>
      <a class="link" href="/login/forgot_password">Forgot password?</a>
    </p>
    <p>
      Don't have an account?
      <a class="link" href="/login/sign_up">Create one</a>
    </p>
    <p>
      <a class="link" href="/contact_us">Need help?</a>
    </p>
  </div>
</div>
