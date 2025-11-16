<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"

  let { data } = $props()
</script>

<svelte:head>
  <title>Forgot Password</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 pt-10 text-center space-y-2">
  <h1 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Forgot password</h1>
  <p class="text-base md:text-lg opacity-80">
    Enter your email and we'll send a reset link so you can get back into your account.
  </p>
</div>
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
<div class="text-l text-slate-800 mt-4">
  Remember your password? <a class="underline" href="/login/sign_in">Sign in</a
  >.
</div>
