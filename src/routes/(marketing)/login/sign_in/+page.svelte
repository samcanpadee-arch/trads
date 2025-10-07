<script lang="ts">
  import { onMount } from 'svelte';
  import { Auth } from "@supabase/auth-ui-svelte";
  import { sharedAppearance, oauthProviders } from "../login_config";

  let { data } = $props();

  // Minimal, robust redirect: if already signed in -> /account
  // and redirect immediately when SIGNED_IN fires.
  onMount(async () => {
    try {
      const supa = data?.supabase;
      if (!supa) return;

      // Already signed in? (e.g., other tab)
      const sessRes = await supa.auth.getSession();
      if (sessRes?.data?.session) {
        location.replace('/account');
        return;
      }

      // Redirect as soon as sign-in completes
      const { data: sub } = supa.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          location.replace('/account');
        }
      });

      // Optional cleanup if this page unmounts (not critical)
      return () => sub?.subscription?.unsubscribe?.();
    } catch (e) {
      console.error('signin redirect hook failed', e);
    }
  });
</script>

<svelte:head>
  <title>Sign in</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-10">
  <header class="mb-6 text-center">
    <h1 class="text-3xl font-bold">Welcome back</h1>
    <p class="mt-2 opacity-70">Sign in to pick up where you left off.</p>
  </header>

  <Auth
    supabaseClient={data.supabase}
    view="sign_in"
    redirectTo={`${data.url}/auth/callback`}
    showLinks={false}
    providers={oauthProviders}
    socialLayout="horizontal"
    appearance={sharedAppearance}
    additionalData={undefined}
  />

  <div class="mt-6 space-y-2 text-sm">
    <div>
      <a class="link" href="/login/forgot_password">Forgot password?</a>
    </div>
    <div>
      Don’t have an account?
      <a class="link" href="/login/sign_up">Create one</a>
    </div>
    <div>
      <a class="link" href="/contact_us">Need help?</a>
    </div>
  </div>
</div>

<style>
  /* Keep social/GitHub hidden if anything sneaks in */
  a[href*="github"], button[href*="github"], a[href*="/auth/github"], button[data-provider="github"] { display: none !important; }
  [aria-label*="GitHub" i], [data-provider*="github" i] { display: none !important; }
</style>
