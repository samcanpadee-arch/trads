<script lang="ts">
  const SIGNUP = '/login/sign_up';
  const SIGNIN = '/login/sign_in';
  const HELP   = '/contact_us';
</script>

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 min-h-screen flex items-center px-4 py-16 text-slate-900">
  <div class="mx-auto w-full max-w-5xl grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center">
    <div class="rounded-[32px] border border-slate-200 bg-white/90 p-10 shadow-lg text-center space-y-4">
      <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Account</p>
      <h1 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Righto, how do you want to start?</h1>
      <p class="text-base md:text-lg text-slate-600">New here? Create an account. Back again? Sign in.</p>
      <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <a class="btn btn-primary btn-lg" href={SIGNUP} aria-label="Create account">Create account</a>
        <a class="btn btn-outline btn-lg border-slate-300 text-slate-900" href={SIGNIN} aria-label="Sign in">Sign in</a>
      </div>
      <div class="text-sm text-slate-500">
        <a class="link" href={HELP}>Need help?</a>
      </div>
    </div>
    <div class="rounded-[32px] border border-dashed border-amber-200 bg-white/80 p-10 text-center text-sm font-medium text-amber-500">
      Placeholder for login illustration or screenshot
    </div>
  </div>
</div>
