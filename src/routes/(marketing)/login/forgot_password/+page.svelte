<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"

  let { data } = $props()
</script>

<svelte:head>
  <title>Forgot Password</title>
</svelte:head>

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 min-h-screen px-4 py-24 text-slate-900">
  <div class="mx-auto w-full max-w-5xl">
    <section class="rounded-[32px] border border-slate-200/80 bg-white/95 p-10 md:p-12 shadow-2xl">
      <div class="grid gap-12 lg:grid-cols-2 items-start">
        <div class="space-y-4">
          <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Forgot password</p>
          <h1 class="text-3xl font-semibold">No stress — reset it here</h1>
          <p class="text-sm text-slate-600">Punch in your email and we’ll send the secure link straight away.</p>
          <p class="text-sm text-slate-500">Remember your password? <a class="link" href="/login/sign_in">Sign in</a>.</p>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
      </div>
    </section>
  </div>
</div>
