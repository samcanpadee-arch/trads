<script lang="ts">
  const SIGNUP = '/login/sign_up';
  const SIGNIN = '/login/sign_in';
  const HELP   = '/contact_us';
</script>

<!-- Minimal, responsive, no card/box -->
<div class="min-h-[70vh] flex items-center justify-center px-4">
  <div class="w-full max-w-xl text-center">
    <h1 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
      Righto, how do you want to start?
    </h1>
    <p class="mt-3 text-base md:text-lg opacity-80">
      New here? Create an account. Back again? Sign in.
    </p>

    <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
      <a class="btn btn-primary btn-lg" href={SIGNUP} aria-label="Create account">Create account</a>
      <a class="btn btn-ghost btn-lg" href={SIGNIN} aria-label="Sign in">Sign in</a>
    </div>

    <div class="mt-4 text-sm opacity-80">
      <a class="link" href={HELP}>Need help?</a>
    </div>
  </div>
</div>
