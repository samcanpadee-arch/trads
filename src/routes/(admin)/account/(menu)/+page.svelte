<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  interface Props {
    data: {
      profile?: {
        full_name?: string | null;
      } | null;
      billingSummary?: BillingSummary | null;
    };
  }

  type BillingSummary = {
    planName: string;
    status: string;
    interval: string | null;
    trialEnds: string | null;
    nextBill: string | null;
  };

  type InstallGuide = {
    platform: string;
    steps: string[];
    extra?: string;
  };

  const installGuides: InstallGuide[] = [
    {
      platform: 'iPhone (Safari)',
      steps: [
        'Open Tradie Assistant in Safari.',
        'Tap the Share icon (square with an up arrow).',
        'Choose “Add to Home Screen” and hit Add.'
      ],
      extra: 'Launches like an app with your saved login.'
    },
    {
      platform: 'Android (Chrome)',
      steps: [
        'Open Tradie Assistant in Chrome.',
        'Tap the ⋮ menu in the top-right corner.',
        'Select “Add to Home screen” then tap Add.'
      ],
      extra: 'If Chrome shows an Install banner, tap it and confirm.'
    }
  ];

  let { data }: Props = $props();

  const detectedPlatform: string | null = browser
    ? (() => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
          return 'iPhone (Safari)';
        }
        if (/android/.test(userAgent)) {
          return 'Android (Chrome)';
        }
        return null;
      })()
    : null;

  let localDisplayName = $state("");
  let hasVisited = $state(false);
  let installModalOpen = $state(false);

  onMount(() => {
    try {
      // First vs return visit
      hasVisited = localStorage.getItem("hasVisited") === "1";
      localStorage.setItem("hasVisited", "1");

      // Name fallback (only used when profile data is missing)
      localDisplayName =
        (localStorage.getItem("profile.name") ||
          localStorage.getItem("profile_full_name") ||
          localStorage.getItem("name") ||
          "").trim();
    } catch (error) {
      console.warn("account landing localStorage unavailable", error);
    }
  });

  const profileName = $derived((data?.profile?.full_name ?? "").trim());
  const displayName = $derived(profileName || localDisplayName);
  const salutation = $derived(hasVisited ? "Welcome back" : "Welcome");
  const greeting = $derived(
    displayName ? `${salutation}, ${displayName} 👋` : `${salutation} 👋`
  );

  const billingSummary = $derived(data?.billingSummary ?? null);

  const billingStatus = $derived(billingSummary?.status ?? "Free tier access");

  const formatDate = (iso: string | null) => {
    if (!iso) return null;
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  const billingDetail = $derived(
    !billingSummary
      ? "You're on the Free tier. Upgrade to unlock manuals, quoting workflows, and Smart Chat."
      : billingSummary.trialEnds
        ? `Trial ends ${formatDate(billingSummary.trialEnds)}.`
        : billingSummary.nextBill
          ? `Next bill ${formatDate(billingSummary.nextBill)} (${billingSummary.interval ? `${billingSummary.interval} plan` : "plan"}).`
          : "No upcoming billing date yet."
  );
</script>

<svelte:head><title>Home</title></svelte:head>

<section class="max-w-6xl mx-auto px-4 py-10 space-y-8">
  <!-- Hero / welcome -->
  <header class="rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200/70 px-6 py-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">{salutation}</p>
    <h1 class="mt-2 text-3xl font-bold text-gray-900 leading-tight">{greeting}</h1>
    <p class="mt-3 text-base text-gray-700 max-w-3xl">
      Your AI on the tools, from site to spreadsheets. Ask for anything: job wording, pricing ideas, client comms, or “how do I fix this?” You’ll get clear, friendly help in seconds.
    </p>
    <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-amber-800">
      <span>Need the public site?</span>
      <a class="link link-primary" href="/" target="_blank" rel="noreferrer">
        Visit tradieassistant.com ↗
      </a>
    </div>
    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <div class="rounded-2xl border border-white/60 bg-white/60 backdrop-blur p-4 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Smart Chat tip</p>
        <p class="mt-1 text-sm text-gray-800">
          Drop in site photos or voice notes and the assistant will flag risks, compliance wording, and a ready-to-send reply.
        </p>
      </div>
      <div class="rounded-2xl border border-white/60 bg-white/60 backdrop-blur p-4 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Library spotlight</p>
        <p class="mt-1 text-sm text-gray-800">
          Star your go-to manuals, calculators, and checklists so they stay pinned for quick access on every job.
        </p>
      </div>
    </div>
  </header>

  <!-- Smart surface -->
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <a
      href="/account/chat"
      class="rounded-2xl border border-base-300/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Conversations</p>
      <h2 class="mt-2 text-2xl font-semibold">Smart Chat</h2>
      <p class="mt-2 text-sm text-gray-600">
        Ask for word-perfect comms, site-ready advice, or quick explainers. Ideal for clear, confident replies on the go.
      </p>
    </a>

    <a
      href="/account/assistant"
      class="rounded-2xl border border-base-300/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Manuals & knowledge</p>
      <h2 class="mt-2 text-2xl font-semibold">Smart Assistant</h2>
      <p class="mt-2 text-sm text-gray-600">
        Tap into the Tradie Library for technical references, standards, and how-tos so every answer cites the right material.
      </p>
    </a>

    <a
      href="/account/tools"
      class="rounded-2xl border border-base-300/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Documents & pricing</p>
      <h2 class="mt-2 text-2xl font-semibold">Smart Tools</h2>
      <p class="mt-2 text-sm text-gray-600">
        Generate quotes, proposals, calculators, and marketing copy that feel on-brand so you spend less time in spreadsheets.
      </p>
    </a>
  </div>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
    <div class="space-y-6">
      <!-- Billing summary -->
      <div class="rounded-2xl border border-gray-200 bg-white/80 px-5 py-6 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div class="space-y-1 text-gray-800">
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Plan & billing</p>
            <h3 class="text-xl font-semibold">{billingSummary ? billingSummary.planName : 'Free plan'}</h3>
            <p class="text-sm text-gray-600">{billingDetail}</p>
          </div>
          <div class="space-y-1 text-sm text-gray-700">
            <p class="font-semibold">Status: {billingStatus}</p>
            <a href="/account/billing" class="btn btn-outline w-full md:w-auto">Manage plan</a>
          </div>
        </div>
      </div>

      <!-- Install helper -->
      <div class="rounded-2xl border border-gray-200 bg-white/80 px-5 py-6 shadow-sm">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex-1 space-y-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Stay site-ready</p>
            <h3 class="text-xl font-semibold text-gray-900">Pin Tradie Assistant to your home screen</h3>
            <p class="text-sm text-gray-600">
              Save it beside your other field tools so the next quote, checklist, or manual is one tap away.
            </p>
            <button class="btn btn-neutral mt-4 w-full sm:w-auto" onclick={() => (installModalOpen = true)}>
              Add to your phone
            </button>
          </div>
          <div class="w-full max-w-sm rounded-2xl border border-dashed border-amber-200 bg-amber-50/70 p-5 text-sm text-amber-900">
            <p class="text-[11px] font-semibold uppercase tracking-wide">Tools guide</p>
            <p class="mt-2 text-sm">
              Need the big-picture walkthrough? The guide covers Smart Chat, the Tradie Library, and every Smart Tool workflow.
            </p>
            <a href="/account/guide" class="btn btn-ghost btn-sm mt-4 w-full">View tools guide</a>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Support / contact -->
      <div class="rounded-2xl border border-gray-200 bg-white/80 px-5 py-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900">Need a hand?</h3>
        <p class="mt-1 text-sm text-gray-600">Something not working or need a tip? We’re here to help.</p>
        <a
          href="/contact_us"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline mt-4"
          aria-label="Open contact page in a new tab"
        >Contact support ↗</a>
      </div>

      <!-- Footer note -->
      <div class="rounded-2xl border border-dashed border-gray-200 px-5 py-4 text-xs text-gray-500">
        Remember — AI’s here to save you time, not replace your know-how. Always review before sending to a client.
      </div>
    </div>
  </div>
</section>

<!-- Checkout success banner (client-only, safe) -->
{#if typeof window !== 'undefined' && new URL(window.location.href).searchParams.get('session_id')}
  <div class="alert alert-success mt-4">
    <span>🎉 You’re all set! Your subscription is active. You can manage it anytime in <a class="link" href="/account/billing">Billing</a>.</span>
  </div>
{/if}

{#if installModalOpen}
  <div class="modal modal-open">
    <div class="modal-box max-w-3xl">
      <h3 class="font-semibold text-lg">Add Tradie Assistant to your phone</h3>
      <p class="mt-2 text-sm opacity-70">
        Follow the steps below so this dashboard behaves like a native app. Once pinned, you stay signed in and everything is just one tap away from the job site.
      </p>
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        {#each installGuides as guide}
          <div
            class={`rounded-2xl border p-4 bg-base-200/70 text-sm transition-all ${
              detectedPlatform === guide.platform ? 'border-primary bg-base-100 shadow' : 'border-base-300'
            }`}
          >
            <h3 class="font-semibold flex items-center gap-2 text-sm">
              <span class="inline-flex h-2 w-2 rounded-full bg-primary"></span>
              {guide.platform}
            </h3>
            <ol class="mt-2 space-y-1 list-decimal list-inside text-xs">
              {#each guide.steps as step}
                <li>{step}</li>
              {/each}
            </ol>
            {#if guide.extra}
              <p class="mt-2 text-[11px] opacity-70">{guide.extra}</p>
            {/if}
          </div>
        {/each}
      </div>
      {#if !detectedPlatform}
        <p class="mt-4 text-xs opacity-70">Tip: Screenshot or share this page so you can follow it on your phone later.</p>
      {/if}
      <div class="modal-action">
        <button class="btn" onclick={() => (installModalOpen = false)}>Done</button>
      </div>
    </div>
    <button class="modal-backdrop" onclick={() => (installModalOpen = false)} aria-label="Close install guide"></button>
  </div>
{/if}
