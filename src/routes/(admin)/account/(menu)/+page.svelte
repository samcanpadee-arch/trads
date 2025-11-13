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

  type StatHighlight = {
    label: string;
    detail: string;
  };

  type QuickAction = {
    label: string;
    description: string;
    href: string;
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

  const statHighlights: StatHighlight[] = [
    { label: 'Smart Tools', detail: '6+ job-ready workflows' },
    { label: 'Documents', detail: 'Manuals, specs & guides' },
    { label: 'Chat history', detail: 'Synced across devices' }
  ];

  const quickActions: QuickAction[] = [
    {
      label: 'Send a client update',
      description: 'Turn dot-points into a polished SMS or email.',
      href: '/account/chat'
    },
    {
      label: 'Price today’s job',
      description: 'Use the Job Estimator or Material & Cost calculator.',
      href: '/account/tools/job-estimation'
    },
    {
      label: 'Check a standard',
      description: 'Drop a question and supporting manual into Smart Assistant.',
      href: '/account/assistant'
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
</script>

<svelte:head><title>Home</title></svelte:head>

<section class="flex flex-col gap-6">
  <!-- Hero / welcome -->
  <div class="card border bg-gradient-to-br from-base-100 via-base-100 to-base-200/80">
    <div class="card-body gap-8 lg:flex lg:items-center lg:justify-between">
      <div class="space-y-4 lg:max-w-2xl">
        <div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <span class="h-2 w-2 rounded-full bg-primary"></span>
          Field-ready AI workspace
        </div>
        <div>
          <p class="text-sm opacity-70">{salutation}</p>
          <h1 class="text-3xl font-semibold leading-tight">{greeting}</h1>
        </div>
        <p class="text-base opacity-80">
          Your AI on the tools, from site to spreadsheets. Launch a conversation, open a tool, or store manuals — all in one dashboard built for fast-moving tradies.
        </p>
        <div class="flex flex-col gap-3 sm:flex-row">
          <a href="/account/chat" class="btn btn-primary w-full sm:w-auto">Jump into Smart Chat</a>
          <a href="/account/tools" class="btn btn-outline w-full sm:w-auto">Browse Smart Tools</a>
        </div>
        <div class="flex flex-wrap gap-4 text-sm">
          {#each statHighlights as stat}
            <div class="flex flex-col rounded-2xl border border-base-300/70 px-4 py-3">
              <span class="text-xs uppercase tracking-wide opacity-60">{stat.label}</span>
              <span class="font-semibold">{stat.detail}</span>
            </div>
          {/each}
        </div>
      </div>
      <div class="flex w-full flex-col gap-4 rounded-3xl border border-base-300/60 bg-base-100/80 p-6 text-sm shadow-lg lg:max-w-sm">
        <div class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-wide text-primary">Stay site-ready</p>
          <h2 class="text-xl font-semibold">Pin Tradie Assistant to your home screen</h2>
          <p class="opacity-70">Save the app next to your other field tools so the next quote, checklist, or manual is literally one tap away.</p>
        </div>
        <button class="btn btn-neutral" onclick={() => (installModalOpen = true)}>Add to your phone</button>
        <a href="/account/guide" class="btn btn-ghost justify-start gap-2 p-0 text-sm">View the full tools guide →</a>
      </div>
    </div>
  </div>

  <!-- Hub intro -->
  <div class="space-y-2">
    <h2 class="text-lg font-semibold">Your hub</h2>
    <p class="text-sm opacity-70">
      Everything you need in one place — Smart Tools, Smart Chat, and Smart Assistant. Built for Aussie tradies to win work, talk clearer, and fix problems on the spot.
    </p>
  </div>

  <!-- Quick actions -->
  <div class="card border bg-base-100">
    <div class="card-body gap-6 md:flex md:items-center md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-primary">Quick actions</p>
        <h3 class="text-xl font-semibold">Pick up where you left off</h3>
        <p class="text-sm opacity-70">Popular workflows that most tradies run on the go. Tap one to dive straight in.</p>
      </div>
      <div class="grid flex-1 gap-3 md:grid-cols-3">
        {#each quickActions as action}
          <a href={action.href} class="rounded-2xl border border-base-300/80 bg-base-200/40 p-4 transition hover:-translate-y-0.5 hover:border-primary hover:bg-base-100">
            <p class="text-sm font-semibold">{action.label}</p>
            <p class="text-xs opacity-70">{action.description}</p>
          </a>
        {/each}
      </div>
    </div>
  </div>

  <!-- Existing tiles -->
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <a href="/account/chat" class="card bg-base-100 border border-base-300/80 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div class="card-body space-y-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-primary">Conversations</p>
        <h2 class="card-title">Smart Chat</h2>
        <p class="text-sm opacity-70">Ask anything — write client messages, safety notes, checklists, or quick explainers. Ideal for clear communication and everyday advice.</p>
      </div>
    </a>

    <a href="/account/assistant" class="card bg-base-100 border border-base-300/80 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div class="card-body space-y-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-primary">Manuals & knowledge</p>
        <h2 class="card-title">Smart Assistant</h2>
        <p class="text-sm opacity-70">The technical brain of your setup — check codes, standards, guides, how-tos, manuals, and spec sheets. Upload a manual or just ask a question.</p>
      </div>
    </a>

    <a href="/account/tools" class="card bg-base-100 border border-base-300/80 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div class="card-body space-y-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-primary">Documents & pricing</p>
        <h2 class="card-title">Smart Tools</h2>
        <p class="text-sm opacity-70">Your everyday helpers for pricing jobs, drafting quotes, and writing polished client marketing docs. Built for tradies who’d rather be on the tools than in the office.</p>
      </div>
    </a>
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
