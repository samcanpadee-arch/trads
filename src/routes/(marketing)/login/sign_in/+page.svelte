<script lang="ts">
  import { onMount } from 'svelte';
  import { Auth } from "@supabase/auth-ui-svelte";
  import { sharedAppearance } from "../login_config";

  let { data } = $props();

  onMount(() => {
    const supa = data?.supabase;
    if (!supa) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      try {
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

<section class="bg-gradient-to-b from-amber-50/70 via-white to-white">
  <div class="mx-auto w-full max-w-lg px-4 py-16">
    <h1 class="text-3xl font-bold text-slate-900">Sign in</h1>
    <p class="mt-2 text-base text-slate-600">Use your email and password to get back to the job.</p>

    <div class="mt-8">
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

    <p class="mt-6 text-sm text-slate-600">
      Need a hand? <a class="link" href="/contact_us">Contact support</a>.
    </p>
  </div>
</section>
