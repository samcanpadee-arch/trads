<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte";
  import { sharedAppearance, oauthProviders } from "../login_config";

  let { data } = $props();
</script>

<svelte:head>
  <title>Forgot Password</title>
</svelte:head>

<section class="bg-gradient-to-b from-amber-50/70 via-white to-white">
  <div class="mx-auto w-full max-w-lg px-4 py-16">
    <h1 class="text-3xl font-bold text-slate-900">Reset your password</h1>
    <p class="mt-2 text-base text-slate-600">We'll email you a secure link so you can set a new password.</p>

    <div class="mt-8">
      <Auth
        supabaseClient={data.supabase}
        view="forgotten_password"
        redirectTo={`${data.url}/auth/callback?next=%2Faccount%2Fsettings%2Freset_password`}
        providers={oauthProviders}
        socialLayout="horizontal"
        showLinks={false}
        appearance={sharedAppearance}
        additionalData={undefined}
      />
    </div>

    <p class="mt-6 text-sm text-slate-600">
      Remember your password? <a class="link" href="/login/sign_in">Sign in</a>.
    </p>
  </div>
</section>
