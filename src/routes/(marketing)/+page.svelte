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

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 text-slate-900">
  <!-- HERO -->
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-70"
      style="background: radial-gradient(circle at 15% 30%, rgba(251, 191, 36, 0.35), transparent 45%),
        radial-gradient(circle at 80% 0%, rgba(251, 113, 133, 0.2), transparent 60%),
        radial-gradient(circle at 40% 100%, rgba(129, 140, 248, 0.25), transparent 55%);"
    ></div>
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div class="space-y-6">
          <div class="brand-eyebrow brand-eyebrow--pill">Built for tradies</div>
          <h1 class="brand-heading brand-heading--xl">
            <span>Tradie Assistant</span>
            <span class="block text-amber-600/90">your AI mate for jobs, clients, and the hard bits</span>
          </h1>
          <p class="brand-copy brand-copy--lead max-w-xl">
            Quote quicker, fire off pro proposals, handle reviews in seconds, and grab answers from manuals without scrolling PDFs.
            Less admin. More tools time. Easy as.
          </p>
          <div class="flex flex-wrap gap-4">
            <a class="btn btn-primary btn-wide" href="/account/tools">Get started free</a>
            <a class="btn btn-outline border-slate-300 text-slate-900" href="/pricing">See pricing</a>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div class="rounded-2xl border border-amber-100 bg-white/85 shadow-sm p-4">
              <p class="brand-eyebrow brand-eyebrow--subtle">Smart Tools</p>
              <p class="brand-heading brand-heading--md mt-1">6 instant workflows</p>
              <p class="brand-copy brand-copy--small brand-copy--muted mt-1">Quotes, proposals, reviews, socials, SMS, and cost calculators ready before smoko.</p>
            </div>
            <div class="rounded-2xl border border-amber-100 bg-white/85 shadow-sm p-4">
              <p class="brand-eyebrow brand-eyebrow--subtle">Tradie Library</p>
              <p class="brand-heading brand-heading--md mt-1">1,200+ manuals & guides</p>
              <p class="brand-copy brand-copy--small brand-copy--muted mt-1">Wiring rules, HVAC install books, plumbing codes, SDS, and spec sheets on tap.</p>
            </div>
            <div class="rounded-2xl border border-amber-100 bg-white/85 shadow-sm p-4">
              <p class="brand-eyebrow brand-eyebrow--subtle">Speed</p>
              <p class="brand-heading brand-heading--md mt-1">Answers in seconds</p>
              <p class="brand-copy brand-copy--small brand-copy--muted mt-1">Polished responses land before you’ve packed the ute — even on patchy site Wi-Fi.</p>
            </div>
          </div>
        </div>
        <div class="relative space-y-4">
          <div class="rounded-[32px] border border-dashed border-amber-300 bg-white/70 backdrop-blur-sm aspect-[4/3] flex items-center justify-center text-sm font-medium text-amber-500/80">
            Drop a homepage screenshot here
          </div>
          <div class="rounded-3xl border border-slate-200 bg-white/90 shadow-xl p-6">
            <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Smart Chat</p>
            <p class="mt-3 text-base text-slate-900">“Can you tee up an 8am access reminder that sounds like me?”</p>
            <p class="mt-2 text-sm text-slate-600">Smart Chat fires back a tidy SMS, optional email, and a gentle follow-up nudge before you’ve left the driveway.</p>
          </div>
          <div class="rounded-3xl border border-slate-200 bg-white/90 shadow-xl p-6">
            <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Smart Tools</p>
            <p class="mt-3 text-base text-slate-900">Deck quotes, solar proposals, review replies, socials, email kits.</p>
            <p class="mt-2 text-sm text-slate-600">Each workflow keeps your Aussie tone, adds markup maths, and stays client-ready.</p>
          </div>
          <div class="rounded-3xl border border-slate-200 bg-white/90 shadow-xl p-6">
            <p class="text-xs uppercase tracking-[0.3em] text-amber-600">Tradie Library</p>
            <p class="mt-3 text-base text-slate-900">Thousands of manuals, codes, SDS, spec sheets, and install guides.</p>
            <p class="mt-2 text-sm text-slate-600">Answers cite where the info came from so you can show the inspector on the spot.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- VALUE BAND -->
  <section class="py-12 bg-white/70">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h3 class="brand-heading brand-heading--sm">Work smarter, not longer</h3>
          <p class="brand-copy brand-copy--small brand-copy--muted mt-2">Less keyboard, more toolbox. Keep jobs moving without overtime.</p>
        </div>
        <div class="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h3 class="brand-heading brand-heading--sm">Win more jobs</h3>
          <p class="brand-copy brand-copy--small brand-copy--muted mt-2">Be first with a clean quote — and close it with confidence.</p>
        </div>
        <div class="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h3 class="brand-heading brand-heading--sm">Do better work</h3>
          <p class="brand-copy brand-copy--small brand-copy--muted mt-2">Check manuals when it matters. Fewer mistakes, happier clients.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- EVERYTHING IN ONE SPOT -->
  <section class="py-16 bg-gradient-to-b from-white via-amber-50/60 to-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="text-center max-w-3xl mx-auto">
        <p class="brand-eyebrow brand-eyebrow--subtle">Everything in one spot</p>
        <h2 class="brand-heading brand-heading--lg mt-3">Tools, chat, vision, and the Tradie Library in one tap</h2>
        <p class="brand-copy brand-copy--muted mt-3">From first quote to final review, every part of your trade day gets easier.</p>
      </div>

      <div class="rounded-[32px] border border-dashed border-slate-200 bg-white/80 shadow-sm p-6 text-center text-sm font-medium brand-copy brand-copy--muted">
        Workflow image placeholder — drop in Smart Tools screenshots here
      </div>

      <div class="grid gap-8 lg:grid-cols-4">
        <div class="rounded-[28px] border border-slate-200 bg-white/90 p-6 flex flex-col shadow-sm">
          <div class="brand-eyebrow brand-eyebrow--subtle">Smart Tools</div>
          <h3 class="brand-heading brand-heading--md mt-3">Job-ready workflows</h3>
          <p class="brand-copy brand-copy--muted mt-2">Quote, propose, and follow up without wrestling templates.</p>
          <ul class="mt-4 space-y-2 text-sm brand-copy brand-copy--muted">
            <li class="flex gap-2"><span class="text-amber-600">•</span><span>Terms &amp; Conditions Generator with trade clauses</span></li>
            <li class="flex gap-2"><span class="text-amber-600">•</span><span>Proposal &amp; Estimate Builder with markup maths</span></li>
            <li class="flex gap-2"><span class="text-amber-600">•</span><span>Scope Guard day logs and tidy review/social/email drafts</span></li>
          </ul>
          <div class="mt-6">
            <a href="/account/tools" class="btn btn-outline border-slate-300 text-slate-900 btn-sm">Open Smart Tools</a>
          </div>
        </div>

        <div class="rounded-[28px] border border-slate-200 bg-white/90 p-6 flex flex-col shadow-sm">
          <div class="brand-eyebrow brand-eyebrow--subtle">Smart Chat</div>
          <h3 class="brand-heading brand-heading--md mt-3">Advice on tap</h3>
          <p class="brand-copy brand-copy--muted mt-2">Safety notes, punchy SMS, troubleshooting, or client comms in your tone.</p>
          <div class="mt-4 space-y-3 text-sm">
            <div class="rounded-2xl border border-slate-200 bg-white/70 p-3">
              <p class="brand-copy">“Apprentice starts Monday — give me an induction checklist.”</p>
              <p class="mt-2 text-xs text-amber-600/80">Returns PPE, hazards, reporting, plus a printable one-pager.</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white/70 p-3">
              <p class="brand-copy">“Need a friendly 8am access SMS.”</p>
              <p class="mt-2 text-xs text-amber-600/80">Gives a ready-to-send text and optional email.</p>
            </div>
          </div>
          <div class="mt-6">
            <a href="/account/chat" class="btn btn-outline border-slate-300 text-slate-900 btn-sm">Try Smart Chat</a>
          </div>
        </div>

        <div class="rounded-[28px] border border-slate-200 bg-white/90 p-6 flex flex-col shadow-sm">
          <div class="brand-eyebrow brand-eyebrow--subtle">Smart Vision</div>
          <h3 class="brand-heading brand-heading--md mt-3">See it, fix it</h3>
          <p class="brand-copy brand-copy--muted mt-2">Upload or snap a site photo for trade-specific diagnostics and next steps.</p>
          <ul class="mt-4 space-y-2 text-sm brand-copy brand-copy--muted">
            <li class="flex gap-2"><span class="text-amber-600">•</span><span>Flags safety/isolation risks before you touch it</span></li>
            <li class="flex gap-2"><span class="text-amber-600">•</span><span>Suggests likely fault causes and parts to check</span></li>
            <li class="flex gap-2"><span class="text-amber-600">•</span><span>Gives repair/test steps and handover notes</span></li>
          </ul>
          <div class="mt-6">
            <a href="/account/image" class="btn btn-outline border-slate-300 text-slate-900 btn-sm">Open Smart Vision</a>
          </div>
        </div>

        <div class="rounded-[28px] border border-slate-200 bg-white/90 p-6 flex flex-col shadow-sm">
          <div class="brand-eyebrow brand-eyebrow--subtle">Smart Assistant</div>
          <h3 class="brand-heading brand-heading--md mt-3">Tradie Library answers</h3>
          <p class="brand-copy brand-copy--muted mt-2">Manual-backed answers with citations for specs, clearances, and compliance.</p>
          <ul class="mt-4 space-y-2 text-sm brand-copy brand-copy--muted">
            <li class="flex gap-2"><span class="text-amber-600">•</span><span>Mitsubishi MSZ-FS clearances? 50/100/65 mm indoor; ≥400 mm front and ≥1000 mm above outdoors.</span></li>
            <li class="flex gap-2"><span class="text-amber-600">•</span><span>Domestic hot water: store ≥60 °C, temper to ≤50 °C for bathrooms (≤45 °C aged care/childcare).</span></li>
            <li class="flex gap-2"><span class="text-amber-600">•</span><span>Upload your own PDFs for niche products and keep them private.</span></li>
          </ul>
          <div class="mt-6">
            <a href="/account/assistant" class="btn btn-outline border-slate-300 text-slate-900 btn-sm">Meet the Assistant</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- JOB STORY -->
  <section class="py-16 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-sm">
        <div class="grid gap-6 lg:grid-cols-3">
          <div>
            <p class="brand-eyebrow brand-eyebrow--subtle">1 • Price it</p>
            <h3 class="brand-heading brand-heading--md mt-2">Josh costs the job</h3>
            <p class="brand-copy brand-copy--small brand-copy--muted mt-3">
              Terms &amp; Conditions Generator plus the Proposal &amp; Estimate Builder turn a deck brief into an itemised quote with rock-solid fine print ready to paste.
            </p>
          </div>
          <div>
            <p class="brand-eyebrow brand-eyebrow--subtle">2 • Keep clients updated</p>
            <h3 class="brand-heading brand-heading--md mt-2">Smart Chat tidies the comms</h3>
            <p class="brand-copy brand-copy--small brand-copy--muted mt-3">
              Friendly follow-up emails, SMS reminders, even review replies — all in his tone without the blank-page stare.
            </p>
          </div>
          <div>
            <p class="brand-eyebrow brand-eyebrow--subtle">3 • Confirm on site</p>
            <h3 class="brand-heading brand-heading--md mt-2">Assistant checks the spec</h3>
            <p class="brand-copy brand-copy--small brand-copy--muted mt-3">
              Need clearances or electrical notes? Ask the Tradie Library and it’ll cite the manual so Josh can crack on.
            </p>
          </div>
        </div>
        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <div class="rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm font-medium brand-copy brand-copy--muted">
            Drop a site photo or product hero render here
          </div>
          <div class="rounded-[28px] border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm font-medium brand-copy brand-copy--muted">
            Drop a Tradie Library screenshot or testimonial collage here
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS + PRICING CTA -->
  <section class="py-16 bg-amber-50/60">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="text-center">
        <p class="brand-eyebrow brand-eyebrow--subtle">Real tradies</p>
        <h2 class="brand-heading brand-heading--lg mt-3">“It looks mint and saves me hours.”</h2>
        <p class="brand-copy brand-copy--muted mt-3">Built with sparkies, plumbers, HVAC techs, and builders who wanted AI that sounds like them.</p>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <div class="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div class="text-amber-500 text-xl">★★★★★</div>
          <p class="mt-2 brand-copy">“Quoting used to chew up my nights. Now it’s sorted before dinner.”</p>
          <p class="mt-3 brand-copy brand-copy--small brand-copy--muted">Jake • Electrician</p>
        </div>
        <div class="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div class="text-amber-500 text-xl">★★★★★</div>
          <p class="mt-2 brand-copy">“The proposal looked pro. Client signed the next day.”</p>
          <p class="mt-3 brand-copy brand-copy--small brand-copy--muted">Mel • Plumber</p>
        </div>
        <div class="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div class="text-amber-500 text-xl">★★★★★</div>
          <p class="mt-2 brand-copy">“On-site answers from manuals — game changer.”</p>
          <p class="mt-3 brand-copy brand-copy--small brand-copy--muted">Ari • HVAC</p>
        </div>
      </div>
      <div class="text-center">
        <a href="/pricing" class="btn btn-primary btn-wide">Compare plans</a>
      </div>
    </div>
  </section>

  <!-- INSTALL ON YOUR PHONE CALLOUT -->
  <section class="py-16 bg-white">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
      <div>
        <p class="brand-eyebrow brand-eyebrow--subtle">Use it like an app</p>
        <h2 class="brand-heading brand-heading--lg mt-3">Keep Tradie Assistant on your home screen</h2>
        <p class="brand-copy brand-copy--muted mt-4">
          The site is already mobile optimised — all you need is the built-in “Add to Home Screen” option on your phone. Takes a few taps and works on both iPhone and Android.
        </p>
        {#if detectedPlatform}
          <div class="mt-4 rounded-2xl border border-amber-300/60 bg-amber-50/80 p-4 text-sm text-amber-900">
            Looks like you’re on <strong>{detectedPlatform}</strong>. Follow those steps below to pin the app in about 10 seconds.
          </div>
        {/if}
      </div>
      <div class="space-y-4">
        {#each installGuides as guide}
          <div
            class={`rounded-3xl border p-5 backdrop-blur transition-all ${
              detectedPlatform === guide.platform
                ? 'border-amber-300/80 bg-white shadow-lg'
                : 'border-slate-200 bg-white/80 shadow-sm'
            }`}
          >
            <h3 class="brand-heading brand-heading--xs flex items-center gap-2">
              <span class="inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
              {guide.platform}
            </h3>
            <ol class="mt-3 space-y-2 list-decimal list-inside text-sm brand-copy brand-copy--muted">
              {#each guide.steps as step}
                <li>{step}</li>
              {/each}
            </ol>
            {#if guide.extra}
              <p class="mt-3 text-xs brand-copy brand-copy--muted">{guide.extra}</p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="py-16 bg-gradient-to-b from-white to-slate-100/60">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <p class="brand-eyebrow brand-eyebrow--subtle">FAQs</p>
        <h2 class="brand-heading brand-heading--lg mt-3">Straight answers for busy tradies</h2>
      </div>
      <div class="space-y-3">
        <div class="collapse collapse-arrow bg-white border border-slate-200 rounded-2xl">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium brand-heading brand-heading--sm">How do you look after my data and privacy?</div>
          <div class="collapse-content text-sm brand-copy brand-copy--muted">
            <p>
              We treat your info like it’s locked in the ute. Your account sits in our secure setup, and we don’t read your chats, generated outputs, or files unless you explicitly share something with support.
              When we call OpenAI to generate answers, request/response data may be retained for up to 30 days for abuse/safety checks, then deleted unless required by law. API data isn’t used to train OpenAI’s models by default. See our Privacy and Terms for details.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white border border-slate-200 rounded-2xl">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium brand-heading brand-heading--sm">What happens to manuals or files I upload?</div>
          <div class="collapse-content text-sm brand-copy brand-copy--muted">
            <p>
              By default, uploads stay private to your account. We index them so the Assistant can pull short, relevant snippets and include those in the prompt to get you a targeted answer. If you tick “Share this upload to help other tradies”, you’re giving us permission to add a sanitised copy into a shared, read-only library so others can benefit from common manuals/standards. OpenAI may retain API logs for up to 30 days for security/abuse monitoring; that retention isn’t used for training by default.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white border border-slate-200 rounded-2xl">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium brand-heading brand-heading--sm">Can I cancel my subscription at any time?</div>
          <div class="collapse-content text-sm brand-copy brand-copy--muted">
            <p>
              Too easy. Go <strong>Account → Billing → Manage subscription</strong> to open your secure Stripe portal. Cancel any time; your plan stays active until the end of the current period. We don’t store card details — Stripe handles payments and is PCI DSS Level 1 compliant.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white border border-slate-200 rounded-2xl">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium brand-heading brand-heading--sm">Can I use Tradie Assistant on multiple devices?</div>
          <div class="collapse-content text-sm brand-copy brand-copy--muted">
            <p>Yep. It’s a web app — use it on your phone on site, laptop in the shed, or tablet in the ute. Same login, same workspace.</p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white border border-slate-200 rounded-2xl">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium brand-heading brand-heading--sm">How accurate are the answers?</div>
          <div class="collapse-content text-sm brand-copy brand-copy--muted">
            <p>AI is brilliant at speed and wording, but it’s not a licensed tradie. For anything safety-critical or standards-driven, check the cited page and use your judgement.</p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white border border-slate-200 rounded-2xl">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium brand-heading brand-heading--sm">How often do you update the app?</div>
          <div class="collapse-content text-sm brand-copy brand-copy--muted">
            <p>We ship small tweaks most weeks and bigger improvements regularly. Keep an eye on the Blog for notable changes.</p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white border border-slate-200 rounded-2xl">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium brand-heading brand-heading--sm">Do you offer a free plan or trial?</div>
          <div class="collapse-content text-sm brand-copy brand-copy--muted">
            <p>Yes. You can use the Smart Tools on a free account. To try Smart Chat and Smart Assistant, start a 14-day free trial — cancel any time from Billing. See the <a class="link" href="/pricing">Pricing</a> page for details.</p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white border border-slate-200 rounded-2xl">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium brand-heading brand-heading--sm">Do I need to be tech-savvy?</div>
          <div class="collapse-content text-sm brand-copy brand-copy--muted">
            <p>Nope. It’s built for tradies: step-by-step screens, plain language, and job-ready outputs. Type what you need, pick a tool, done.</p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white border border-slate-200 rounded-2xl">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium brand-heading brand-heading--sm">How is this different to ChatGPT?</div>
          <div class="collapse-content text-sm brand-copy brand-copy--muted">
            <p>Tradie Assistant is built for trades — much easier to use, privacy-focused, and backed by a large library of manuals, Australian standards, and guides so you can verify answers. And it’s better value for the jobs you do every day.</p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-white border border-slate-200 rounded-2xl">
          <input type="checkbox" />
          <div class="collapse-title text-base font-medium brand-heading brand-heading--sm">Need help?</div>
          <div class="collapse-content text-sm brand-copy brand-copy--muted">
            <p>
              Hit <a class="link" href="/contact_us">Contact</a> or email <a class="link" href="mailto:support@tradieassistant.app">support@tradieassistant.app</a> — we’ll get you sorted.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
