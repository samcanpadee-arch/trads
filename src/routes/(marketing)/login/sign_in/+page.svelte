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


<div class="w-full max-w-lg md:max-w-xl mx-auto px-4 py-10">
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
