<script lang="ts">
  // If your routes differ, tweak these:
  const SIGNUP = '/signup';
  const SIGNIN = '/login';     // this page just links out; no form changes here
  const HELP   = '/contact_us';
</script>

<!-- Minimal, visual-first login page -->
<div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 py-12">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

    <!-- Auth Choice (primary focus, first on mobile) -->
    <section class="w-full">
      <div class="card bg-base-100 border shadow-sm w-full">
        <div class="card-body p-6 md:p-8">
          <h1 class="text-3xl md:text-4xl font-bold">Welcome</h1>
          <p class="opacity-80 mt-1">Pick how you want to get started.</p>

          <!-- Two option tiles (icon-led, minimal text) -->
          <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="rounded-xl border bg-base-100 p-4">
              <div class="flex items-center gap-2">
                <div class="mask mask-squircle bg-base-300 w-8 h-8 grid place-items-center text-xs">🆕</div>
                <span class="font-medium">Create account</span>
              </div>
              <p class="text-xs opacity-70 mt-2">Email &amp; password. 1–2 mins.</p>
            </div>
            <div class="rounded-xl border bg-base-100 p-4">
              <div class="flex items-center gap-2">
                <div class="mask mask-squircle bg-base-300 w-8 h-8 grid place-items-center text-xs">🔑</div>
                <span class="font-medium">Sign in</span>
              </div>
              <p class="text-xs opacity-70 mt-2">Use your existing details.</p>
            </div>
          </div>

          <!-- Primary & secondary actions -->
          <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <a class="btn btn-primary btn-lg flex-1" href={SIGNUP} aria-label="Create free account">Create free account</a>
            <a class="btn btn-ghost" href={SIGNIN} aria-label="Sign in">Sign in</a>
          </div>

          <!-- Tiny help row (single line, not salesy) -->
          <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-80">
            <a class="link" href={HELP}>Need help?</a>
          </div>

          <!-- Subtle reassurance -->
          <p class="text-xs opacity-60 mt-2">14-day free trial on paid plans. Cancel anytime.</p>
        </div>
      </div>
    </section>

    <!-- Visual Cheatsheet (second on mobile, sticky on large) -->
    <aside class="w-full lg:sticky lg:top-24">
      <div class="card bg-base-200/60 border w-full">
        <div class="card-body p-6 md:p-8">
          <h2 class="card-title text-base">What to expect</h2>

          <!-- Three compact steps -->
          <ul class="space-y-4 text-sm mt-2">
            <li class="flex items-start gap-3">
              <div class="mask mask-squircle bg-base-300 w-7 h-7 grid place-items-center text-[11px]">✅</div>
              <div>
                <div class="font-medium">What you’ll need</div>
                <div class="opacity-70">Email &amp; a secure password.</div>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="mask mask-squircle bg-base-300 w-7 h-7 grid place-items-center text-[11px]">📨</div>
              <div>
                <div class="font-medium">Check your email</div>
                <div class="opacity-70">We’ll send a verification if needed.</div>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="mask mask-squircle bg-base-300 w-7 h-7 grid place-items-center text-[11px]">📱</div>
              <div>
                <div class="font-medium">Use on any device</div>
                <div class="opacity-70">Mobile, tablet, or desktop.</div>
              </div>
            </li>
          </ul>

          <!-- Quiet mock screen (static, roomy) -->
          <div class="mt-6">
            <div class="rounded-2xl border bg-base-100 p-5">
              <div class="text-sm font-semibold">Create account</div>
              <div class="mt-3 space-y-3">
                <div class="skeleton h-9 w-full rounded-md"></div>
                <div class="skeleton h-9 w-full rounded-md"></div>
                <div class="skeleton h-10 w-full rounded-md"></div>
              </div>
              <div class="mt-4 text-[11px] opacity-60">Preview only</div>
            </div>
          </div>

          <!-- Tiny collapsed help -->
          <details class="mt-3">
            <summary class="cursor-pointer text-sm opacity-80">Quick help</summary>
            <ul class="mt-2 text-sm opacity-80 space-y-1">
              <li>Didn’t get the email? Check spam, then try again.</li>
              <li>Still stuck? <a class="link" href={HELP}>Contact support</a>.</li>
            </ul>
          </details>
        </div>
      </div>
    </aside>

  </div>
</div>
