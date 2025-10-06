<script lang="ts">
  // Tweak if your routes differ:
  const SIGNUP = '/signup';
  const SIGNIN = '/login';
  const HELP   = '/contact_us';
</script>

<!-- Clean, roomy login with hard min-widths to prevent squish -->
<div class="mx-auto max-w-7xl px-4 md:px-8 py-12">
  <div
    class="grid gap-12
           grid-cols-1
           xl:grid-cols-2
           [--mincol:360px]   /* arbitrary CSS var for readability */
           "
    style="
      grid-template-columns: repeat(1, minmax(var(--mincol), 1fr));
    "
  >
    <!-- On xl+ we explicitly force 2 comfortable columns -->
    <style>
      @media (min-width: 1280px) {
        :global([style*="grid-template-columns"]) {
          grid-template-columns: minmax(var(--mincol), 1fr) minmax(var(--mincol), 1fr) !important;
        }
      }
    </style>

    <!-- Left: Auth choice (primary) -->
    <section class="min-w-[360px]">
      <div class="card bg-base-100 border shadow-sm">
        <div class="card-body p-6 md:p-8">
          <h1 class="text-3xl md:text-4xl font-bold leading-tight">Welcome</h1>
          <p class="opacity-80 mt-1">Pick how you want to get started.</p>

          <!-- Option tiles -->
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
              <p class="text-xs opacity-70 mt-2">Use existing details.</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex flex-col sm:flex-row gap-3">
            <a class="btn btn-primary btn-lg flex-1" href={SIGNUP} aria-label="Create free account">Create free account</a>
            <a class="btn btn-ghost" href={SIGNIN} aria-label="Sign in">Sign in</a>
          </div>

          <!-- Tiny help row -->
          <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-80">
            <a class="link" href={HELP}>Need help?</a>
          </div>

          <p class="text-xs opacity-60 mt-2">14-day free trial on paid plans. Cancel anytime.</p>
        </div>
      </div>
    </section>

    <!-- Right: Visual cheatsheet (kept simple, no phone mock) -->
    <aside class="min-w-[360px]">
      <div class="card bg-base-200/60 border">
        <div class="card-body p-6 md:p-8">
          <h2 class="card-title text-base">What to expect</h2>

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

          <!-- Simple static preview card (wide, not squeezed) -->
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

          <details class="mt-4">
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
