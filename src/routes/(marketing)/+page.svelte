<script lang="ts">
  import { browser } from '$app/environment';

  const year = new Date().getFullYear();

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
    },
    {
      platform: 'Any phone (quick refresher)',
      steps: [
        'Make sure you’re on tradieassistant.com.au in your browser.',
        'Follow the steps for your phone above — takes about 10 seconds.',
        'Keep the icon on your home screen so Tradie Assistant opens like any other app.'
      ],
      extra: 'Share this link or a QR code with the crew so everyone can add it.'
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
  <meta name="description" content="Quote quicker, fire off pro proposals, handle reviews in seconds, and grab specific answers from manuals. Less admin. More tools time. Easy as." />
  <link rel="canonical" href="https://sveltekit-saas-starter-beta-eight.vercel.app/" />
  <meta property="og:title" content="Tradie Assistant — your AI mate for jobs, clients, and the hard bits" />
  <meta property="og:description" content="Quote quicker, fire off pro proposals, handle reviews in seconds, and grab specific answers from manuals. Less admin. More tools time. Easy as." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- HERO -->
<section class="relative overflow-hidden px-4 md:px-6 lg:px-10 pt-10 pb-14">
  <div class="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[480px] w-[800px] rounded-full blur-3xl opacity-30"
       style="background: radial-gradient(40% 40% at 50% 50%, hsl(var(--p)) 0%, transparent 70%);"></div>

  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center relative">
    <div>
      <h1 class="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
        <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tradie Assistant</span>
        <span class="block mt-2">your AI mate for jobs, clients, and the hard bits</span>
      </h1>
      <p class="mt-4 text-base md:text-lg opacity-90">
        Quote quicker, fire off pro proposals, handle reviews in seconds, and grab specific answers from manuals.
        Less admin. More tools time. Easy as.
      </p>
      <div class="mt-6">
        <a href="/account/tools" class="btn btn-primary">Get Started Free</a>
      </div>
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

<!-- INSTALL ON YOUR PHONE CALLOUT -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-5xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
    <div>
      <p class="text-sm font-semibold tracking-wide text-primary uppercase">Use it like an app</p>
      <h2 class="text-2xl md:text-3xl font-bold mt-2">Keep Tradie Assistant on your home screen</h2>
      <p class="mt-3 opacity-80">
        The site is already mobile optimised — all you need is the built-in “Add to Home Screen” option on your phone.
        Takes a few taps and works on both iPhone and Android. Perfect for tradies who just want to tap an icon and go.
      </p>
      {#if detectedPlatform}
        <div class="mt-4 alert alert-info text-sm">
          <div>
            Looks like you’re on <strong>{detectedPlatform}</strong>. Follow those steps below to pin the app in about 10 seconds.
          </div>
        </div>
      {:else}
        <p class="mt-4 text-sm opacity-80">
          Visiting on desktop? Save these steps or print the card so you can show the crew how to set it up on site.
        </p>
      {/if}
      <div class="mt-5 rounded-2xl border border-dashed p-5 bg-base-200/60 text-sm">
        <p class="font-semibold">Extra tip:</p>
        <p class="opacity-80">
          If you’ve enabled the PWA install prompt on Android, Chrome will sometimes pop up an “Install app” banner.
          Tell the team to tap it — it’s the same result as the manual steps and feels even more like a native app.
        </p>
      </div>
    </div>
    <div class="space-y-4">
      {#each installGuides as guide}
        <div
          class={`rounded-2xl border p-5 bg-base-200/70 transition-all ${
            detectedPlatform === guide.platform ? 'border-primary bg-base-100 shadow-lg' : 'border-base-300'
          }`}
        >
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <span class="inline-flex h-2 w-2 rounded-full bg-primary"></span>
            {guide.platform}
          </h3>
          <ol class="mt-3 space-y-2 list-decimal list-inside text-sm">
            {#each guide.steps as step}
              <li>{step}</li>
            {/each}
          </ol>
          {#if guide.extra}
            <p class="mt-3 text-xs opacity-80">{guide.extra}</p>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- VALUE BAND -->
<section class="px-4 md:px-6 lg:px-10 py-8 bg-base-200">
  <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
    <div>
      <h3 class="text-xl font-bold">Work smarter, not longer</h3>
      <p class="opacity-80 mt-2">Less keyboard, more toolbox. Keep jobs moving without overtime.</p>
    </div>
    <div>
      <h3 class="text-xl font-bold">Win more jobs</h3>
      <p class="opacity-80 mt-2">Be first with a clean quote — and close it with confidence.</p>
    </div>
    <div>
      <h3 class="text-xl font-bold">Do better work</h3>
      <p class="opacity-80 mt-2">Check manuals when it matters. Fewer mistakes, happier clients.</p>
    </div>
  </div>
</section>

<!-- EVERYTHING IN ONE SPOT -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">Everything you need, all in one spot</h2>
    <p class="mt-2 opacity-80 max-w-3xl">From first quote to final review, every part of your trade day gets easier.</p>

    <!-- Smart Tools (text left, image right) -->
    <div class="mt-8 grid md:grid-cols-2 gap-8 items-start">
      <div>
        <h3 class="text-xl font-bold">Smart Tools</h3>
        <p class="opacity-80 mt-2">
          Six everyday helpers to price jobs, turn quotes into polished proposals, and handle client comms without the back-and-forth.
        </p>
        <!-- mini-cards (fit cleanly on mobile) -->
        <div class="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          <div class="rounded-lg border p-3">
            <div class="font-semibold">Material & Cost Calculator</div>
            <div class="opacity-80">Price jobs in minutes — materials, labour & markup sorted.</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="font-semibold">Job Estimation Wizard</div>
            <div class="opacity-80">Short brief → itemised, client-ready quote (imports materials).</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="font-semibold">Sales Proposal Generator</div>
            <div class="opacity-80">Turn your quote into a polished, persuasive proposal.</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="font-semibold">Review Responder</div>
            <div class="opacity-80">Paste any review → on-brand reply in seconds (tone control).</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="font-semibold">Social Post Generator</div>
            <div class="opacity-80">Platform-smart captions in your Aussie voice (soft CTA).</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="font-semibold">Email Template Generator</div>
            <div class="opacity-80">Summary in → clear, tidy client email without the faff.</div>
          </div>
        </div>
        <div class="mt-5">
          <a href="/account/tools" class="btn btn-outline btn-sm">Try it now</a>
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
          <div class="chat chat-start"><div class="chat-bubble">Apprentice starts Monday — safety induction checklist?</div></div>
          <div class="chat chat-end"><div class="chat-bubble">PPE, site hazards, manual handling, ladders, electrical safety, incident reporting. Want a one-pager to print?</div></div>
          <div class="chat chat-start"><div class="chat-bubble">Yes please mate.</div></div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2 text-xs">
          <span class="badge badge-ghost">Tips & How-tos</span>
          <span class="badge badge-ghost">Safety & Compliance</span>
          <span class="badge badge-ghost">Marketing & Sales</span>
          <span class="badge badge-ghost">Customer Comms</span>
          <span class="badge badge-ghost">Business Ops</span>
          <span class="badge badge-ghost">Hiring & Training</span>
          <span class="badge badge-ghost">Troubleshooting</span>
        </div>
        <p class="text-xs opacity-70 mt-2">Have a yarn with it — ask anything and keep the convo going.</p>
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
          Your on-site brain — thousands of AU/NZ codes, manufacturer manuals, spec sheets, install guides, SDS, textbooks — plus your PDFs.
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
        <!-- Technical sample outputs (two different examples) -->
        <div class="mt-4 rounded-xl border bg-base-100 p-4 text-sm space-y-4">
          <div>
            <div class="badge badge-ghost badge-sm mb-2">Example output</div>
            <div class="font-semibold">Q (example): Mitsubishi MSZ-FS indoor/outdoor clearances and electrics?</div>
            <p class="opacity-90 mt-1">
              A (example): Indoor MSZ-FS: 50&nbsp;mm side, 100&nbsp;mm rear, 65&nbsp;mm ceiling. Outdoor MUZ-FS: ≥400&nbsp;mm front, ≥1000&nbsp;mm above (model-specific).
              Max fuse 15–20&nbsp;A; min circuit ampacity 10–18&nbsp;A; copper conductors AWG14–AWG12; wiring per local code.
            </p>
            <div class="mt-1 text-xs opacity-70 italic">References where possible: SRK-ZMP-S manual p. 20; MUZ-FS installation pp. 1–3, 11.</div>
          </div>
          <div class="divider my-1"></div>
          <div>
            <div class="badge badge-ghost badge-sm mb-2">Example output</div>
            <div class="font-semibold">Q (example): Domestic hot water — storage vs outlet temps, and tempering?</div>
            <p class="opacity-90 mt-1">
              A (example): Store at ≥60&nbsp;°C to control Legionella. Temper to ≤50&nbsp;°C for domestic ablution outlets; ≤45&nbsp;°C in childcare/aged-care.
              Use an approved tempering/TMV sized to fixture units and run length; verify valve model and local requirements.
            </p>
            <div class="mt-1 text-xs opacity-70 italic">References where possible: AS/NZS 3500 (hot water), valve manufacturer data.</div>
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

<!-- STORY SECTION (moved below; 3-card narrative) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">What it might look like on a real job</h2>
    <div class="mt-6 grid md:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="rounded-2xl border bg-base-100 p-5">
        <div class="text-5xl font-extrabold text-primary/80">1</div>
        <h3 class="mt-2 font-semibold">Meet Josh (Quote with Smart Tools)</h3>
        <p class="text-sm opacity-80 mt-1">
          Josh is a licensed sparkie running a small crew. He hates burning nights on quotes and emails.
          He opens Material & Cost Calculator and the Estimation Wizard to price a deck, then gets a neat, itemised quote ready to paste into his email or doc.
        </p>
        <div class="mt-3 aspect-[16/10] rounded-xl border bg-base-200 grid place-items-center text-xs opacity-70">Costing summary mock</div>
      </div>
      <!-- Card 2 -->
      <div class="rounded-2xl border bg-base-100 p-5">
        <div class="text-5xl font-extrabold text-primary/80">2</div>
        <h3 class="mt-2 font-semibold">Communicate (Smart Chat)</h3>
        <p class="text-sm opacity-80 mt-1">
          The client has questions and wants timing. Josh uses Smart Chat to draft a friendly follow-up email and a simple SMS reminder for access.
          No staring at a blank screen — clear words, sorted in seconds, in his own voice.
        </p>
        <div class="mt-3 rounded-xl border bg-base-100 p-3">
          <div class="chat chat-start"><div class="chat-bubble">Need an access reminder for 8am tomorrow.</div></div>
          <div class="chat chat-end"><div class="chat-bubble">No worries — I’ll draft a tidy SMS you can send.</div></div>
        </div>
      </div>
      <!-- Card 3 -->
      <div class="rounded-2xl border bg-base-100 p-5">
        <div class="text-5xl font-extrabold text-primary/80">3</div>
        <h3 class="mt-2 font-semibold">Confirm (Smart Assistant)</h3>
        <p class="text-sm opacity-80 mt-1">
          On site, Josh double-checks a clearance and electrical spec from the manuals library — a specific answer with a reference where possible.
          He finishes confident it’s done right, without trawling PDFs on his phone.
        </p>
        <div class="mt-3 rounded-xl border bg-base-100 p-3 text-sm space-y-1">
          <div class="font-semibold">Q (example): MSZ-FS clearances and electrics?</div>
          <div>
            A (example): Indoor: 50/100/65&nbsp;mm; Outdoor: ≥400&nbsp;mm front, ≥1000&nbsp;mm above; Max fuse 15–20&nbsp;A; MCA 10–18&nbsp;A; copper AWG14–AWG12; per local code.
            <span class="badge badge-ghost badge-sm ml-1">Reference where possible</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- OUR MISSION -->
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

<!-- TESTIMONIALS (one card per slide, arrows, mobile-friendly) -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">What tradies are saying</h2>

    <div class="carousel w-full mt-6 rounded-2xl border bg-base-100">
      <!-- Slide 1 -->
      <div id="slide1" class="carousel-item relative w-full">
        <div class="w-full p-6">
          <div class="card bg-base-100 border max-w-md mx-auto">
            <div class="card-body">
              <div class="mb-2 text-yellow-500">★★★★★</div>
              <p class="opacity-90">“Quoting used to chew up my nights. Now it’s sorted before dinner.”</p>
              <div class="text-xs opacity-70 mt-2">Jake • Electrician</div>
            </div>
          </div>
        </div>
        <div class="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between">
          <a href="#slide3" class="btn btn-circle btn-ghost">❮</a>
          <a href="#slide2" class="btn btn-circle btn-ghost">❯</a>
        </div>
      </div>
      <!-- Slide 2 -->
      <div id="slide2" class="carousel-item relative w-full">
        <div class="w-full p-6">
          <div class="card bg-base-100 border max-w-md mx-auto">
            <div class="card-body">
              <div class="mb-2 text-yellow-500">★★★★★</div>
              <p class="opacity-90">“The proposal looked pro. Client signed the next day.”</p>
              <div class="text-xs opacity-70 mt-2">Mel • Plumber</div>
            </div>
          </div>
        </div>
        <div class="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between">
          <a href="#slide1" class="btn btn-circle btn-ghost">❮</a>
          <a href="#slide3" class="btn btn-circle btn-ghost">❯</a>
        </div>
      </div>
      <!-- Slide 3 -->
      <div id="slide3" class="carousel-item relative w-full">
        <div class="w-full p-6">
          <div class="card bg-base-100 border max-w-md mx-auto">
            <div class="card-body">
              <div class="mb-2 text-yellow-500">★★★★★</div>
              <p class="opacity-90">“On-site answers from manuals — game changer.”</p>
              <div class="text-xs opacity-70 mt-2">Ari • HVAC</div>
            </div>
          </div>
        </div>
        <div class="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between">
          <a href="#slide2" class="btn btn-circle btn-ghost">❮</a>
          <a href="#slide1" class="btn btn-circle btn-ghost">❯</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING TEASER -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-200">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Pricing</h2>
    <p class="mt-2 opacity-80">See plans and full details on our pricing page.</p>
    <div class="mt-6">
      <a href="/pricing" class="btn btn-primary">View Pricing</a>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="px-4 md:px-6 lg:px-10 py-10 bg-base-100">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl md:text-3xl font-bold">FAQs</h2>
    <div class="mt-4 join join-vertical w-full">
   <div class="collapse collapse-arrow bg-base-200 my-3 md:my-4">
  <input type="checkbox" />
  <div class="collapse-title text-base font-medium">How do you look after my data and privacy?</div>
  <div class="collapse-content">
    <p>
      We treat your info like it’s locked in the ute. Your account sits in our secure setup, and we don’t read your chats,
      generated outputs, or files unless you explicitly share something with support. When we call OpenAI to generate answers,
      request/response data may be retained by OpenAI for up to 30 days for abuse/safety checks, then deleted unless required by law.
      API data isn’t used to train OpenAI’s models by default. See our Privacy and Terms for details.
    </p>
  </div>
</div>

<div class="collapse collapse-arrow bg-base-200 my-3 md:my-4">
  <input type="checkbox" />
  <div class="collapse-title text-base font-medium">What happens to manuals or files I upload?</div>
  <div class="collapse-content">
    <p>
      By default, uploads stay private to your account. We index them so the Assistant can pull short, relevant snippets and include those
      in the prompt to get you a targeted answer. If you tick “Share this upload to help other tradies”, you’re giving us
      permission to add a sanitised copy into a shared, read-only library so others can benefit from common manuals/standards.
      OpenAI may retain API logs for up to 30 days for security/abuse monitoring; that retention is on their side and isn’t used for training by default.
    </p>
  </div>
</div>

<div class="collapse collapse-arrow bg-base-200 my-3 md:my-4">
  <input type="checkbox" />
  <div class="collapse-title text-base font-medium">Can I cancel my subscription at any time?</div>
  <div class="collapse-content">
    <p>
      Too easy. Go <strong>Account → Billing → Manage billing</strong> to open your secure Stripe portal. Cancel any time; your plan stays active
      until the end of the current period. We don’t store card details - Stripe handles payments and is PCI DSS Level 1 compliant.
    </p>
  </div>
</div>

<div class="collapse collapse-arrow bg-base-200 my-3 md:my-4">
  <input type="checkbox" />
  <div class="collapse-title text-base font-medium">Can I use Tradie Assistant on multiple devices?</div>
  <div class="collapse-content">
    <p>Yep. It’s a web app - use it on your phone on site, laptop in the shed, or tablet in the ute. Same login, same workspace.</p>
  </div>
</div>

<div class="collapse collapse-arrow bg-base-200 my-3 md:my-4">
  <input type="checkbox" />
  <div class="collapse-title text-base font-medium">How accurate are the answers?</div>
  <div class="collapse-content">
    <p>
      AI is brilliant at speed and wording, but it’s not a licensed tradie. For anything safety-critical or standards-driven, check the cited page
      and use your judgement. 
    </p>
  </div>
</div>

<div class="collapse collapse-arrow bg-base-200 my-3 md:my-4">
  <input type="checkbox" />
  <div class="collapse-title text-base font-medium">How often do you update the app?</div>
  <div class="collapse-content">
    <p>We ship small tweaks most weeks and bigger improvements regularly. Keep an eye on the Blog for notable changes.</p>
  </div>
</div>

<div class="collapse collapse-arrow bg-base-200 my-3 md:my-4">
  <input type="checkbox" />
  <div class="collapse-title text-base font-medium">Do you offer a free plan or trial?</div>
  <div class="collapse-content">
    <p>
      Yes. You can use the Smart Tools on a free account. To try Smart Chat and Smart Assistant, start a 14-day free trial - cancel any time
      from Billing. See the <a class="link" href="/pricing">Pricing</a> page for details.
    </p>
  </div>
</div>

<div class="collapse collapse-arrow bg-base-200 my-3 md:my-4">
  <input type="checkbox" />
  <div class="collapse-title text-base font-medium">Do I need to be tech-savvy?</div>
  <div class="collapse-content">
    <p>Nope. It’s built for tradies: step-by-step screens, plain language, and job-ready outputs. Type what you need, pick a tool, done.</p>
  </div>
</div>

<div class="collapse collapse-arrow bg-base-200 my-3 md:my-4">
  <input type="checkbox" />
  <div class="collapse-title text-base font-medium">How is this different to ChatGPT?</div>
  <div class="collapse-content">
    <p>
      Tradie Assistant is built for trades — much easier to use, privacy-focused, and backed by a large library of manuals,
      Australian standards, and guides so you can verify answers. And it’s better value for the jobs you do every day.
    </p>
  </div>
</div>

<div class="collapse collapse-arrow bg-base-200 my-3 md:my-4">
  <input type="checkbox" />
  <div class="collapse-title text-base font-medium">Need help?</div>
  <div class="collapse-content">
    <p>
      Hit <a class="link" href="/contact_us">Contact</a> or email
      <a class="link" href="mailto:support@tradieassistant.app">support@tradieassistant.app</a> — we’ll get you sorted.
    </p>
  </div>
</div>


    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="px-4 md:px-6 lg:px-10 py-12">
  <div class="max-w-6xl mx-auto text-center">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Ready to get your time back?</h2>
    <p class="opacity-80 mt-2">Start with the free tools. Add Chat or the Assistant when you’re ready.</p>
    <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/account/tools" class="btn btn-primary">Get Started Free</a>
      <a href="/pricing" class="btn btn-outline">View Pricing</a>
    </div>
  </div>
</section>
