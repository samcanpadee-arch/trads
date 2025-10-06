<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte";
  import { sharedAppearance } from "../login_config";

  let { data } = $props();
</script>

<svelte:head>
  <title>Sign up</title>
</svelte:head>

<!-- Keep the Supabase Auth form exactly as-is, but remove social providers -->
<Auth
  supabaseClient={data.supabase}
  view="sign_up"
  redirectTo={`${data.url}/auth/callback`}
  showLinks={false}
  providers={[]}
  socialLayout="horizontal"
  appearance={sharedAppearance}
  additionalData={undefined}
/>
