<script lang="ts">
  // Tweak these if your routes differ (e.g., '/register' instead of '/signup')
  const SIGNUP = '/signup';
  const SIGNIN = '/login';
  const RESET  = '/reset-password';   // change if needed; otherwise hides harmlessly if 404 guarded elsewhere
  const HELP   = '/contact_us';
</script>

<!-- Minimal, helpful login page (no functional changes) -->
<div class="min-h-[70vh] max-w-6xl mx-auto px-4 md:px-6 lg:px-10 py-10 grid gap-8 md:grid-cols-2 items-start">
  <!-- Auth Choice Card (mobile first) -->
  <section class="order-1 md:order-none">
    <div class="card bg-base-100 border shadow-sm max-w-md">
      <div class="card-body">
        <h1 class="text-3xl md:text-4xl font-bold">Welcome</h1>
        <p class="opacity-80 mt-1">Pick how you want to get started.</p>

        <!-- Two option tiles (icon-led, minimal text) -->
        <div class="grid grid-cols-2 gap-3 mt-5">
          <div class="rounded-xl border bg-base-100 p-3">
            <div class="flex items-center gap-2">
              <div class="mask mask-squircle bg-base-300 w-8 h-8 grid place-items-center text-xs">🆕</div>
              <span class="font-medium">Create account</span>
            </div>
            <p class="text-xs opacity-70 mt-2">Email &amp; password. 1–2 mins.</p>
          </div>
          <div class="rounded-xl border bg-base-100 p-3">
            <div class="flex items-center gap-2">
              <div class="mask mask-squircle bg-base-300 w-8 h-8 grid place-items-center text-xs">🔑</div>
              <span class="font-medium">Sign in</span>
            </div>
            <p class="text-xs opacity-70 mt-2">Use your existing details.</p>
          </div>
        </div>

        <!-- Primary & secondary actions (no logic changes) -->
        <div class="mt-5 flex items-center gap-3">
          <a class="btn btn-primary btn-lg flex-1" href={SIGNUP} aria-label="Create free account">Create free account</a>
          <a class="btn btn-ghost" href={SIGNIN} aria-label="Sign in">Sign in</a>
        </div>

        <!-- Tiny help row -->
        <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-80">
          <a class="link" href={RESET}>Forgot password?</a>
          <span aria-hidden="true">·</span>
          <a class="link" href={HELP}>Need help?</a>
        </div>

        <!-- Subtle reassurance -->
        <p class="text-xs opacity-60 mt-2">14-day free trial on paid plans. Cancel anytime.</p>
      </div>
    </div>
  </section>

  <!-- Visual Cheatsheet (show, don’t sell) -->
  <aside class="order-none md:order-1">
    <div class="card bg-base-200/60 border">
      <div class="card-body">
        <h2 class="card-title text-base">What to expect</h2>

        <!-- Three pictogram steps -->
        <ul class="space-y-3 text-sm">
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

        <!-- Quiet mock screen (static) -->
        <div class="mt-5 grid gap-3">
          <div class="mockup-phone">
            <div class="camera"></div>
            <div class="display">
              <div class="artboard phone-1 p-4">
                <div class="bg-base-100/90 border rounded-xl p-4 w-full">
                  <div class="text-sm font-semibold">Create account</div>
                  <div class="mt-3 space-y-2">
                    <div class="skeleton h-8 w-full rounded-md"></div>
                    <div class="skeleton h-8 w-full rounded-md"></div>
                  </div>
                  <div class="skeleton h-9 w-full rounded-md mt-4"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tiny collapsed FAQ (optional, non-salesy) -->
          <details class="mt-1">
            <summary class="cursor-pointer text-sm opacity-80">Quick help</summary>
            <ul class="mt-2 text-sm opacity-80 space-y-1">
              <li>Didn’t get the email? Check spam or try again in a minute.</li>
              <li>Still stuck? <a class="link" href={HELP}>Contact support</a>.</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  </aside>
</div>
