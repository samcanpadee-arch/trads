<script lang="ts">
  const SIGNUP = '/login/sign_up';
  const SIGNIN = '/login/sign_in';
  const HELP   = '/contact_us';
</script>

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 min-h-screen px-4 py-24 text-slate-900">
  <div class="mx-auto w-full max-w-6xl">
    <div class="grid gap-16 lg:grid-cols-2 lg:items-center">
      <section class="space-y-6">
        <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Account</p>
        <h1 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Righto, how do you want to start?</h1>
        <p class="text-base md:text-lg text-slate-600">
          New here? Create an account. Back again? Sign in.
        </p>

        <div class="flex flex-wrap gap-4 pt-4">
          <a class="btn btn-primary btn-lg" href={SIGNUP} aria-label="Create account">Create account</a>
          <a class="btn btn-outline btn-lg border-slate-300 text-slate-900" href={SIGNIN} aria-label="Sign in">Sign in</a>
        </div>

        <p class="text-sm text-slate-500">
          <a class="link" href={HELP}>Need help?</a>
        </p>
      </section>

      <section class="rounded-[32px] border border-slate-200/80 bg-white/90 p-12 shadow-xl">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Why tradies log in</p>
        <div class="mt-8 space-y-5 text-base text-slate-600">
          <article class="rounded-2xl border border-white/70 bg-white/95 p-5 shadow-sm">
            <h2 class="font-semibold text-slate-900">Smart Chat</h2>
            <p class="mt-2 text-sm md:text-base">Turns rough notes into tidy SMS, emails, and scope wording in seconds.</p>
          </article>
          <article class="rounded-2xl border border-white/70 bg-white/95 p-5 shadow-sm">
            <h2 class="font-semibold text-slate-900">Smart Tools</h2>
            <p class="mt-2 text-sm md:text-base">Keep proposals, cost calcs, and templates lined up and ready to send.</p>
          </article>
          <article class="rounded-2xl border border-white/70 bg-white/95 p-5 shadow-sm">
            <h2 class="font-semibold text-slate-900">Tradie Library</h2>
            <p class="mt-2 text-sm md:text-base">Answers wiring, HVAC, plumbing, and safety questions on the spot.</p>
          </article>
        </div>
      </section>
    </div>
  </div>
</div>
