<script lang="ts">
// marketing layout only
export let data;
</script>

<!-- Page wrapper -->
<div class="min-h-screen flex flex-col bg-base-100">

  <!-- HEADER / NAVBAR -->
  <header class="border-b bg-base-100">
    <nav class="navbar max-w-6xl mx-auto px-4 md:px-6 lg:px-10">
      <div class="navbar-start">
        <!-- Mobile menu -->
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"/></svg>
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

      <!-- Desktop menu -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><a href="/blog" sveltekit:prefetch>Blog</a></li>
          <li><a href="/pricing" sveltekit:prefetch>Pricing</a></li>
          <li><a href="/contact_us" sveltekit:prefetch>Contact</a></li>
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

  <!-- FOOTER (simple & valid; no stray tags) -->
  <footer class="bg-base-200 py-10 mt-10">
    <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-10">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <span class="footer-title opacity-80">Product</span>
          <nav class="mt-2 flex flex-col">
            <a class="link link-hover my-1" href="/blog" sveltekit:prefetch>Blog</a>
            <a class="link link-hover my-1" href="/pricing" sveltekit:prefetch>Pricing</a>
          </nav>
        </div>
        <div>
          <span class="footer-title opacity-80">Company</span>
          <nav class="mt-2 flex flex-col">
            <a class="link link-hover my-1" href="/contact_us" sveltekit:prefetch>Contact Us</a>
          </nav>
        </div>
        <div>
          <span class="footer-title opacity-80">Get started</span>
          <div class="mt-2">
            <a class="btn btn-primary" href="/account">Open App</a>
          </div>
        </div>
      </div>
    </div>
  </footer>

</div>
