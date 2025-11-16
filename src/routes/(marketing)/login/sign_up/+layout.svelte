<script lang="ts">
  const HELP = '/contact_us';
</script>

<div class="max-w-md mx-auto px-4 pt-10 text-center space-y-2">
  <h1 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Create your account</h1>
  <p class="text-base md:text-lg opacity-80">
    Too easy — pop in your email, set a password, confirm the email we send, then jump back in and get cracking.
  </p>
</div>

<!-- Render the existing page (your current form lives in here) -->
<slot />

<!-- Reassurance + secondary links + legal -->
<div class="max-w-md mx-auto px-4 mt-4 text-center">
  <p class="text-sm opacity-80">14-day free trial on paid tiers. Cancel anytime.</p>
  <p class="mt-2 text-sm opacity-80">
    Already have an account?
    <a class="link" href="/login/sign_in"> Sign in</a>
    &nbsp;·&nbsp;
    <a class="link" href="/login/forgot_password">Forgot password?</a>
    &nbsp;·&nbsp;
    <a class="link" href={HELP}>Need help?</a>
  </p>
  <p class="mt-3 text-xs opacity-70">
    By signing up, you agree to our
    <a class="link" href="/legal/terms"> Terms of Service</a>
    and
    <a class="link" href="/legal/privacy"> Privacy Policy</a>.
  </p>
</div>

<style>
  /* VISUAL-ONLY: hide any GitHub/social auth buttons w/out touching auth config */
  :global(a[href*="github"]),
  :global(button[href*="github"]),
  :global(a[href*="/auth/github"]),
  :global(button[data-provider="github"]),
  :global([aria-label*="GitHub" i]),
  :global([data-provider*="github" i]) {
    display: none !important;
  }
</style>
