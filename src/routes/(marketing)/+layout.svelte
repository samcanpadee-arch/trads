<script lang="ts">
// marketing layout only
export let data;
</script>

<div class="min-h-screen flex flex-col bg-base-100">

  <!-- HEADER / NAVBAR -->
  <header class="border-b bg-base-100">
    <nav class="navbar max-w-6xl mx-auto px-4 md:px-6 lg:px-10">
      <!-- Left: burger + brand -->
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
            <li><a href="/account">Open App</a></li>
          </ul>
        </div>

        <!-- Brand -->
        <a class="btn btn-ghost normal-case text-xl" href="/">Tradie Assistant</a>
      </div>

      <!-- Center: desktop nav (exact spacing + alignment) -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal items-center text-sm px-0 gap-0">
          <li class="md:mx-2"><a href="/blog" sveltekit:prefetch class="px-0">Blog</a></li>
          <li class="md:mx-2"><a href="/pricing" sveltekit:prefetch class="px-0">Pricing</a></li>
          <li class="md:mx-2"><a href="/contact_us" sveltekit:prefetch class="px-0">Contact</a></li>
        </ul>
      </div>

      <!-- Right: primary CTA -->
      <div class="navbar-end">
        <a href="/account" class="btn btn-primary">Open App</a>
      </div>
    </nav>
  </header>

  <!-- PAGE CONTENT -->
  <main class="flex-1">
    <slot />
  </main>

  <!-- FOOTER: two columns (Explore + About) side-by-side -->
  <footer class="footer bg-base-200 text-base-content py-12 mt-16">
  <div class="w-full flex justify-center px-4">
    <div class="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
      <!-- Explore column -->
      <div class="justify-self-center  text-center md:text-left">
        <span class="footer-title opacity-80">Explore</span>
        <nav>
          <ul class="space-y-1">
            <li><a class="link link-hover" href="/blog">Blog</a></li>
            <li><a class="link link-hover" href="/pricing">Pricing</a></li>
            <li><a class="link link-hover" href="/contact_us">Contact</a></li>
            <li><a class="link link-hover" href="/account">Open App</a></li>
            <li><a class="link link-hover" href="/legal/terms">Terms</a></li>
            <li><a class="link link-hover" href="/legal/privacy">Privacy</a></li>
          </ul>
        </nav>
      </div>

      <!-- Brand blurb column -->
      <div class="justify-self-center md:justify-self-start text-center md:text-left">
        <span class="footer-title opacity-80">Tradie Assistant</span>
        <p class="max-w-md text-sm opacity-80 mx-auto md:mx-0">
          Tradie Assistant is your go-to AI-powered tool, designed to streamline everyday tasks for tradies.
          From generating instant job estimates to crafting custom client communications, our app helps you
          save time, reduce costs, and improve your service quality. Experience a smarter way to manage your
          trade work - join Tradie Assistant today and transform your business!
        </p>
        <p class="text-xs opacity-60 mt-3">&copy; 2025 Tradie Assistant</p>
      </div>
    </div>
  </div>
</footer>



</div>
