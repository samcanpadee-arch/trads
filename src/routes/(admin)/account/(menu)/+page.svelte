<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  interface Props {
    data: {
      profile?: {
        full_name?: string | null;
      } | null;
    };
  }

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

  let detectedPlatform: string | null = null;
  if (browser) {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      detectedPlatform = 'iPhone (Safari)';
    } else if (/android/.test(userAgent)) {
      detectedPlatform = 'Android (Chrome)';
    }
  }

  let localDisplayName = "";
  let hasVisited = false;

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
    } catch {}
  });

  const profileName = $derived((data?.profile?.full_name ?? "").trim());
  const displayName = $derived(profileName || localDisplayName);
  const salutation = $derived(hasVisited ? "Welcome back" : "Welcome");
  const greeting = $derived(
    displayName ? `${salutation}, ${displayName} 👋` : `${salutation} 👋`
  );
</script>

<svelte:head><title>Home</title></svelte:head>

<section class="flex flex-col gap-6">
  <!-- Hero / welcome -->
  <div class="card bg-base-100 border">
    <div class="card-body grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
      <div class="lg:col-span-2 space-y-2">
        <h1 class="text-2xl font-semibold">{greeting}</h1>
  <div class="mt-3">
    <a href="/account/guide" class="btn btn-outline">Tools Guide</a>
  </div>
        <p class="text-sm opacity-80">
          Your AI on the tools, from site to spreadsheets. Ask for anything: job wording, pricing ideas,
          client comms, or “how do I fix this?” You’ll get clear, friendly help in seconds.
        </p>
        <!-- Chat CTA removed (reserved for Pro in future) -->
      </div>

      <!-- Simple inline SVG illustration (toolbox) -->
      <div class="justify-self-end hidden lg:block">
        <div class="rounded-2xl bg-base-200 p-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 192" class="w-56 h-40" aria-hidden="true">
            <rect x="18" y="64" width="220" height="96" rx="12" fill="currentColor" opacity="0.1"/>
            <rect x="32" y="80" width="192" height="64" rx="8" fill="currentColor" opacity="0.15"/>
            <path d="M80 64c0-11 9-20 20-20h56c11 0 20 9 20 20v8h-16v-8a4 4 0 0 0-4-4h-56a4 4 0 0 0-4 4v8H80v-8z" fill="currentColor" opacity="0.25"/>
            <rect x="56" y="104" width="40" height="16" rx="4" fill="currentColor" opacity="0.35"/>
            <rect x="100" y="104" width="40" height="16" rx="4" fill="currentColor" opacity="0.35"/>
            <rect x="144" y="104" width="40" height="16" rx="4" fill="currentColor" opacity="0.35"/>
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Hub -->
  <div class="space-y-2 sm:max-w-2xl">
    <h2 class="text-base font-semibold">Your hub</h2>
    <p class="text-sm opacity-70">
      Everything you need in one place - your Smart Tools, Smart Chat, and Smart Assistant. Built for Aussie tradies to win work,
      talk clearer, and fix problems on the spot.
    </p>
  </div>

  <!-- Existing tiles in a grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Chat -->
    <a href="/account/chat" class="card bg-base-100 border hover:shadow">
      <div class="card-body">
        <h2 class="card-title">Smart Chat</h2>
        <p class="text-sm opacity-70">Ask anything - write client messages, safety notes, checklists, or quick explainers. Great for clear communication and everyday advice.</p>
      </div>
    </a>

    <!-- AI Assistant -->
    <a href="/account/assistant" class="card bg-base-100 border hover:shadow">
      <div class="card-body">
        <h2 class="card-title">Smart Assistant</h2>
        <p class="text-sm opacity-70">The technical brain of your setup — check codes, standards, guides, how-tos, manuals, and spec sheets. Upload a manual or just ask a question — we’ll reference trusted sources where possible.</p>
      </div>
    </a>

    <!-- Tools -->
    <a href="/account/tools" class="card bg-base-100 border hover:shadow">
      <div class="card-body">
        <h2 class="card-title">Smart Tools</h2>
        <p class="text-sm opacity-70">Your everyday helpers for pricing jobs, drafting quotes, and writing polished client marketing docs. Quick, consistent, and made for tradies who’d rather be on the tools than in the office.</p>
      </div>
    </a>
  </div>

  <!-- Mobile install helper -->
  <div class="card bg-base-100 border">
    <div class="card-body grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p class="text-xs font-semibold tracking-wide text-primary uppercase">Add it to your phone</p>
        <h2 class="text-xl font-semibold mt-2">One tap from the job site</h2>
        <p class="text-sm opacity-80 mt-3">
          Tradie Assistant is already mobile ready. Add it to your home screen now so the tools, chat, and manuals are one tap
          away when you’re out on site.
        </p>
        {#if detectedPlatform}
          <div class="mt-4 alert alert-info text-xs">
            <div>
              Looks like you’re on <strong>{detectedPlatform}</strong>. Follow those steps below to pin the app in about 10 seconds.
            </div>
          </div>
        {:else}
          <p class="mt-4 text-xs opacity-70">
            Not on your phone right now? Screenshot these steps or send the link to yourself so you can add it later.
          </p>
        {/if}
      </div>
      <div class="space-y-3">
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
    </div>
  </div>

  <!-- Support / contact -->
  <div class="card bg-base-100 border">
    <div class="card-body flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <h3 class="text-base font-semibold">Need a hand?</h3>
        <p class="text-sm opacity-80">Something not working or need a tip? We’re here to help.</p>
      </div>
      <a
        href="/contact_us"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-outline"
        aria-label="Open contact page in a new tab"
      >Contact support ↗</a>
    </div>
  </div>

  <!-- Footer note -->
  <p class="text-xs opacity-60">
    Remember — AI’s here to save you time, not replace your know-how. Always review before sending to a client.
  </p>
</section>

<!-- Checkout success banner (client-only, safe) -->
{#if typeof window !== 'undefined' && new URL(window.location.href).searchParams.get('session_id')}
  <div class="alert alert-success mt-4">
    <span>🎉 You’re all set! Your subscription is active. You can manage it anytime in <a class="link" href="/account/billing">Billing</a>.</span>
  </div>
{/if}
