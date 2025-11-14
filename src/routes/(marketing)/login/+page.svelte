<script lang="ts">
  const SIGNUP = '/login/sign_up';
  const SIGNIN = '/login/sign_in';
  const HELP   = '/contact_us';
</script>

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 min-h-screen px-4 py-20 text-slate-900">
  <div class="mx-auto w-full max-w-6xl">
    <div class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="rounded-[32px] border border-slate-200 bg-white/95 p-12 shadow-2xl">
        <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Account</p>
        <h1 class="mt-4 text-4xl md:text-5xl font-bold leading-tight tracking-tight">Righto, how do you want to start?</h1>
        <p class="mt-4 text-base md:text-lg text-slate-600">New here? Create an account. Back again? Sign in.</p>
        <div class="mt-8 flex flex-col sm:flex-row gap-4">
          <a class="btn btn-primary btn-lg" href={SIGNUP} aria-label="Create account">Create account</a>
          <a class="btn btn-outline btn-lg border-slate-300 text-slate-900" href={SIGNIN} aria-label="Sign in">Sign in</a>
        </div>
        <div class="mt-6 text-sm text-slate-500">
          <a class="link" href={HELP}>Need help?</a>
        </div>
      </div>

      <div class="rounded-[32px] border border-amber-100/70 bg-white/70 p-10 shadow-lg backdrop-blur">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Why tradies log in</p>
        <ul class="mt-6 space-y-4 text-sm md:text-base text-slate-600">
          <li class="rounded-2xl border border-white/60 bg-white/70 p-4">
            <span class="font-semibold text-slate-900">Smart Chat</span> turns rough notes into tidy SMS, emails, and scope wording in seconds.
          </li>
          <li class="rounded-2xl border border-white/60 bg-white/70 p-4">
            <span class="font-semibold text-slate-900">Smart Tools</span> keep proposals, cost calcs, and templates lined up and ready to send.
          </li>
          <li class="rounded-2xl border border-white/60 bg-white/70 p-4">
            <span class="font-semibold text-slate-900">Tradie Library</span> answers wiring, HVAC, plumbing, and safety questions on the spot.
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
