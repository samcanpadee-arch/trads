<!-- /account/caption -->
<svelte:head>
  <title>Tools</title>
</svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-start justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold">Tools</h1>
      <p class="text-sm opacity-70">Smart, trade-ready assistants to draft proposals, build estimates, and turn job details into polished client docs — fast, accurate, and tailored for Aussie tradies.</p>
    </div>
  </header>

  <!-- Single tools grid -->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <!-- Material & Cost Calculator -->
    <a
      class="card bg-base-100 border border-base-300 hover:shadow-lg transition focus:outline-none focus:ring focus:ring-primary/30"
      href="/account/caption/material-cost"
      aria-label="Open Material & Cost Calculator"
     
    >
      <div class="card-body gap-2">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <!-- calculator icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6">
              <path fill="currentColor" d="M7 2h10a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m0 2a1 1 0 0 0-1 1v14c0 .55.45 1 1 1h10a1 1 0 0 0 1-1V5c0-.55-.45-1-1-1zm2 3h6v3H9zm0 6h2v2H9zm0 4h2v2H9zm4-4h2v2h-2zm0 4h2v2h-2z" />
            </svg>
          </div>
          <h2 class="card-title text-base">Material &amp; Cost Calculator</h2>
        </div>
        <p class="text-sm opacity-80">Deterministic estimator with optional AI summary. Quickly price jobs and materials.</p>
        <div class="mt-2">
          <span class="btn btn-sm btn-primary">Open<span class="ml-1" aria-hidden="true">→</span></span>
        </div>
      </div>
    </a>

    <!-- Proposal Builder -->
    <a
      class="card bg-base-100 border border-base-300 hover:shadow-lg transition focus:outline-none focus:ring focus:ring-primary/30"
      href="/account/caption/proposal"
      aria-label="Open Proposal Builder"
     
    >
      <div class="card-body gap-2">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <!-- doc icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6">
              <path fill="currentColor" d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m7 1.5V8h4.5zM7 11h10v2H7zm0 4h10v2H7z" />
            </svg>
          </div>
          <h2 class="card-title text-base">Proposal Builder</h2>
        </div>
        <p class="text-sm opacity-80">Generate client-ready proposals with scope, timeline, cost breakdowns, and warranties.</p>
        <div class="mt-2">
          <span class="btn btn-sm btn-primary">Open<span class="ml-1" aria-hidden="true">→</span></span>
        </div>
      </div>
    </a>
  <a href="/account/caption/email-template" aria-label="Open Email Template Generator" class="card bg-base-100 border border-base-300 hover:shadow-lg transition focus:outline-none focus:ring focus:ring-primary/30">
    <div class="card-body gap-2">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <!-- envelope icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4l-8 5L4 8V6l8 5l8-5z"/></svg>
        </div>
        <h2 class="card-title text-base">Email Template Generator</h2>
      </div>
      <p class="text-sm opacity-80">Write client-ready emails fast — progress updates, payment reminders, quote follow-ups, and job summaries.</p>
      <div class="mt-2"><span class="btn btn-sm btn-primary">Open<span class="ml-1" aria-hidden="true">→</span></span></div>
    </div>
  </a>


    <!-- Job Estimation Wizard -->
    <a
      class="card bg-base-100 border border-base-300 hover:shadow-lg transition focus:outline-none focus:ring focus:ring-primary/30"
      href="/account/caption/job-estimation"
      aria-label="Open Job Estimation Wizard"
     
    >
      <div class="card-body gap-2">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <!-- estimate/list icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6">
              <path fill="currentColor" d="M3 4h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z" />
            </svg>
          </div>
          <h2 class="card-title text-base">Job Estimation Wizard</h2>
        </div>
        <p class="text-sm opacity-80">Quote-style estimate with materials import, labour breakdown, overhead, margin &amp; GST.</p>
        <div class="mt-2">
          <span class="btn btn-sm btn-primary">Open<span class="ml-1" aria-hidden="true">→</span></span>
        </div>
      </div>
    </a>
    <!-- Review Responder card -->
  <a href="/account/caption/review-responder" aria-label="Open Review Responder" class="card bg-base-100 border border-base-300 hover:shadow-lg transition focus:outline-none focus:ring focus:ring-primary/30">
    <div class="card-body gap-2">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <!-- chat-bubble-heart icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6"><path fill="currentColor" d="M2 12a8 8 0 0 1 8-8h4a8 8 0 0 1 0 16H9l-3.5 2.5a1 1 0 0 1-1.5-.86V16A8 8 0 0 1 2 12m9-5c-2.2 0-4 1.6-4 3.6c0 2.9 3.7 5.2 4.6 5.7a.9.9 0 0 0 .8 0c.9-.5 4.6-2.8 4.6-5.7C18 8.6 16.2 7 14 7c-1 0-1.9.4-2.5 1.1C12 7.4 11.1 7 10 7Z"/></svg>
        </div>
        <h2 class="card-title text-base">Review Responder</h2>
      </div>
      <p class="text-sm opacity-80">Paste a review and generate a friendly, on-brand reply in seconds — with tone control and optional emojis.</p>
      <div class="mt-2"><span class="btn btn-sm btn-primary">Open<span class="ml-1" aria-hidden="true">→</span></span></div>
    </div>
  </a>
  <a href="/account/caption/social-post" aria-label="Open Social Media Post Generator" class="card bg-base-100 border border-base-300 hover:shadow-lg transition focus:outline-none focus:ring focus:ring-primary/30">
    <div class="card-body gap-2">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <!-- megaphone icon -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6"><path fill="currentColor" d="M3 11a6 6 0 0 0 6 6h1v3a1 1 0 0 0 1.64.77L14 19h2a5 5 0 0 0 5-5V6a1 1 0 0 0-1.45-.9L14 7H9a6 6 0 0 0-6 6"/></svg>
        </div>
        <h2 class="card-title text-base">Social Media Post Generator</h2>
      </div>
      <p class="text-sm opacity-80">Turn a quick brief into a platform-savvy caption with optional variants, hashtags, and media ideas.</p>
      <div class="mt-2"><span class="btn btn-sm btn-primary">Open<span class="ml-1" aria-hidden="true">→</span></span></div>
    </div>
  </a>


</div>
  <!-- Social Media Post Generator card -->
  </section>
