<script lang="ts">
  const year = new Date().getFullYear();
</script>

<svelte:head>
  <title>Tradie Assistant — Quote faster, sell better, work smarter</title>
  <meta name="description" content="Tradie Assistant helps tradies price jobs, write proposals, reply to reviews and get solid answers from manuals. Built for trades. Free tools included." />
  <link rel="canonical" href="https://sveltekit-saas-starter-beta-eight.vercel.app/" />
  <meta property="og:title" content="Tradie Assistant — AI that speaks tradie" />
  <meta property="og:description" content="Price jobs in minutes, send pro proposals, reply to reviews, and find answers in manuals. Simple and job-ready." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://sveltekit-saas-starter-beta-eight.vercel.app/og-tradie-assistant.jpg" />
  <meta name="twitter:card" content="summary_large_image" />

  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"Organization",
    "name":"Tradie Assistant",
    "url":"https://sveltekit-saas-starter-beta-eight.vercel.app/",
    "description":"AI toolkit for tradies. Quotes, proposals, reviews, and manuals-aware answers.",
    "logo":"https://sveltekit-saas-starter-beta-eight.vercel.app/logo.png"
  }
  </script>
</svelte:head>

<!-- HERO -->
<section class="px-4 md:px-6 lg:px-10 pt-8 pb-10 md:pb-14">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
    <div>
      <h1 class="text-3xl md:text-5xl font-extrabold leading-tight">
        Tradie Assistant: smarter jobs, smoother clients, better days
      </h1>
      <p class="mt-4 text-base md:text-lg opacity-90">
        Quote quicker, send tidy proposals, reply to reviews, and get straight answers from manuals.
        Built for tradies who want less admin and more time on the tools.
      </p>
      <div class="mt-6">
        <a href="/account/caption" class="btn btn-primary">Get Started Free</a>
      </div>
      <p class="mt-3 text-xs opacity-70">Free tools included. Trials available for paid features. No lock-in.</p>
    </div>

    <!-- Large visual placeholder -->
    <div class="w-full aspect-[16/10] rounded-2xl border bg-base-200 grid place-items-center">
      <div class="text-center px-4">
        <div class="text-sm opacity-80">Screenshot carousel placeholder</div>
        <div class="text-xs opacity-60">Swap in app screenshots later</div>
      </div>
    </div>
  </div>
</section>

<!-- VALUE STRIP -->
<section class="px-4 md:px-6 lg:px-10 py-8 bg-base-200">
  <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
    <div>
      <h3 class="text-xl font-bold">Work smarter, not longer</h3>
      <p class="opacity-80 mt-2">Less admin and back-and-forth. Keep jobs moving without late-night paperwork.</p>
    </div>
    <div>
      <h3 class="text-xl font-bold">Win more jobs</h3>
      <p class="opacity-80 mt-2">Professional proposals and fast replies help you stand out and close with confidence.</p>
    </div>
    <div>
      <h3 class="text-xl font-bold">Do better work</h3>
      <p class="opacity-80 mt-2">Check manuals and guides when it counts. Fewer mistakes. Happier clients. Stronger reputation.</p>
    </div>
  </div>
</section>

<!-- SHOW, DON'T TELL: four visual strips with example content -->
<section class="px-4 md:px-6 lg:px-10 py-10">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
    <!-- Costing Summary -->
    <div class="rounded-2xl border bg-base-100 p-5">
      <div class="aspect-[16/10] rounded-xl border bg-base-200 grid place-items-center mb-4">
        <span class="text-xs opacity-70">Costing Summary preview placeholder</span>
      </div>
      <h4 class="font-semibold">Price a job in minutes</h4>
      <p class="text-sm opacity-80 mt-1">Enter materials, add markup, and generate a clean costing summary you can send.</p>
      <div class="mt-3 text-xs bg-base-200 rounded-lg p-3">
        <strong>Example:</strong> “Decking — 18m² Merbau” → Materials $1,280, Labour $1,050, Markup 15%, Total $2,678 inc GST.
      </div>
    </div>

    <!-- Quote to PDF -->
    <div class="rounded-2xl border bg-base-100 p-5">
      <div class="aspect-[16/10] rounded-xl border bg-base-200 grid place-items-center mb-4">
        <span class="text-xs opacity-70">Quote → PDF preview placeholder</span>
      </div>
      <h4 class="font-semibold">Turn prices into proposals</h4>
      <p class="text-sm opacity-80 mt-1">Create a client-ready quote or a long-form proposal with scope and assumptions.</p>
      <div class="mt-3 text-xs bg-base-200 rounded-lg p-3">
        <strong>Example:</strong> “Bathroom reno” → Overview, Scope, Exclusions, Timeline, Payment Terms, Cost Summary.
      </div>
    </div>

    <!-- Review Reply -->
    <div class="rounded-2xl border bg-base-100 p-5">
      <div class="aspect-[16/10] rounded-xl border bg-base-200 grid place-items-center mb-4">
        <span class="text-xs opacity-70">Review reply preview placeholder</span>
      </div>
      <h4 class="font-semibold">Reply to reviews in your voice</h4>
      <p class="text-sm opacity-80 mt-1">Paste a review and get an on-brand response for Google, Facebook, Hipages and more.</p>
      <div class="mt-3 text-xs bg-base-200 rounded-lg p-3">
        <strong>Example reply:</strong> “Thanks heaps for the kind words, Sarah. Glad the switchboard upgrade is running sweet. Shout if you need anything else.”
      </div>
    </div>

    <!-- Manual answer (with “where possible” cite) -->
    <div class="rounded-2xl border bg-base-100 p-5">
      <div class="aspect-[16/10] rounded-xl border bg-base-200 grid place-items-center mb-4">
        <span class="text-xs opacity-70">Manual answer with reference pill placeholder</span>
      </div>
      <h4 class="font-semibold">Answers from manuals when it matters</h4>
      <p class="text-sm opacity-80 mt-1">Use our library or attach your PDFs and get job-ready info. Where possible, we include references so you can check the source.</p>
      <div class="mt-3 text-xs bg-base-200 rounded-lg p-3">
        <strong>Example:</strong> “Anchor embed for M12 in 25MPa concrete?” → 90–100&nbsp;mm minimum edge distance. <em>Reference included where possible.</em>
      </div>
    </div>
  </div>
</section>

<!-- EVERYTHING IN ONE SPOT: Narrative with real trades -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Everything you need, all in one spot</h2>
    <p class="mt-2 opacity-80 max-w-3xl">From first quote to final review, every part of your trade day gets easier.</p>

    <!-- 1. Smart Tools -->
    <div class="mt-8 grid md:grid-cols-2 gap-8 items-start">
      <div>
        <h3 class="text-xl font-bold">Smart Tools</h3>
        <p class="opacity-80 mt-2">Six everyday helpers for quoting, proposals and comms.</p>
        <ul class="mt-4 space-y-2 text-sm opacity-90">
          <li>• Material & Cost Calculator — price materials, add markup, create a clean costing summary.</li>
          <li>• Job Estimation Wizard — short brief in, client-ready quote out. Import materials in seconds.</li>
          <li>• Sales Proposal Generator — long-form proposals that sell your value.</li>
          <li>• Review Responder — quick, friendly replies for Google, Facebook, Hipages and more.</li>
          <li>• Social Post Generator — platform-aware captions with a soft call to action.</li>
          <li>• Email Template Generator — tidy client emails from a short summary.</li>
        </ul>
        <div class="mt-5">
          <a href="/account/caption" class="btn btn-outline btn-sm">Try it now</a>
        </div>
      </div>
      <div class="w-full aspect-[16/10] rounded-2xl border bg-base-200 grid place-items-center">
        <span class="text-xs opacity-70">Tools panel mock placeholder</span>
      </div>
    </div>

    <!-- 2. Smart Chat: example dialogue (advice/tips) -->
    <div class="mt-12 grid md:grid-cols-2 gap-8 items-start">
      <div class="order-2 md:order-1 w-full rounded-2xl border bg-base-100 p-4">
        <!-- DaisyUI chat example -->
        <div class="chat chat-start">
          <div class="chat-bubble">I’ve got a deck on a coastal job. Any tips on fixings and sealing?</div>
        </div>
        <div class="chat chat-end">
          <div class="chat-bubble">Go stainless or hot-dip galvanised fixings. Use a water-based acrylic sealer rated for marine environments. Prep: clean, dry boards; apply thin coats. I can draft a short client note if you like.</div>
        </div>
        <div class="chat chat-start">
          <div class="chat-bubble">Nice. Also need a polite reminder message for tomorrow’s 8am access.</div>
        </div>
        <div class="chat chat-end">
          <div class="chat-bubble">No worries — here’s a friendly SMS you can send: “Hey Jake, quick reminder we’re onsite at 8am tomorrow. Gate access ok? Cheers.”</div>
        </div>
      </div>
      <div class="order-1 md:order-2">
        <h3 class="text-xl font-bold">Smart Chat</h3>
        <p class="opacity-80 mt-2">Ask for advice, tips and quick guidance in plain English. Great for planning, client comms, and on-the-spot answers.</p>
        <ul class="mt-4 space-y-2 text-sm opacity-90">
          <li>• Material choices, sequences, prep steps and safety reminders.</li>
          <li>• Draft messages or notes without staring at a blank screen.</li>
          <li>• Troubleshooting ideas before you dig through manuals.</li>
        </ul>
        <div class="mt-5">
          <a href="/pricing" class="btn btn-outline btn-sm">Try it now</a>
        </div>
      </div>
    </div>

    <!-- 3. Smart Assistant: doc types + example -->
    <div class="mt-12 grid md:grid-cols-2 gap-8 items-start">
      <div>
        <h3 class="text-xl font-bold">Smart Assistant</h3>
        <p class="opacity-80 mt-2">Your knowledge engine. Searches a growing library of thousands of documents so you don’t have to.</p>
        <ul class="mt-4 space-y-2 text-sm opacity-90">
          <li>• AU/NZ codes and standards</li>
          <li>• Product manuals — air-cons, pumps, fixtures, switchgear</li>
          <li>• Wiring guides, install guides, spec sheets</li>
          <li>• Safety data sheets and manufacturer instructions</li>
          <li>• Trade textbooks and troubleshooting guides</li>
          <li>• Your own PDFs and job docs</li>
        </ul>
        <p class="text-sm opacity-80 mt-3">Ask for specifics and get job-ready info in seconds. Where possible, we include references so you can check the source.</p>
        <div class="mt-5">
          <a href="/pricing" class="btn btn-primary btn-sm">Try it now</a>
        </div>
      </div>
      <div class="w-full rounded-2xl border bg-base-100 p-4">
        <!-- Assistant example answer block -->
        <div class="text-sm">
          <div class="font-semibold">Example: Split-system air-con clearances</div>
          <p class="opacity-80 mt-1">Outdoor unit needs unobstructed airflow. Typical minimum: 300&nbsp;mm rear, 600&nbsp;mm front. Avoid direct recirculation. Check model-specific requirements.</p>
          <div class="mt-2 text-xs opacity-70 italic">Reference included where possible.</div>
          <hr class="my-3" />
          <div class="font-semibold">Example: Copper pipe sizing for a hot water service</div>
          <p class="opacity-80 mt-1">For a standard domestic HWS, 15&nbsp;mm line is common, but confirm total fixture units and run length. Use pressure/flow tables from the relevant standard or manufacturer.</p>
          <div class="mt-2 text-xs opacity-70 italic">Reference included where possible.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- QUICK CALL-OUT: Trades we support -->
<section class="px-4 md:px-6 lg:px-10 py-8 bg-base-200">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-xl font-bold">For every trade</h3>
    <p class="opacity-80 mt-2">Electricians, plumbers, HVAC, carpenters, roofers, tilers, painters, landscapers, appliance repair, civil, handyman — if you’re on the tools, this is for you.</p>
  </div>
</section>

<!-- BUILT WITH TRADIES IN MIND (replaces "Why it works", no team CTA) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Built with tradies in mind</h2>
    <p class="mt-2 opacity-80 max-w-3xl">
      We designed every screen to be simple and job-ready. Clear steps. Plain language. Outputs you can send as-is. No fluff, no jargon, just tools that help you get the job done right.
    </p>
  </div>
</section>

<!-- CUSTOMER REVIEWS: Carousel placeholder -->
<section class="px-4 md:px-6 lg:px-10 py-10">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">What tradies are saying</h2>
    <div class="carousel w-full mt-6 rounded-2xl border bg-base-100">
      <div id="slide1" class="carousel-item w-full p-6">
        <div>
          <div class="rating rating-sm mb-2">
            <input type="radio" name="r1" class="mask mask-star-2 bg-orange-400" checked />
            <input type="radio" name="r1" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="r1" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="r1" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="r1" class="mask mask-star-2 bg-orange-400" />
          </div>
          <p class="opacity-90">“Quoting used to take me all night. Now it’s sorted before dinner.” — Jake, Electrician</p>
        </div>
      </div>
      <div id="slide2" class="carousel-item w-full p-6">
        <div>
          <div class="rating rating-sm mb-2">
            <input type="radio" name="r2" class="mask mask-star-2 bg-orange-400" checked />
            <input type="radio" name="r2" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="r2" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="r2" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="r2" class="mask mask-star-2 bg-orange-400" />
          </div>
          <p class="opacity-90">“The proposal looked pro. Client signed the next day.” — Mel, Plumber</p>
        </div>
      </div>
      <div id="slide3" class="carousel-item w-full p-6">
        <div>
          <div class="rating rating-sm mb-2">
            <input type="radio" name="r3" class="mask mask-star-2 bg-orange-400" checked />
            <input type="radio" name="r3" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="r3" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="r3" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" name="r3" class="mask mask-star-2 bg-orange-400" />
          </div>
          <p class="opacity-90">“Answers from manuals on the job. That’s a game changer.” — Ari, HVAC</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 justify-center mt-3 text-sm opacity-70">
      <a href="#slide1" class="link">1</a>
      <a href="#slide2" class="link">2</a>
      <a href="#slide3" class="link">3</a>
    </div>
  </div>
</section>

<!-- PRICING TEASER (keeps canonical pricing page) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-200">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Simple pricing</h2>
    <p class="mt-2 opacity-80">Free tools forever. Add chat or the manuals assistant when you’re ready.</p>

    <div class="mt-6 grid md:grid-cols-3 gap-4">
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="card-title">Free</h3>
          <p class="opacity-80 text-sm">All six tools</p>
          <a class="btn btn-outline btn-sm mt-4" href="/account/caption">Get Started Free</a>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="card-title">Chat</h3>
          <p class="opacity-80 text-sm">Advice and tips in plain English</p>
          <a class="btn btn-outline btn-sm mt-4" href="/pricing">Try it now</a>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="card-title">Assistant</h3>
          <p class="opacity-80 text-sm">Search manuals and guides. References where possible.</p>
          <a class="btn btn-primary btn-sm mt-4" href="/pricing">Try it now</a>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <a href="/pricing" class="link link-primary">View full pricing →</a>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-6xl mx-auto text-center">
    <h2 class="text-2xl md:text-3xl font-bold">Ready to get your time back?</h2>
    <p class="opacity-80 mt-2">Start with the free tools. Add chat or the manuals assistant when you’re ready.</p>
    <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/account/caption" class="btn btn-primary">Get Started Free</a>
      <a href="/pricing" class="btn btn-outline">View Pricing</a>
    </div>
    <p class="text-xs opacity-60 mt-6">&copy; {year} Tradie Assistant</p>
  </div>
</section>
