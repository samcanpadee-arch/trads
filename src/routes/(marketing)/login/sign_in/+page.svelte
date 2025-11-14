<script lang="ts">
  import { onMount } from 'svelte';
  import { Auth } from "@supabase/auth-ui-svelte";
  import { sharedAppearance } from "../login_config";

  let { data } = $props();

  // Redirect to /account immediately if already signed in
  // and as soon as SIGNED_IN fires.
  onMount(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
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

        cleanup = () => sub?.subscription?.unsubscribe?.();
      } catch (e) {
        console.error('signin redirect hook failed', e);
      }
    })();

    return () => cleanup?.();
  });
</script>

<svelte:head>
  <title>Sign in</title>
</svelte:head>


<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 min-h-screen px-4 py-20 text-slate-900">
  <div class="mx-auto w-full max-w-5xl">
    <div class="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-stretch">
      <section class="rounded-[32px] border border-amber-100/70 bg-white/80 p-10 shadow-lg">
        <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Sign in</p>
        <h1 class="mt-4 text-3xl font-semibold">Welcome back</h1>
        <p class="mt-2 text-base text-slate-600">Jump straight back into Smart Tools, Chat, or the Tradie Library.</p>
        <div class="mt-6 space-y-4 text-sm text-slate-600">
          <p>Use the same Supabase-powered login you know. We’ll redirect you to your account the moment you’re signed in.</p>
          <p class="text-slate-500">Stuck? <a class="link" href="/contact_us">Message support</a> for a quick hand.</p>
        </div>
      </section>

      <section class="rounded-[32px] border border-slate-200 bg-white/95 p-10 shadow-2xl">
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
      </section>
    </div>
  </div>
</div>
