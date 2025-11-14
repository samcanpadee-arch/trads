<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"

  let { data } = $props()
</script>

<svelte:head>
  <title>Forgot Password</title>
</svelte:head>

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 min-h-screen flex items-center px-4 py-16 text-slate-900">
  <div class="w-full max-w-3xl mx-auto grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-center">
    <div class="rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-lg">
      <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Forgot password</p>
      <h1 class="text-3xl font-semibold mt-2">No stress — reset it here</h1>
      <div class="mt-6">
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
      <div class="text-sm text-slate-600 mt-4">
        Remember your password? <a class="link" href="/login/sign_in">Sign in</a>.
      </div>
    </div>
    <div class="rounded-[32px] border border-dashed border-amber-200 bg-white/80 p-10 text-center text-sm font-medium text-amber-500">
      Placeholder for password-reset illustration
    </div>
  </div>
</div>
