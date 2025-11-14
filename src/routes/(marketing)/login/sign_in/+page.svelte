<script lang="ts">
  import { onMount } from 'svelte';
  import { Auth } from "@supabase/auth-ui-svelte";
  import { sharedAppearance } from "../login_config";

  let { data } = $props();

  // Redirect to /account immediately if already signed in
  // and as soon as SIGNED_IN fires.
  onMount(async () => {
    try {
      const supa = data?.supabase;
      if (!supa) return;

      const sessRes = await supa.auth.getSession();
      if (sessRes?.data?.session) {
        location.replace('/account');
        return;
      }

      const { data: sub } = supa.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          location.replace('/account');
        }
      });

      return () => sub?.subscription?.unsubscribe?.();
    } catch (e) {
      console.error('signin redirect hook failed', e);
    }
  });
</script>

<svelte:head>
  <title>Sign in</title>
</svelte:head>


<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 min-h-screen flex items-center px-4 py-16 text-slate-900">
  <div class="w-full max-w-3xl mx-auto grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-center">
    <div class="rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-lg">
      <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Sign in</p>
      <h1 class="text-3xl font-semibold mt-2">Welcome back</h1>
      <p class="text-sm text-slate-600">Jump straight back into Smart Tools, Chat, or the Tradie Library.</p>
      <div class="mt-6">
        <Auth
          supabaseClient={data.supabase}
          view="sign_in"
          redirectTo={`${data.url}/auth/callback`}
          showLinks={false}
          providers={[]}
          socialLayout="horizontal"
          appearance={sharedAppearance}
          additionalData={undefined}
        />
      </div>
    </div>
    <div class="rounded-[32px] border border-dashed border-amber-200 bg-white/80 p-10 text-center text-sm font-medium text-amber-500">
      Placeholder for returning-user illustration
    </div>
  </div>
</div>
