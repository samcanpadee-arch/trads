<script lang="ts">
  const year = new Date().getFullYear();
</script>

<svelte:head>
  <title>Why Tradie Assistant</title>
  <meta name="description" content="We built an AI that speaks tradie. Learn why Tradie Assistant helps you quote faster, communicate better, and deliver top-notch work." />
  <link rel="canonical" href="https://sveltekit-saas-starter-beta-eight.vercel.app/why-us" />
  <meta property="og:title" content="Why Tradie Assistant" />
  <meta property="og:description" content="Built by tech heads and tradie mates to make your day smoother and your jobs sharper." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />

  <!-- AboutPage JSON-LD -->
  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"AboutPage",
    "name":"Why Tradie Assistant",
    "mainEntityOfPage":"https://sveltekit-saas-starter-beta-eight.vercel.app/why-us",
    "about":{
      "@type":"Organization",
      "name":"Tradie Assistant",
      "description":"AI toolkit for tradies — pricing, proposals, reviews, and manuals-aware assistance."
    }
  }
  </script>
</svelte:head>

<section class="px-4 md:px-6 lg:px-10 pt-10 pb-6">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl md:text-4xl font-extrabold leading-tight">Why Tradie Assistant</h1>
    <p class="mt-4 text-base md:text-lg opacity-90">
      We’re a bunch of tech heads and tradie mates who built an AI that actually speaks your language.
      Born from a sparkie’s workshop and a few pub chats, our mission is simple: make your day smoother and your jobs sharper.
      Whether you’re up on a roof or down in a trench, we’ve got your back.
    </p>
  </div>
</section>

<section class="px-4 md:px-6 lg:px-10 py-8 bg-base-200">
  <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
    <div>
      <h2 class="text-xl font-bold">Built for trades</h2>
      <p class="opacity-80 mt-2">Tools, chat, and a manuals-aware assistant tuned for the way tradies actually work.</p>
    </div>
    <div>
      <h2 class="text-xl font-bold">Job-ready outputs</h2>
      <p class="opacity-80 mt-2">Quotes, proposals, review replies, and emails you can send without rework.</p>
    </div>
    <div>
      <h2 class="text-xl font-bold">Real knowledge</h2>
      <p class="opacity-80 mt-2">Use our library or your PDFs. Where possible, we include references so you can check the source.</p>
    </div>
  </div>
</section>

<section class="px-4 md:px-6 lg:px-10 py-10">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Our promise</h2>
    <ul class="mt-3 space-y-2 opacity-90 text-sm md:text-base">
      <li>• Keep it simple and fast</li>
      <li>• Respect your time and your data</li>
      <li>• Focus on outcomes, not AI hype</li>
    </ul>
    <div class="mt-6 flex gap-3">
      <a href="/" class="btn btn-outline">Back to Home</a>
      <a href="/account/tools" class="btn btn-primary">Get Started Free</a>
    </div>
    <p class="text-xs opacity-60 mt-6">&copy; {year} Tradie Assistant</p>
  </div>
</section>
