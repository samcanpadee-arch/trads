<script lang="ts">
  // Landing page is static; no client-side data fetching to keep it fast.
  // Uses DaisyUI/Tailwind classes already in the project.
  // Keep copy light, Aussie-friendly, and focused on tradie value.
  const currentYear = new Date().getFullYear();
</script>

<svelte:head>
  <!-- Primary SEO -->
  <title>Tradie Assistant — AI tools for Aussie tradies: quotes, proposals, reviews & manuals</title>
  <meta name="description" content="Price jobs, write proposals, reply to reviews, and get answers from real manuals. Built for Aussie tradies. Free tools included. 14-day trials on paid tiers." />
  <link rel="canonical" href="https://sveltekit-saas-starter-beta-eight.vercel.app/" />

  <!-- Open Graph -->
  <meta property="og:title" content="Tradie Assistant — AI tools for Aussie tradies" />
  <meta property="og:description" content="Six free tools, AI chat, and a premium AI Assistant that cites manuals, guides, and standards." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://sveltekit-saas-starter-beta-eight.vercel.app/" />
  <meta property="og:image" content="https://sveltekit-saas-starter-beta-eight.vercel.app/og-tradie-assistant.jpg" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Tradie Assistant — AI tools for Aussie tradies" />
  <meta name="twitter:description" content="Quotes. Proposals. Reviews. Manuals. Built for tradies." />
  <meta name="twitter:image" content="https://sveltekit-saas-starter-beta-eight.vercel.app/og-tradie-assistant.jpg" />

  <!-- Basic JSON-LD for an application landing page -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Tradie Assistant",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "description": "AI toolkit for Australian tradies with free mini tools, AI chat, and a premium assistant that cites product manuals and standards.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "AUD"
    },
    "url": "https://sveltekit-saas-starter-beta-eight.vercel.app/"
  }
  </script>
</svelte:head>

<!-- HERO -->
<section class="px-4 md:px-6 lg:px-10 py-10 md:py-16">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
    <div>
      <h1 class="text-3xl md:text-5xl font-extrabold leading-tight">
        Your AI mate on the job — <span class="text-primary">built for Aussie tradies</span>
      </h1>
      <p class="mt-4 text-base md:text-lg opacity-90">
        Price jobs, write proposals, reply to reviews, and get answers from real manuals. Simple, fast, and
        tradie-friendly. Free tools included.
      </p>
      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <a href="/account" class="btn btn-primary w-full sm:w-auto">Try Free Tools</a>
        <a href="#how-it-works" class="btn btn-outline w-full sm:w-auto">See How It Works</a>
      </div>
      <p class="mt-3 text-sm opacity-70">No lock-in. Cancel anytime. 14-day free trial on paid tiers.</p>
    </div>

    <!-- Placeholder visual (keeps CLS low, responsive) -->
    <div class="w-full aspect-[16/10] rounded-2xl border bg-base-200 grid place-items-center">
      <div class="text-center px-4">
        <div class="text-sm opacity-70">Landing visual placeholder</div>
        <div class="text-xs opacity-60">Swap this for a carousel/screenshot later</div>
      </div>
    </div>
  </div>
</section>

<!-- PRODUCT PILLARS -->
<section class="px-4 md:px-6 lg:px-10 py-8 md:py-12 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Three products, one simple app</h2>
    <p class="mt-2 opacity-80 max-w-3xl">Start free with six “mint” tools. Upgrade to chat when you’re ready. Step up to the full AI Assistant for cited answers from real manuals and guides.</p>

    <!-- Grid of three cards -->
    <div class="mt-6 grid md:grid-cols-3 gap-4">
      <!-- Free Tools -->
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="card-title">Tradie Tools <span class="badge badge-success">Free</span></h3>
          <p class="opacity-80">Six quick tools with a few inputs → instant output. No AI headaches.</p>
          <ul class="mt-3 space-y-2 text-sm">
            <li>• Material & Cost Calculator</li>
            <li>• Job Estimation Wizard</li>
            <li>• Sales Proposal Generator</li>
            <li>• Review Responder</li>
            <li>• Social Post Generator</li>
            <li>• Email Template Generator</li>
          </ul>
          <div class="card-actions mt-4">
            <a href="/account/caption" class="btn btn-outline btn-sm">Open the Tools</a>
          </div>
        </div>
      </div>

      <!-- Pro Chat -->
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="card-title">Tradie Chat <span class="badge badge-info">Pro</span></h3>
          <p class="opacity-80">Talk to AI like a mate who gets your trade. Ask, plan, draft, and decide fast.</p>
          <ul class="mt-3 space-y-2 text-sm">
            <li>• Natural chat tuned for tradies</li>
            <li>• Great for Q&A, messages, and brainstorming</li>
            <li>• Pairs perfectly with the Free Tools</li>
          </ul>
          <div class="card-actions mt-4">
            <a href="/pricing" class="btn btn-outline btn-sm">Start 14-day Trial</a>
          </div>
        </div>
      </div>

      <!-- Premium Assistant -->
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="card-title">AI Assistant <span class="badge badge-primary">Premium</span></h3>
          <p class="opacity-80">Attach manuals or use our library. Get <em>cited</em> answers from real product guides, standards, and specs.</p>
          <ul class="mt-3 space-y-2 text-sm">
            <li>• Upload your PDFs + use our growing library</li>
            <li>• Answers with page citations</li>
            <li>• Built for trades, not techies</li>
          </ul>
          <div class="card-actions mt-4">
            <a href="/pricing" class="btn btn-primary btn-sm">Try Premium 14-days Free</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FREE TOOLS DETAILS -->
<section class="px-4 md:px-6 lg:px-10 py-10">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Six “mint” tools — simple inputs, tidy outputs</h2>
    <p class="mt-2 opacity-80 max-w-3xl">Deterministic where it matters, with optional AI polish. Built to save time and win work.</p>

    <div class="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Each tool card (keep copy tight; icons can be added later) -->
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">Material & Cost Calculator</h3>
          <p class="text-sm opacity-80">Price materials, add markup, and generate a clean costing summary.</p>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">Job Estimation Wizard</h3>
          <p class="text-sm opacity-80">Short brief in → client-ready quote out. Import materials from the calculator.</p>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">Sales Proposal Generator</h3>
          <p class="text-sm opacity-80">Long-form, persuasive proposals. Pair with Estimation for totals.</p>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">Review Responder</h3>
          <p class="text-sm opacity-80">Paste a review. Get an on-brand reply for Google, Facebook, Hipages, and more.</p>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">Social Post Generator</h3>
          <p class="text-sm opacity-80">Platform-savvy captions with an Aussie voice and soft CTA.</p>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">Email Template Generator</h3>
          <p class="text-sm opacity-80">Summarise the situation, get a tidy client-ready email.</p>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <a href="/account/caption" class="btn btn-outline">Use Free Tools</a>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section id="how-it-works" class="px-4 md:px-6 lg:px-10 py-10 bg-base-200">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">How it works</h2>
    <div class="mt-6 grid md:grid-cols-3 gap-4">
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">1) Pick a tool or open chat</h3>
          <p class="text-sm opacity-80">Start in the free tools, upgrade to chat when you’re ready, or jump to the AI Assistant for cited answers.</p>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">2) Type or upload</h3>
          <p class="text-sm opacity-80">Short briefs for tools, natural language for chat, and PDFs/manuals for the Assistant.</p>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">3) Get results</h3>
          <p class="text-sm opacity-80">Instant quotes, proposals, replies, or cited answers from real guides and standards.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- WHY US (vs generic AI) -->
<section class="px-4 md:px-6 lg:px-10 py-10">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Made for tradies — not generic AI</h2>
    <div class="mt-6 grid md:grid-cols-2 gap-6">
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">Why Tradie Assistant</h3>
          <ul class="text-sm space-y-2 opacity-90">
            <li>• Built for Aussie trades</li>
            <li>• Free tools with real value</li>
            <li>• Manuals library + citations in Premium</li>
            <li>• Straight-talking UI that’s easy to use</li>
          </ul>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="font-semibold">Why not generic AI</h3>
          <ul class="text-sm space-y-2 opacity-90">
            <li>• Too broad, misses trade context</li>
            <li>• No manuals or standards to cite</li>
            <li>• Outputs can be fluffy or off-topic</li>
            <li>• Slower to get job-ready results</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING TEASER (keeps canonical pricing page) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-200">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Simple pricing</h2>
    <p class="mt-2 opacity-80">Free forever for the tools. 14-day free trial on paid tiers.</p>

    <div class="mt-6 grid md:grid-cols-3 gap-4">
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="card-title">Free</h3>
          <p class="opacity-80 text-sm">All six tools</p>
          <a class="btn btn-outline btn-sm mt-4" href="/account/caption">Start Free</a>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="card-title">Pro (Chat)</h3>
          <p class="opacity-80 text-sm">Free tools + AI chat</p>
          <a class="btn btn-outline btn-sm mt-4" href="/pricing">Start 14-day Trial</a>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="card-title">Premium (Assistant)</h3>
          <p class="opacity-80 text-sm">Everything + manuals library & citations</p>
          <a class="btn btn-primary btn-sm mt-4" href="/pricing">Try Premium</a>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <a href="/pricing" class="link link-primary">See full pricing →</a>
    </div>
  </div>
</section>

<!-- FAQ (short; keep prose out of tables) -->
<section class="px-4 md:px-6 lg:px-10 py-10">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">FAQs</h2>
    <div class="mt-4 join join-vertical w-full">
      <div class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div class="collapse-title text-base md:text-lg font-medium">Do I need to be tech-savvy?</div>
        <div class="collapse-content text-sm opacity-90">No dramas. We keep it simple. Short forms in, tidy results out — with plain guidance on each screen.</div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div class="collapse-title text-base md:text-lg font-medium">What’s in the free plan?</div>
        <div class="collapse-content text-sm opacity-90">All six tools. Use them as much as you like.</div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div class="collapse-title text-base md:text-lg font-medium">What’s the difference between Chat and the AI Assistant?</div>
        <div class="collapse-content text-sm opacity-90">Chat is a general AI conversation tuned for tradies. The Assistant goes further — it reads manuals and standards (yours or ours) and cites the page it used.</div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div class="collapse-title text-base md:text-lg font-medium">Is there a trial?</div>
        <div class="collapse-content text-sm opacity-90">Yep. 14-day free trial on Pro and Premium. No lock-in.</div>
      </div>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-6xl mx-auto text-center">
    <h2 class="text-2xl md:text-3xl font-bold">Give it a go — your first 14 days are free</h2>
    <p class="opacity-80 mt-2">Start with the free tools, then upgrade when you're ready.</p>
    <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/account/caption" class="btn btn-primary">Use Free Tools</a>
      <a href="/pricing" class="btn btn-outline">See Pricing</a>
    </div>
    <p class="text-xs opacity-60 mt-6">&copy; {currentYear} Tradie Assistant</p>
  </div>
</section>
