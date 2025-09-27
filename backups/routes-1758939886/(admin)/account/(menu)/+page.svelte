<script lang="ts">
  import { onMount } from "svelte";

  let displayName = "";
  let hasVisited = false;

  onMount(() => {
    try {
      // Name fallback (until wired directly to profile load)
      displayName =
        (localStorage.getItem("profile.name") ||
         localStorage.getItem("profile_full_name") ||
         localStorage.getItem("name") ||
         "").trim();

      // First vs return visit
      hasVisited = localStorage.getItem("hasVisited") === "1";
      localStorage.setItem("hasVisited", "1");
    } catch {}
  });

  $: salutation = hasVisited ? "Welcome back" : "Welcome";
  $: greeting = displayName ? `${salutation}, ${displayName} 👋` : `${salutation} 👋`;
</script>

<svelte:head><title>Account</title></svelte:head>

<section class="flex flex-col gap-6">
  <!-- Hero / welcome -->
  <div class="card bg-base-100 border">
    <div class="card-body grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
      <div class="lg:col-span-2 space-y-2">
        <h1 class="text-2xl font-semibold">{greeting}</h1>
        <p class="text-sm opacity-80">
          Your AI on the tools — from site to spreadsheets. Ask for anything: job wording, pricing ideas,
          client comms, or “how do I fix this?” You’ll get clear, tradie-friendly help in minutes.
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
  <div class="flex items-center justify-between">
    <h2 class="text-base font-semibold">Your hub</h2>
    <p class="text-xs opacity-70">Everything you need in one place — quick, simple, and built for Aussie tradies.</p>
  </div>

  <!-- Existing tiles in a grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Chat -->
    <a href="/account/chat" class="card bg-base-100 border hover:shadow">
      <div class="card-body">
        <h2 class="card-title">Chat</h2>
        <p class="text-sm opacity-70">Ask anything — jobs, clients, pricing, safety, or business help.</p>
      </div>
    </a>

    <!-- AI Assistant -->
    <a href="/account/assistant" class="card bg-base-100 border hover:shadow">
      <div class="card-body">
        <h2 class="card-title">AI Assistant</h2>
        <p class="text-sm opacity-70">Agent-style help for multi-step tasks (coming soon).</p>
      </div>
    </a>

    <!-- Tools -->
    <a href="/account/caption" class="card bg-base-100 border hover:shadow">
      <div class="card-body">
        <h2 class="card-title">Tools</h2>
        <p class="text-sm opacity-70">Smart, trade-ready helpers to draft, estimate, and create client-ready docs.</p>
      </div>
    </a>
  </div>

  <!-- Support / contact -->
  <div class="card bg-base-100 border">
    <div class="card-body flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <h3 class="text-base font-semibold">Need a hand?</h3>
        <p class="text-sm opacity-80">Got a question or something not working right? We’re here to help.</p>
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
    AI can draft and speed things up, but it doesn’t replace your judgement — please review and tweak before sending.
  </p>
</section>
