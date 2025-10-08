<script lang="ts">
// marketing layout only
export let data;
</script>

<div class="min-h-screen flex flex-col bg-base-100">

  <!-- HEADER / NAVBAR -->
  <header class="border-b bg-base-100">
    <nav class="navbar max-w-6xl mx-auto px-4 md:px-6 lg:px-10">
      <div class="navbar-start">
        <!-- Mobile menu -->
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-56">
            <li><a href="/blog" sveltekit:prefetch>Blog</a></li>
            <li><a href="/pricing" sveltekit:prefetch>Pricing</a></li>
            <li><a href="/contact_us" sveltekit:prefetch>Contact</a></li>
          </ul>
        </div>

        <!-- Brand -->
        <a class="btn btn-ghost normal-case text-xl" href="/">Tradie Assistant</a>
      </div>

      <!-- Desktop nav (match earlier: <li class="md:mx-2"><a ...> -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li class="md:mx-2"><a href="/blog" sveltekit:prefetch>Blog</a></li>
          <li class="md:mx-2"><a href="/pricing" sveltekit:prefetch>Pricing</a></li>
          <li class="md:mx-2"><a href="/contact_us" sveltekit:prefetch>Contact</a></li>
        </ul>
      </div>

      <!-- Primary CTA -->
      <div class="navbar-end">
        <a href="/account" class="btn btn-primary">Open App</a>
      </div>
    </nav>
  </header>

  <!-- PAGE CONTENT -->
  <main class="flex-1">
    <slot />
  </main>

  <!-- FOOTER: two columns (Explore + About) side-by-side on desktop -->
  <footer class="bg-base-200 mt-10">
    <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 py-10">
      <div class="grid gap-10 md:grid-cols-2">
        <!-- Left: Explore -->
        <nav>
          <h6 class="footer-title">Explore</h6>
          <ul class="mt-2 space-y-2">
            <li><a class="link link-hover" href="/blog" sveltekit:prefetch>Blog</a></li>
            <li><a class="link link-hover" href="/pricing" sveltekit:prefetch>Pricing</a></li>
            <li><a class="link link-hover" href="/contact_us" sveltekit:prefetch>Contact</a></li>
          </ul>
        </nav>

        <!-- Right: Brand overview -->
        <div>
          <h6 class="text-2xl font-bold">Tradie Assistant</h6>
          <p class="opacity-80 mt-2 max-w-prose">
            Tradie Assistant is your go-to AI-powered tool, designed to streamline everyday tasks for tradies.
            From generating instant job estimates to crafting custom client communications, our app helps you save time,
            reduce costs, and improve your service quality. Experience a smarter way to manage your trade work —
            join Tradie Assistant today and transform your business!
          </p>
        </div>
      </div>

      <div class="divider my-6"></div>
      <div class="text-xs opacity-70">© 2025 Tradie Assistant</div>
    </div>
  </footer>

</div>
