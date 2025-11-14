<script lang="ts">
  import { browser } from '$app/environment';

  type InstallGuide = {
    platform: string;
    steps: string[];
    extra?: string;
  };

  const installGuides: InstallGuide[] = [
    {
      platform: 'iPhone (Safari)',
      steps: [
        'Open this site in Safari.',
        'Tap the Share icon (square with an up arrow).',
        'Choose “Add to Home Screen” and hit Add.'
      ],
      extra: 'Looks and launches like an app — no App Store needed.'
    },
    {
      platform: 'Android (Chrome)',
      steps: [
        'Open this site in Chrome.',
        'Tap the ⋮ menu in the top-right corner.',
        'Select “Add to Home screen” then tap Add.'
      ],
      extra: 'If Chrome shows an Install banner, tap it and confirm.'
    }
  ];

  let detectedPlatform: string | null = null;
  if (browser) {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      detectedPlatform = 'iPhone (Safari)';
    } else if (/android/.test(userAgent)) {
      detectedPlatform = 'Android (Chrome)';
    }
  }
</script>

<svelte:head>
  <title>Tradie Assistant — your AI mate for jobs, clients, and the hard bits</title>
  <meta
    name="description"
    content="Quote quicker, fire off pro proposals, handle reviews in seconds, and grab specific answers from manuals. Less admin. More tools time. Easy as."
  />
  <link rel="canonical" href="https://sveltekit-saas-starter-beta-eight.vercel.app/" />
  <meta property="og:title" content="Tradie Assistant — your AI mate for jobs, clients, and the hard bits" />
  <meta
    property="og:description"
    content="Quote quicker, fire off pro proposals, handle reviews in seconds, and grab specific answers from manuals. Less admin. More tools time. Easy as."
  />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="bg-slate-950 text-slate-50">
  <!-- HERO -->
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-70"
      style="background: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.18), transparent 45%),
        radial-gradient(circle at 80% 0%, rgba(251, 191, 36, 0.35), transparent 55%),
        radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.2), transparent 60%);"
    ></div>
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div class="space-y-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-amber-200">
            Built for AU/NZ tradies
          </div>
          <h1 class="text-4xl md:text-5xl font-bold leading-tight">
            <span class="text-white">Tradie Assistant</span>
            <span class="block text-amber-200/90">your AI mate for jobs, clients, and the hard bits</span>
          </h1>
          <p class="text-lg text-slate-100/90 max-w-xl">
            Quote quicker, fire off pro proposals, handle reviews in seconds, and grab answers from manuals without scrolling PDFs.
            Less admin. More tools time. Easy as.
          </p>
          <div class="flex flex-wrap gap-4">
            <a class="btn btn-primary btn-wide" href="/account/tools">Get started free</a>
            <a class="btn btn-ghost text-white border-white/40" href="/pricing">See pricing</a>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div class="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-4">
              <p class="text-2xl font-semibold text-white">6</p>
              <p class="text-slate-200/80">job-ready Smart Tools</p>
            </div>
            <div class="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-4">
              <p class="text-2xl font-semibold text-white">1,200+</p>
              <p class="text-slate-200/80">manuals & technical guides</p>
            </div>
            <div class="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-4">
              <p class="text-2xl font-semibold text-white">Seconds</p>
              <p class="text-slate-200/80">to get a polished response</p>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-amber-400/30 blur-3xl"></div>
          <div class="space-y-4 relative">
            <div class="rounded-3xl border border-white/10 bg-white/10 backdrop-blur shadow-2xl p-6">
              <p class="text-xs uppercase tracking-widest text-amber-200">Smart Chat</p>
              <p class="mt-3 text-base text-slate-100/90">“Need an access reminder for 8am tomorrow.”</p>
              <p class="mt-2 text-sm text-slate-300">Sorted — here’s a tidy SMS and email follow-up ready to send.</p>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/10 backdrop-blur shadow-2xl p-6">
              <p class="text-xs uppercase tracking-widest text-amber-200">Smart Tools</p>
              <p class="mt-3 text-base text-slate-100/90">Material & Cost Calculator, Proposal Generator, Review replies.</p>
              <p class="mt-2 text-sm text-slate-300">All keep your tone Aussie and client-ready.</p>
            </div>
            <div class="rounded-3xl border border-white/10 bg-white/10 backdrop-blur shadow-2xl p-6">
              <p class="text-xs uppercase tracking-widest text-amber-200">Tradie Library</p>
              <p class="mt-3 text-base text-slate-100/90">Get answers from wiring rules, HVAC manuals, plumbing guides, SDS, and spec sheets.</p>
              <p class="mt-2 text-sm text-slate-300">Responses call out references where possible.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- VALUE BAND -->
  <section class="py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h3 class="text-xl font-semibold text-white">Work smarter, not longer</h3>
          <p class="text-sm text-slate-200/80 mt-2">Less keyboard, more toolbox. Keep jobs moving without overtime.</p>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h3 class="text-xl font-semibold text-white">Win more jobs</h3>
          <p class="text-sm text-slate-200/80 mt-2">Be first with a clean quote — and close it with confidence.</p>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h3 class="text-xl font-semibold text-white">Do better work</h3>
          <p class="text-sm text-slate-200/80 mt-2">Check manuals when it matters. Fewer mistakes, happier clients.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- EVERYTHING IN ONE SPOT -->
  <section class="py-16 bg-slate-900/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="text-center max-w-3xl mx-auto">
        <p class="text-sm uppercase tracking-[0.2em] text-amber-200">Everything in one spot</p>
        <h2 class="text-3xl md:text-4xl font-bold mt-3">Tools, chat, and the Tradie Library in one tap</h2>
        <p class="mt-3 text-slate-200/90">From first quote to final review, every part of your trade day gets easier.</p>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <div class="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur p-6 flex flex-col">
          <div class="text-xs uppercase tracking-[0.3em] text-amber-200">Smart Tools</div>
          <h3 class="mt-3 text-2xl font-semibold">Job-ready workflows</h3>
          <p class="mt-2 text-slate-200/90">Price jobs, turn quotes into polished proposals, and handle client comms without the back-and-forth.</p>
          <div class="mt-6 grid grid-cols-1 gap-3 text-sm">
            <div class="rounded-2xl border border-white/10 bg-black/20 p-3">
              <div class="font-semibold">Material & Cost Calculator</div>
              <p class="text-slate-300">Materials, labour & markup sorted in minutes.</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/20 p-3">
              <div class="font-semibold">Job Estimation Wizard</div>
              <p class="text-slate-300">Short brief → itemised, client-ready quote.</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/20 p-3">
              <div class="font-semibold">Proposal & Comms kit</div>
              <p class="text-slate-300">Proposals, review replies, socials & tidy emails.</p>
            </div>
          </div>
          <div class="mt-6">
            <a href="/account/tools" class="btn btn-outline btn-sm">Open Smart Tools</a>
          </div>
        </div>

        <div class="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur p-6 flex flex-col">
          <div class="text-xs uppercase tracking-[0.3em] text-amber-200">Smart Chat</div>
          <h3 class="mt-3 text-2xl font-semibold">Advice on tap</h3>
          <p class="mt-2 text-slate-200/90">Safety notes, tidy SMS messages, troubleshooting, or “how do I fix this?” — ask it anything.</p>
          <div class="mt-4 space-y-3 text-sm">
            <div class="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p class="text-slate-200">Apprentice starts Monday — safety induction checklist?</p>
              <p class="mt-2 text-xs text-amber-100/80">Comes back with PPE, hazards, reporting, plus an optional printable one-pager.</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p class="text-slate-200">Need a friendly SMS reminder for 8am access.</p>
              <p class="mt-2 text-xs text-amber-100/80">You’ll get a ready-to-send message and optional email.</p>
            </div>
          </div>
          <div class="mt-6">
            <a href="/account/chat" class="btn btn-outline btn-sm">Try Smart Chat</a>
          </div>
        </div>

        <div class="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur p-6 flex flex-col">
          <div class="text-xs uppercase tracking-[0.3em] text-amber-200">Smart Assistant</div>
          <h3 class="mt-3 text-2xl font-semibold">Tradie Library answers</h3>
          <p class="mt-2 text-slate-200/90">Your on-site brain — thousands of AU/NZ codes, manufacturer manuals, spec sheets, install guides, SDS, and textbooks.</p>
          <div class="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm space-y-4">
            <div>
              <div class="badge badge-ghost badge-sm mb-2">Example output</div>
              <div class="font-semibold">Mitsubishi MSZ-FS clearances & electrics?</div>
              <p class="opacity-90 mt-1 text-slate-200">
                Indoor: 50/100/65&nbsp;mm. Outdoor: ≥400&nbsp;mm front, ≥1000&nbsp;mm above. Max fuse 15–20&nbsp;A; MCA 10–18&nbsp;A; copper conductors AWG14–12; wiring per local code.
              </p>
              <div class="mt-1 text-xs text-amber-100/80 italic">References where possible.</div>
            </div>
            <div class="divider divider-ghost"></div>
            <div>
              <div class="badge badge-ghost badge-sm mb-2">Example output</div>
              <div class="font-semibold">Domestic hot water storage vs outlet temps?</div>
              <p class="opacity-90 mt-1 text-slate-200">
                Store ≥60&nbsp;°C to control Legionella. Temper to ≤50&nbsp;°C for bathrooms (≤45&nbsp;°C childcare/aged care) using approved TMV sized to fixture units and run length.
              </p>
            </div>
          </div>
          <div class="mt-6">
            <a href="/account/assistant" class="btn btn-outline btn-sm">Meet the Assistant</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- JOB STORY -->
  <section class="py-16 bg-slate-950">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded-[32px] border border-white/10 bg-gradient-to-br from-amber-200/20 via-white/5 to-rose-200/10 backdrop-blur p-8">
        <div class="grid gap-6 lg:grid-cols-3">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-amber-200">1 • Price it</p>
            <h3 class="text-2xl font-semibold mt-2">Josh costs the job</h3>
            <p class="text-sm text-slate-200/90 mt-3">
              Materials & Cost Calculator + Estimation Wizard turn a deck brief into an itemised quote ready to paste.
            </p>
          </div>
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-amber-200">2 • Keep clients updated</p>
            <h3 class="text-2xl font-semibold mt-2">Smart Chat tidies the comms</h3>
            <p class="text-sm text-slate-200/90 mt-3">
              Friendly follow-up emails, SMS reminders, even review replies — all in his tone without the blank-page stare.
            </p>
          </div>
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-amber-200">3 • Confirm on site</p>
            <h3 class="text-2xl font-semibold mt-2">Assistant checks the spec</h3>
            <p class="text-sm text-slate-200/90 mt-3">
              Need clearances or electrical notes? Ask the Tradie Library and it’ll cite the manual so Josh can crack on.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS + PRICING CTA -->
  <section class="py-16 bg-slate-900/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="text-center">
        <p class="text-sm uppercase tracking-[0.3em] text-amber-200">Real tradies</p>
        <h2 class="text-3xl md:text-4xl font-bold mt-3">“It looks mint and saves me hours.”</h2>
        <p class="mt-3 text-slate-200/80">Built with sparkies, plumbers, HVAC techs, and builders who wanted AI that sounds like them.</p>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div class="text-amber-200 text-xl">★★★★★</div>
          <p class="mt-2 text-slate-100/90">“Quoting used to chew up my nights. Now it’s sorted before dinner.”</p>
          <p class="mt-3 text-xs text-slate-400">Jake • Electrician</p>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div class="text-amber-200 text-xl">★★★★★</div>
          <p class="mt-2 text-slate-100/90">“The proposal looked pro. Client signed the next day.”</p>
          <p class="mt-3 text-xs text-slate-400">Mel • Plumber</p>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div class="text-amber-200 text-xl">★★★★★</div>
          <p class="mt-2 text-slate-100/90">“On-site answers from manuals — game changer.”</p>
          <p class="mt-3 text-xs text-slate-400">Ari • HVAC</p>
        </div>
      </div>
      <div class="text-center">
        <a href="/pricing" class="btn btn-primary btn-wide">Compare plans</a>
      </div>
    </div>
  </section>

  <!-- INSTALL ON YOUR PHONE CALLOUT -->
  <section class="py-16 bg-slate-950">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-amber-200">Use it like an app</p>
        <h2 class="text-3xl font-semibold mt-3">Keep Tradie Assistant on your home screen</h2>
        <p class="mt-4 text-slate-200/90">
          The site is already mobile optimised — all you need is the built-in “Add to Home Screen” option on your phone. Takes a few taps and works on both iPhone and Android.
        </p>
        {#if detectedPlatform}
          <div class="mt-4 rounded-2xl border border-amber-300/40 bg-amber-100/10 p-4 text-sm text-amber-50">
            Looks like you’re on <strong>{detectedPlatform}</strong>. Follow those steps below to pin the app in about 10 seconds.
          </div>
        {:else}
          <p class="mt-4 text-sm text-slate-400">Visiting on desktop? Save these steps or show the crew on site.</p>
        {/if}
      </div>
      <div class="space-y-4">
        {#each installGuides as guide}
          <div
            class={`rounded-3xl border p-5 backdrop-blur transition-all ${
              detectedPlatform === guide.platform
                ? 'border-amber-300/60 bg-white/10 shadow-lg'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <h3 class="text-lg font-semibold text-white flex items-center gap-2">
              <span class="inline-flex h-2 w-2 rounded-full bg-amber-300"></span>
              {guide.platform}
            </h3>
            <ol class="mt-3 space-y-2 list-decimal list-inside text-sm text-slate-200">
              {#each guide.steps as step}
                <li>{step}</li>
              {/each}
            </ol>
            {#if guide.extra}
              <p class="mt-3 text-xs text-slate-400">{guide.extra}</p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="py-16 bg-slate-900/80">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-6">
        <p class="text-sm uppercase tracking-[0.3em] text-amber-200">FAQs</p>
        <h2 class="text-3xl font-bold mt-3">Straight answers</h2>
      </div>
      <div class="space-y-4">
        <div class="collapse collapse-arrow bg-white/5 backdrop-blur border border-white/10">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium text-white">How do you look after my data and privacy?</div>
          <div class="collapse-content text-sm text-slate-200">
            <p>
              We treat your info like it’s locked in the ute. Your account sits in our secure setup, and we don’t read your chats or files unless you explicitly share them with support.
              When we call OpenAI to generate answers, request/response data may be retained for 30 days for abuse checks then deleted. API data isn’t used to train OpenAI’s models by default.
              See our Privacy and Terms for the lot.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white/5 backdrop-blur border border-white/10">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium text-white">Does it work on site with patchy reception?</div>
          <div class="collapse-content text-sm text-slate-200">
            <p>
              Yep. Everything is tuned for phones and tablets, so it’s light and quick. If you drop out mid-chat, it’ll pick up where you left off once you’re back online.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white/5 backdrop-blur border border-white/10">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium text-white">What if I need to change plans or cancel?</div>
          <div class="collapse-content text-sm text-slate-200">
            <p>
              All billing runs through Stripe. Head to <a class="link" href="/account/billing">Account → Billing</a> anytime to upgrade, downgrade, cancel, or update payment details.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
