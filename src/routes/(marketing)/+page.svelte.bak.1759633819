<script lang="ts">
  import { onMount } from 'svelte';
  const year = new Date().getFullYear();

  // simple auto-rotate for testimonials
  let slide = 0;
  let slides = ['#rev1', '#rev2', '#rev3'];
  onMount(() => {
    const id = setInterval(() => {
      slide = (slide + 1) % slides.length;
      const el = document.querySelector<HTMLAnchorElement>(`.rev-nav a[href="${slides[slide]}"]`);
      el?.click();
    }, 4000);
    return () => clearInterval(id);
  });
</script>

<svelte:head>
  <title>Tradie Assistant — Quote faster, win more jobs, get home on time</title>
  <meta name="description" content="AI built for tradies. Price jobs, send proposals, reply to reviews, and get straight answers from manuals. Free tools included." />
  <link rel="canonical" href="https://sveltekit-saas-starter-beta-eight.vercel.app/" />
  <meta property="og:title" content="Tradie Assistant — AI that speaks tradie" />
  <meta property="og:description" content="From quotes to manuals, everything you need in one spot. Simple, fast, job-ready." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- HERO -->
<section class="relative overflow-hidden px-4 md:px-6 lg:px-10 pt-10 pb-14">
  <!-- glow bg -->
  <div class="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[480px] w-[800px] rounded-full blur-3xl opacity-30"
       style="background: radial-gradient(40% 40% at 50% 50%, hsl(var(--p)) 0%, transparent 70%);"></div>

  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center relative">
    <div>
      <h1 class="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
        <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tradie Assistant</span>
        <span class="block mt-2">Smarter jobs. Smoother clients. Better days.</span>
      </h1>
      <p class="mt-4 text-base md:text-lg opacity-90">
        Quote quicker, send tidy proposals, reply to reviews, and get straight answers from manuals. Less admin. More time on the tools.
      </p>
      <div class="mt-6">
        <a href="/account/caption" class="btn btn-primary">Get Started Free</a>
      </div>
      <p class="mt-3 text-xs opacity-70">Free tools included. Trials for paid features. No lock-in.</p>
    </div>

    <!-- visual -->
    <div class="grid gap-4">
      <div class="mockup-window border bg-base-100">
        <div class="px-4 py-6 bg-base-200 h-40 grid place-items-center text-xs opacity-70">App screenshot placeholder</div>
      </div>
      <div class="mockup-phone">
        <div class="camera"></div>
        <div class="display">
          <div class="artboard phone-1 grid place-items-center text-xs opacity-70">Mobile screenshot placeholder</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TRADES MARQUEE -->
<section class="bg-base-200 py-3">
  <div class="overflow-hidden">
    <div class="whitespace-nowrap animate-[scroll_22s_linear_infinite] text-sm opacity-80">
      <span class="mx-6">Electricians</span>
      <span class="mx-6">Plumbers</span>
      <span class="mx-6">HVAC</span>
      <span class="mx-6">Carpenters</span>
      <span class="mx-6">Roofers</span>
      <span class="mx-6">Tilers</span>
      <span class="mx-6">Painters</span>
      <span class="mx-6">Landscapers</span>
      <span class="mx-6">Appliance Repair</span>
      <span class="mx-6">Civil</span>
      <span class="mx-6">Handyman</span>
      <span class="mx-6">Apprentices & Teams</span>
    </div>
  </div>
</section>
<style>
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>

<!-- STORY SCROLLER (SHOW, DON'T TELL) -->
<section class="px-4 md:px-6 lg:px-10 py-12">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">How tradies actually use it</h2>
    <div class="mt-6 overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4">
      <!-- Josh -->
      <article class="min-w-[88%] md:min-w-[48%] lg:min-w-[42%] snap-center rounded-2xl border bg-base-100 p-5">
        <header class="flex items-center gap-2">
          <span class="badge badge-primary">Josh • Electrician</span>
        </header>
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <!-- Tools visual -->
          <div class="rounded-xl border bg-base-200 p-4">
            <div class="text-xs opacity-70">Smart Tools</div>
            <div class="mt-2 text-sm font-semibold">Quote a deck in minutes</div>
            <div class="mt-2 text-xs opacity-80">Clean costing summary → ready to send.</div>
          </div>
          <!-- Chat visual -->
          <div class="rounded-xl border bg-base-100 p-4">
            <div class="text-xs opacity-70">Smart Chat</div>
            <div class="chat chat-start mt-2"><div class="chat-bubble">Coastal deck — fixings?</div></div>
            <div class="chat chat-end"><div class="chat-bubble">Go stainless or hot-dip gal. Water-based acrylic sealer. Want a client note?</div></div>
          </div>
        </div>
        <!-- Assistant -->
        <div class="rounded-xl border bg-base-100 p-4 mt-4">
          <div class="text-xs opacity-70">Smart Assistant</div>
          <div class="mt-2 text-sm font-semibold">Torque spec for M12 anchors</div>
          <div class="mt-1 text-xs opacity-80">Ask once → get the number in seconds. <span class="badge badge-ghost badge-sm">Reference where possible</span></div>
        </div>
        <footer class="mt-3 text-xs opacity-70">Result: job won, no late-night admin.</footer>
      </article>

      <!-- Sarah -->
      <article class="min-w-[88%] md:min-w-[48%] lg:min-w-[42%] snap-center rounded-2xl border bg-base-100 p-5">
        <header class="flex items-center gap-2">
          <span class="badge badge-secondary">Sarah • Plumber</span>
        </header>
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="rounded-xl border bg-base-200 p-4">
            <div class="text-xs opacity-70">Smart Tools</div>
            <div class="mt-2 text-sm font-semibold">Bathroom reno → proposal</div>
            <div class="mt-1 text-xs opacity-80">Overview, scope, exclusions, timeline, costs.</div>
          </div>
          <div class="rounded-xl border bg-base-100 p-4">
            <div class="text-xs opacity-70">Smart Chat</div>
            <div class="chat chat-start mt-2"><div class="chat-bubble">Need a polite 8am access SMS</div></div>
            <div class="chat chat-end"><div class="chat-bubble">“Hey Jake, quick reminder we’re onsite 8am tomorrow. Gate access ok? Cheers.”</div></div>
          </div>
        </div>
        <div class="rounded-xl border bg-base-100 p-4 mt-4">
          <div class="text-xs opacity-70">Smart Assistant</div>
          <div class="mt-2 text-sm font-semibold">Check AU/NZ water-pressure tables</div>
          <div class="mt-1 text-xs opacity-80">On site → quick confirmation. <span class="badge badge-ghost badge-sm">Reference where possible</span></div>
        </div>
        <footer class="mt-3 text-xs opacity-70">Result: deal closed faster, apprentice mentored.</footer>
      </article>

      <!-- Tony -->
      <article class="min-w-[88%] md:min-w-[48%] lg:min-w-[42%] snap-center rounded-2xl border bg-base-100 p-5">
        <header class="flex items-center gap-2">
          <span class="badge badge-accent">Tony • HVAC</span>
        </header>
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="rounded-xl border bg-base-200 p-4">
            <div class="text-xs opacity-70">Smart Tools</div>
            <div class="mt-2 text-sm font-semibold">Fast price + client email</div>
            <div class="mt-1 text-xs opacity-80">No spreadsheet dramas.</div>
          </div>
          <div class="rounded-xl border bg-base-100 p-4">
            <div class="text-xs opacity-70">Smart Chat</div>
            <div class="chat chat-start mt-2"><div class="chat-bubble">FB caption for service packages?</div></div>
            <div class="chat chat-end"><div class="chat-bubble">3 short caption ideas with a soft CTA.</div></div>
          </div>
        </div>
        <div class="rounded-xl border bg-base-100 p-4 mt-4">
          <div class="text-xs opacity-70">Smart Assistant</div>
          <div class="mt-2 text-sm font-semibold">Outdoor unit clearances (model-specific)</div>
          <div class="mt-1 text-xs opacity-80">Answer first, source when possible. <span class="badge badge-ghost badge-sm">Reference where possible</span></div>
        </div>
        <footer class="mt-3 text-xs opacity-70">Result: fewer callbacks, smoother day.</footer>
      </article>
    </div>
  </div>
</section>

<!-- TOOL TILES (tight, not listy) -->
<section class="px-4 md:px-6 lg:px-10 py-8 bg-base-200">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Your everyday toolkit</h2>
    <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="card bg-base-100 border"><div class="card-body"><h3 class="font-semibold">Material & Cost Calculator</h3><p class="text-sm opacity-80">Price jobs fast with markup.</p></div></div>
      <div class="card bg-base-100 border"><div class="card-body"><h3 class="font-semibold">Job Estimation Wizard</h3><p class="text-sm opacity-80">Brief in → quote out.</p></div></div>
      <div class="card bg-base-100 border"><div class="card-body"><h3 class="font-semibold">Sales Proposal Generator</h3><p class="text-sm opacity-80">Pro docs that win work.</p></div></div>
      <div class="card bg-base-100 border"><div class="card-body"><h3 class="font-semibold">Review Responder</h3><p class="text-sm opacity-80">On-brand replies in seconds.</p></div></div>
      <div class="card bg-base-100 border"><div class="card-body"><h3 class="font-semibold">Social Post Generator</h3><p class="text-sm opacity-80">Aussie-friendly captions.</p></div></div>
      <div class="card bg-base-100 border"><div class="card-body"><h3 class="font-semibold">Email Template Generator</h3><p class="text-sm opacity-80">Tidy client emails.</p></div></div>
    </div>
    <div class="mt-6">
      <a href="/account/caption" class="btn btn-outline">Get Started Free</a>
    </div>
  </div>
</section>

<!-- CHAT + ASSISTANT MOCKS -->
<section class="px-4 md:px-6 lg:px-10 py-12">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
    <!-- Chat -->
    <div class="rounded-2xl border bg-base-100 p-5">
      <h3 class="text-xl font-bold">Smart Chat</h3>
      <p class="opacity-80 mt-1 text-sm">Advice, tips and quick guidance in plain English.</p>
      <div class="mt-4">
        <div class="chat chat-start"><div class="chat-bubble">Storm on Friday — postpone slab pour?</div></div>
        <div class="chat chat-end"><div class="chat-bubble">Delay if heavy rain expected. Re-check compaction/moisture. I can draft a client SMS.</div></div>
        <div class="chat chat-start"><div class="chat-bubble">Do it — SMS please</div></div>
        <div class="chat chat-end"><div class="chat-bubble">“Quick update: rain forecast Friday. We’ll shift the slab pour to Monday to ensure quality. Thanks for understanding.”</div></div>
      </div>
      <div class="mt-4"><a href="/pricing" class="btn btn-outline btn-sm">Try it now</a></div>
    </div>

    <!-- Assistant -->
    <div class="rounded-2xl border bg-base-100 p-5">
      <h3 class="text-xl font-bold">Smart Assistant</h3>
      <p class="opacity-80 mt-1 text-sm">Search thousands of docs so you don’t have to.</p>
      <div class="mt-3 flex flex-wrap gap-2 text-xs">
        <span class="badge badge-ghost">AU/NZ codes</span>
        <span class="badge badge-ghost">Manufacturer manuals</span>
        <span class="badge badge-ghost">Spec sheets</span>
        <span class="badge badge-ghost">Install guides</span>
        <span class="badge badge-ghost">SDS</span>
        <span class="badge badge-ghost">Textbooks</span>
        <span class="badge badge-ghost">Your PDFs</span>
      </div>
      <div class="mt-4 rounded-xl border bg-base-200 p-4">
        <div class="text-sm font-semibold">Q: Minimum clearance for gas HWS flue near a window?</div>
        <div class="mt-2 text-sm">A: Maintain the manufacturer’s minimum horizontal/vertical distances. Model-specific values apply. <span class="badge badge-ghost badge-sm">Reference where possible</span></div>
      </div>
      <div class="mt-4"><a href="/pricing" class="btn btn-primary btn-sm">Try it now</a></div>
    </div>
  </div>
</section>

<!-- REVIEWS (auto-rotating carousel) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-200">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">What tradies are saying</h2>

    <div class="carousel w-full mt-6 rounded-2xl border bg-base-100">
      <div id="rev1" class="carousel-item w-full p-8">
        <div class="max-w-3xl mx-auto">
          <div class="rating rating-sm mb-3">
            <input type="radio" class="mask mask-star-2 bg-orange-400" checked />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
          </div>
          <p class="text-lg leading-relaxed">“Quoting used to chew up my nights. Now it’s sorted before dinner.” — Jake, Electrician</p>
        </div>
      </div>
      <div id="rev2" class="carousel-item w-full p-8">
        <div class="max-w-3xl mx-auto">
          <div class="rating rating-sm mb-3">
            <input type="radio" class="mask mask-star-2 bg-orange-400" checked />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
          </div>
          <p class="text-lg leading-relaxed">“The proposal looked pro. Client signed the next day.” — Mel, Plumber</p>
        </div>
      </div>
      <div id="rev3" class="carousel-item w-full p-8">
        <div class="max-w-3xl mx-auto">
          <div class="rating rating-sm mb-3">
            <input type="radio" class="mask mask-star-2 bg-orange-400" checked />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
            <input type="radio" class="mask mask-star-2 bg-orange-400" />
          </div>
          <p class="text-lg leading-relaxed">“On-site answers from manuals — game changer.” — Ari, HVAC</p>
        </div>
      </div>
    </div>
    <div class="rev-nav flex gap-2 justify-center mt-3 text-sm opacity-70">
      <a href="#rev1" class="link">1</a>
      <a href="#rev2" class="link">2</a>
      <a href="#rev3" class="link">3</a>
    </div>
  </div>
</section>

<!-- PRICING TEASER (aligned to /pricing) -->
<section class="px-4 md:px-6 lg:px-10 py-10">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Simple pricing</h2>
    <p class="mt-2 opacity-80">Free tools forever. Add Chat or the Assistant when you’re ready.</p>

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
          <p class="opacity-80 text-sm">Advice & tips in plain English</p>
          <a class="btn btn-outline btn-sm mt-4" href="/pricing">Try it now</a>
        </div>
      </div>
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h3 class="card-title">Assistant</h3>
          <p class="opacity-80 text-sm">Search manuals & guides (refs where possible)</p>
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
<section class="px-4 md:px-6 lg:px-10 pb-12">
  <div class="max-w-6xl mx-auto text-center rounded-2xl border bg-base-100 p-8">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Ready to get your time back?</h2>
    <p class="opacity-80 mt-2">Start with the free tools. Add Chat or the Assistant when you’re ready.</p>
    <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/account/caption" class="btn btn-primary">Get Started Free</a>
      <a href="/pricing" class="btn btn-outline">View Pricing</a>
    </div>
    <p class="text-xs opacity-60 mt-6">&copy; {year} Tradie Assistant</p>
  </div>
</section>
