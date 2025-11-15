<!-- /account/tools -->
<svelte:head>
  <title>Smart Tools</title>
</svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Documents & pricing</p>
    <h1 class="mt-2 text-3xl font-bold leading-tight text-gray-900">Smart Tools</h1>
    <p class="mt-3 max-w-3xl text-base text-gray-700">
      Spin up quotes, proposals, calculators, and marketing copy that feel on-brand without hours in spreadsheets. Each tool keeps
      your trade tone, references Aussie standards, and feeds straight back into client comms.
    </p>
  </header>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <a
      class="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring focus:ring-primary/30 backdrop-blur"
      href="/account/tools/terms-conditions"
      aria-label="Open Terms & Conditions Generator"
    >
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6">
              <path
                fill="currentColor"
                d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m8 1.5V9h5.5M7 12h10v2H7zm0 4h10v2H7z"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary">Compliance</p>
            <h2 class="text-lg font-semibold">Terms & Conditions Generator</h2>
          </div>
        </div>
        <p class="text-sm text-gray-600">
          Quickly draft payment terms, responsibilities, and conditions your clients agree to before work kicks off.
        </p>
        <span class="btn btn-sm btn-primary self-start">Open<span class="ml-1" aria-hidden="true">→</span></span>
      </div>
    </a>

    <a
      class="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring focus:ring-primary/30 backdrop-blur"
      href="/account/tools/job-estimation"
      aria-label="Open Sales Proposal Generator"
    >
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6">
              <path fill="currentColor" d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V8h4.5zM7 11h10v2H7zm0 4h10v2H7z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary">Docs</p>
            <h2 class="text-lg font-semibold">Sales Proposal Generator</h2>
          </div>
        </div>
        <p class="text-sm text-gray-600">Spin a rough brief into a persuasive, wow-worthy proposal that shows why your crew is the standout choice.</p>
        <span class="btn btn-sm btn-primary self-start">Open<span class="ml-1" aria-hidden="true">→</span></span>
      </div>
    </a>

    <a
      class="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring focus:ring-primary/30 backdrop-blur"
      href="/account/tools/job-estimation"
      aria-label="Open Job Estimation Wizard"
    >
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6">
              <path fill="currentColor" d="M3 4h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary">Pricing</p>
            <h2 class="text-lg font-semibold">Job Estimation Wizard</h2>
          </div>
        </div>
        <p class="text-sm text-gray-600">Build out detailed estimates with materials, labour, overheads, and GST ready to send—no spreadsheet wrangling required.</p>
        <span class="btn btn-sm btn-primary self-start">Open<span class="ml-1" aria-hidden="true">→</span></span>
      </div>
    </a>

    <a
      href="/account/tools/review-responder"
      aria-label="Open Review Responder"
      class="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring focus:ring-primary/30 backdrop-blur"
    >
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6">
              <path fill="currentColor" d="M2 12a8 8 0 0 1 8-8h4a8 8 0 0 1 0 16H9l-3.5 2.5a1 1 0 0 1-1.5-.86V16A8 8 0 0 1 2 12m9-5c-2.2 0-4 1.6-4 3.6c0 2.9 3.7 5.2 4.6 5.7a.9.9 0 0 0 .8 0c.9-.5 4.6-2.8 4.6-5.7C18 8.6 16.2 7 14 7c-1 0-1.9.4-2.5 1.1C12 7.4 11.1 7 10 7Z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary">Reputation</p>
            <h2 class="text-lg font-semibold">Review Responder</h2>
          </div>
        </div>
        <p class="text-sm text-gray-600">Turn any customer shout-out or gripe into a warm, on-brand reply that keeps your reputation sparkling.</p>
        <span class="btn btn-sm btn-primary self-start">Open<span class="ml-1" aria-hidden="true">→</span></span>
      </div>
    </a>

    <a
      href="/account/tools/social-post"
      aria-label="Open Social Media Post Generator"
      class="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring focus:ring-primary/30 backdrop-blur"
    >
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6">
              <path fill="currentColor" d="M3 11a6 6 0 0 0 6 6h1v3a1 1 0 0 0 1.64.77L14 19h2a5 5 0 0 0 5-5V6a1 1 0 0 0-1.45-.9L14 7H9a6 6 0 0 0-6 6" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary">Marketing</p>
            <h2 class="text-lg font-semibold">Social Media Post Generator</h2>
          </div>
        </div>
        <p class="text-sm text-gray-600">Feed it a quick brief and get platform-ready captions, hashtags, and ideas with just the right Aussie flair.</p>
        <span class="btn btn-sm btn-primary self-start">Open<span class="ml-1" aria-hidden="true">→</span></span>
      </div>
    </a>

    <a
      href="/account/tools/email-template"
      aria-label="Open Email Template Generator"
      class="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring focus:ring-primary/30 backdrop-blur"
    >
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6">
              <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4l-8 5L4 8V6l8 5l8-5z" />
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-primary">Comms</p>
            <h2 class="text-lg font-semibold">Email Template Generator</h2>
          </div>
        </div>
        <p class="text-sm text-gray-600">Fire off tidy, professional emails for updates, payment nudges, and wrap-ups that still sound like you.</p>
        <span class="btn btn-sm btn-primary self-start">Open<span class="ml-1" aria-hidden="true">→</span></span>
      </div>
    </a>
  </div>
</section>
