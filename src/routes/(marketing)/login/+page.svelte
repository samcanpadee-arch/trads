<script lang="ts">
  const SIGNUP = '/login/sign_up';
  const SIGNIN = '/login/sign_in';
  const HELP   = '/contact_us';
</script>

<section class="relative isolate overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-white">
  <div class="mx-auto flex min-h-[75vh] w-full max-w-4xl items-center px-4 py-20">
    <div class="w-full text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600/80">
        Welcome back to Tradie Assistant
      </p>
      <h1 class="mt-3 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
        Righto, how do you want to start?
      </h1>
      <p class="mt-4 text-base text-slate-600 md:text-lg">
        New here? Create an account. Back again? Sign in.
      </p>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a class="btn btn-primary btn-lg" href={SIGNUP} aria-label="Create account">
          Create account
        </a>
        <a class="btn btn-ghost btn-lg" href={SIGNIN} aria-label="Sign in">
          Sign in
        </a>
      </div>

      <p class="mt-6 text-sm text-slate-600">
        <a class="link" href={HELP}>Need help?</a>
      </p>
    </div>
  </div>
</section>
