<script lang="ts">
  const year = new Date().getFullYear();
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

<!-- HERO (keep) -->
<section class="relative overflow-hidden px-4 md:px-6 lg:px-10 pt-10 pb-14">
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

<!-- VALUE BAND (keep w/ small polish) -->
<section class="px-4 md:px-6 lg:px-10 py-8 bg-base-200">
  <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
    <div>
      <h3 class="text-xl font-bold">Work smarter, not longer</h3>
      <p class="opacity-80 mt-2">Cut the busywork. Quote and communicate without the late nights.</p>
    </div>
    <div>
      <h3 class="text-xl font-bold">Win more jobs</h3>
      <p class="opacity-80 mt-2">Professional proposals and faster replies help you stand out and close with confidence.</p>
    </div>
    <div>
      <h3 class="text-xl font-bold">Do better work</h3>
      <p class="opacity-80 mt-2">Check manuals and guides when it counts. Fewer mistakes. Happier clients.</p>
    </div>
  </div>
</section>

<!-- ONE JOB, THREE MOMENTS (simple stepper, clear story) -->
<section class="px-4 md:px-6 lg:px-10 py-12 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">One job. Three moments.</h2>
    <div class="mt-6 grid md:grid-cols-3 gap-6">
      <div class="rounded-2xl border bg-base-100 p-5">
        <div class="text-5xl font-extrabold text-primary/80">1</div>
        <h3 class="mt-2 font-semibold">Price</h3>
        <p class="text-sm opacity-80 mt-1">Use Smart Tools to turn materials and a short brief into a clean costing summary.</p>
        <div class="mt-3 aspect-[16/10] rounded-xl border bg-base-200 grid place-items-center text-xs opacity-70">
          Costing summary mock
        </div>
      </div>
      <div class="rounded-2xl border bg-base-100 p-5">
        <div class="text-5xl font-extrabold text-primary/80">2</div>
        <h3 class="mt-2 font-semibold">Communicate</h3>
        <p class="text-sm opacity-80 mt-1">Smart Chat drafts client messages, notes, and tips in plain English.</p>
        <div class="mt-3 rounded-xl border bg-base-100 p-3">
          <div class="chat chat-start"><div class="chat-bubble">Reschedule slab pour? Storm on Friday.</div></div>
          <div class="chat chat-end"><div class="chat-bubble">Delay in heavy rain. I’ll draft a friendly client update.</div></div>
        </div>
      </div>
      <div class="rounded-2xl border bg-base-100 p-5">
        <div class="text-5xl font-extrabold text-primary/80">3</div>
        <h3 class="mt-2 font-semibold">Confirm</h3>
        <p class="text-sm opacity-80 mt-1">Smart Assistant checks manuals and guides so you can proceed with confidence.</p>
        <div class="mt-3 rounded-xl border bg-base-100 p-3 text-sm">
          Quick answer, with a <span class="badge badge-ghost badge-sm">reference where possible</span>.
        </div>
      </div>
    </div>
  </div>
</section>

<!-- EVERYTHING IN ONE SPOT (alternating sections you liked) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Everything you need, all in one spot</h2>
    <p class="mt-2 opacity-80 max-w-3xl">From first quote to final review, every part of your trade day gets easier.</p>

    <!-- Smart Tools (text left, image right) -->
    <div class="mt-8 grid md:grid-cols-2 gap-8 items-start">
      <div>
        <h3 class="text-xl font-bold">Smart Tools</h3>
        <p class="opacity-80 mt-2">Six everyday helpers for quoting, proposals and comms.</p>
        <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
          <span class="badge badge-outline">Material & Cost Calculator</span>
          <span class="badge badge-outline">Job Estimation Wizard</span>
          <span class="badge badge-outline">Sales Proposal Generator</span>
          <span class="badge badge-outline">Review Responder</span>
          <span class="badge badge-outline">Social Post Generator</span>
          <span class="badge badge-outline">Email Template Generator</span>
        </div>
        <div class="mt-5">
          <a href="/account/caption" class="btn btn-outline btn-sm">Try it now</a>
        </div>
      </div>
      <div class="w-full aspect-[16/10] rounded-2xl border bg-base-200 grid place-items-center text-xs opacity-70">
        Tools panel mock
      </div>
    </div>

    <!-- Smart Chat (image left, text right) -->
    <div class="mt-12 grid md:grid-cols-2 gap-8 items-start">
      <div class="order-2 md:order-1 w-full aspect-[16/10] rounded-2xl border bg-base-200 grid place-items-center text-xs opacity-70">
        Chat transcript mock
      </div>
      <div class="order-1 md:order-2">
        <h3 class="text-xl font-bold">Smart Chat</h3>
        <p class="opacity-80 mt-2">Advice, safety notes, and clear client messages — fast.</p>
        <div class="mt-4 rounded-xl border bg-base-100 p-4">
          <div class="chat chat-start"><div class="chat-bubble">Storm Friday — postpone slab pour?</div></div>
          <div class="chat chat-end"><div class="chat-bubble">Yes if heavy rain. Re-check compaction/moisture. I can draft a client SMS.</div></div>
          <div class="chat chat-start"><div class="chat-bubble">Do it — friendly tone.</div></div>
          <div class="chat chat-end"><div class="chat-bubble">“Quick update: rain Friday. We’ll pour Monday to ensure quality. Thanks for understanding.”</div></div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2 text-xs">
          <span class="badge badge-ghost">Safety note</span>
          <span class="badge badge-ghost">Site checklist</span>
          <span class="badge badge-ghost">Client SMS</span>
          <span class="badge badge-ghost">Method steps</span>
          <span class="badge badge-ghost">Materials compatibility</span>
        </div>
        <div class="mt-5">
          <a href="/pricing" class="btn btn-outline btn-sm">Try it now</a>
        </div>
      </div>
    </div>

    <!-- Smart Assistant (text left, image right) -->
    <div class="mt-12 grid md:grid-cols-2 gap-8 items-start">
      <div>
        <h3 class="text-xl font-bold">Smart Assistant</h3>
        <p class="opacity-80 mt-2">
          Your on-site brain: a growing library of thousands of AU/NZ codes, manufacturer manuals, spec sheets, install guides, SDS, textbooks — plus your PDFs.
        </p>
        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          <span class="badge badge-ghost">AU/NZ codes</span>
          <span class="badge badge-ghost">Manufacturer manuals</span>
          <span class="badge badge-ghost">Spec sheets</span>
          <span class="badge badge-ghost">Install guides</span>
          <span class="badge badge-ghost">SDS</span>
          <span class="badge badge-ghost">Textbooks</span>
          <span class="badge badge-ghost">Your PDFs</span>
        </div>
        <!-- Technical sample outputs -->
        <div class="mt-4 rounded-xl border bg-base-100 p-4 text-sm space-y-3">
          <div>
            <div class="font-semibold">Example — Mitsubishi split system clearances</div>
            <p class="opacity-90 mt-1">
              MSZ-FS indoor: 50&nbsp;mm side, 100&nbsp;mm rear, 65&nbsp;mm ceiling. MUZ-FS outdoor: ≥400&nbsp;mm front, ≥1000&nbsp;mm above (model-specific).
            </p>
            <div class="mt-1 text-xs opacity-70 italic">References where possible: SRK-ZMP-S manual p.20; MUZ-FS install instructions pp.1–3, 11.</div>
          </div>
          <div>
            <div class="font-semibold">Example — Outdoor socket RCD</div>
            <p class="opacity-90 mt-1">
              30&nbsp;mA Type&nbsp;A RCD with max disconnection time per AS/NZS clause. Verify circuit length and fault loop impedance.
            </p>
            <div class="mt-1 text-xs opacity-70 italic">Reference where possible: AS/NZS&nbsp;3000:2018 relevant clause.</div>
          </div>
          <div>
            <div class="font-semibold">Example — HWS copper line sizing</div>
            <p class="opacity-90 mt-1">
              15&nbsp;mm typical for domestic runs; confirm fixture units and length against pressure/flow tables.
            </p>
            <div class="mt-1 text-xs opacity-70 italic">Reference where possible: Manufacturer spec / AU/NZ plumbing standard.</div>
          </div>
        </div>
        <div class="mt-5">
          <a href="/pricing" class="btn btn-primary btn-sm">Try it now</a>
        </div>
      </div>
      <div class="w-full aspect-[16/10] rounded-2xl border bg-base-200 grid place-items-center text-xs opacity-70">
        Assistant answer mock
      </div>
    </div>
  </div>
</section>

<!-- PERSONA STORY (single, clean) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Josh, sparkie — from quote to sign-off</h2>
    <div class="mt-4 grid md:grid-cols-3 gap-6 text-sm">
      <div class="rounded-xl border bg-base-100 p-4">
        <div class="font-semibold">Quote</div>
        <p class="opacity-80 mt-1">Smart Tools build a clean costing summary in minutes.</p>
      </div>
      <div class="rounded-xl border bg-base-100 p-4">
        <div class="font-semibold">Communicate</div>
        <p class="opacity-80 mt-1">Smart Chat drafts a clear follow-up and reminder SMS.</p>
      </div>
      <div class="rounded-xl border bg-base-100 p-4">
        <div class="font-semibold">Confirm</div>
        <p class="opacity-80 mt-1">Smart Assistant checks a spec so the work’s done right.</p>
      </div>
    </div>
  </div>
</section>

<!-- OUR MISSION (your original copy, brought back) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-200">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Built with tradies in mind</h2>
    <p class="mt-2 opacity-80 max-w-4xl">
      We’re a bunch of tech heads and tradie mates who built an AI that speaks your language.
      Born from a sparkie’s workshop and a few pub chats, our mission is simple: make your day smoother and your jobs sharper.
      Whether you’re up on a roof or down in a trench, we’ve got your back.
    </p>
  </div>
</section>

<!-- TESTIMONIALS (review cards, manual nav only) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">What tradies are saying</h2>

    <div class="carousel w-full mt-6 rounded-2xl border bg-base-100">
      <div id="rev1" class="carousel-item w-full p-6">
        <div class="grid md:grid-cols-3 gap-4 w-full">
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="rating rating-sm mb-2">
                <input type="radio" class="mask mask-star-2 bg-orange-400" checked />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
              </div>
              <p class="opacity-90">“Quoting used to chew up my nights. Now it’s sorted before dinner.”</p>
              <div class="text-xs opacity-70 mt-2">Jake • Electrician</div>
            </div>
          </div>
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="rating rating-sm mb-2">
                <input type="radio" class="mask mask-star-2 bg-orange-400" checked />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
              </div>
              <p class="opacity-90">“The proposal looked pro. Client signed the next day.”</p>
              <div class="text-xs opacity-70 mt-2">Mel • Plumber</div>
            </div>
          </div>
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="rating rating-sm mb-2">
                <input type="radio" class="mask mask-star-2 bg-orange-400" checked />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
              </div>
              <p class="opacity-90">“On-site answers from manuals — game changer.”</p>
              <div class="text-xs opacity-70 mt-2">Ari • HVAC</div>
            </div>
          </div>
        </div>
      </div>

      <div id="rev2" class="carousel-item w-full p-6">
        <div class="grid md:grid-cols-3 gap-4 w-full">
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="rating rating-sm mb-2">
                <input type="radio" class="mask mask-star-2 bg-orange-400" checked />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
              </div>
              <p class="opacity-90">“Stops me second-guessing specs. Faster, better jobs.”</p>
              <div class="text-xs opacity-70 mt-2">Sam • Carpenter</div>
            </div>
          </div>
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="rating rating-sm mb-2">
                <input type="radio" class="mask mask-star-2 bg-orange-400" checked />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
              </div>
              <p class="opacity-90">“Review replies in seconds — no more putting it off.”</p>
              <div class="text-xs opacity-70 mt-2">Kim • Painter</div>
            </div>
          </div>
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="rating rating-sm mb-2">
                <input type="radio" class="mask mask-star-2 bg-orange-400" checked />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
                <input type="radio" class="mask mask-star-2 bg-orange-400" />
              </div>
              <p class="opacity-90">“Proposals that actually win work.”</p>
              <div class="text-xs opacity-70 mt-2">Leo • Plumber</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- manual nav only -->
    <div class="flex gap-2 justify-center mt-3 text-sm opacity-70">
      <a href="#rev1" class="btn btn-xs">1</a>
      <a href="#rev2" class="btn btn-xs">2</a>
    </div>
  </div>
</section>

<!-- PRICING TEASER (no new cards; link to /pricing for consistency) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-200">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Pricing</h2>
    <p class="mt-2 opacity-80">See plans and full details on our pricing page.</p>
    <div class="mt-6">
      <a href="/pricing" class="btn btn-primary">View Pricing</a>
    </div>
  </div>
</section>

<!-- FAQ (restored) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">FAQs</h2>
    <div class="mt-4 join join-vertical w-full">
      <div class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div class="collapse-title text-base md:text-lg font-medium">How does the AI understand my questions?</div>
        <div class="collapse-content text-sm opacity-90">It’s tuned for trade language and job types, so you can talk like a tradie and still get clear, useful answers.</div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div class="collapse-title text-base md:text-lg font-medium">Do you protect my data and privacy?</div>
        <div class="collapse-content text-sm opacity-90">Yes. Your inputs stay private. We don’t sell your data. Where possible, answers include references so you can see what it used.</div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div class="collapse-title text-base md:text-lg font-medium">Can I use it on multiple devices?</div>
        <div class="collapse-content text-sm opacity-90">Yes. Use it on phone, tablet or laptop. Everything stays in sync.</div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div class="collapse-title text-base md:text-lg font-medium">Can I cancel anytime?</div>
        <div class="collapse-content text-sm opacity-90">Always. No contracts. Use the free tools whenever you like.</div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div class="collapse-title text-base md:text-lg font-medium">Do answers include citations?</div>
        <div class="collapse-content text-sm opacity-90">Where possible, yes — we include a reference so you can check the source.</div>
      </div>
    </div>
  </div>
</section>

<!-- FINAL CTA (full-bleed, no border, no ©) -->
<section class="px-4 md:px-6 lg:px-10 py-12">
  <div class="max-w-6xl mx-auto text-center">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Ready to get your time back?</h2>
    <p class="opacity-80 mt-2">Start with the free tools. Add Chat or the Assistant when you’re ready.</p>
    <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/account/caption" class="btn btn-primary">Get Started Free</a>
      <a href="/pricing" class="btn btn-outline">View Pricing</a>
    </div>
  </div>
</section>
