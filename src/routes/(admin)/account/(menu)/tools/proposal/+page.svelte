<!-- /account/tools/proposal → Scope Guard – Day Log Tool -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);

  const cleanStr = (value: string | null | undefined) => (value ?? "").trim();

  const today = new Date().toISOString().slice(0, 10);

  const keyPurpose = [
    "Record what was done, who was onsite, and any materials installed.",
    "Track weather hits, delays, or site access issues the moment they happen.",
    "Log client chats or verbal approvals so you can reference them later.",
    "Flag variations or extra work so they don’t go missing on invoices.",
    "Capture anything unusual (injuries, deliveries, defects) for dispute protection."
  ];

  let jobName = "";
  let logDate = today;
  let tradieName = cleanStr(profile?.full_name) || cleanStr(profile?.company_name);
  let summaryNotes = "";
  let issuesNotes = "";

  let loading = false;
  let errorMessage = "";
  let documentText = "";

  function useExample() {
    if (!tradieName) {
      tradieName = "Jordan Pike";
    }
    jobName = "Stage 2 switchboard upgrade – Bayview Units";
    logDate = today;
    summaryNotes = [
      "Crew of three completed rough-in on riser levels 5-6, terminated 80% of sub-mains, and labelled circuits per drawings.",
      "Weather fine, 22°C; no access issues. Client rep (M. Singh) inspected progress and confirmed finish colours.",
      "Ordered replacement isolator for Unit 6B and recorded serials for asset log."
    ].join("\n");
    issuesNotes = [
      "Delayed for 40 minutes waiting on crane window; recorded in access sheet.",
      "Client verbally requested extra EV charger allowance on Level 6 — noted as potential variation.",
      "Need follow-up photos of riser penetration fire collars tomorrow."
    ].join("\n");
  }

  async function generate(event: Event) {
    event.preventDefault();
    loading = true;
    errorMessage = "";
    documentText = "";

    const payload = {
      jobName,
      logDate,
      tradieName,
      summaryNotes,
      issuesNotes,
      ...(brandContext ? { brandContext } : {})
    };

    try {
      const res = await fetch("/api/day-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        errorMessage = await res.text();
        return;
      }

      const data = await res.json();
      const text = String(data.document || data.summary || "").trim();
      documentText = text;
      if (!text) {
        errorMessage = "The assistant returned an empty response. Try again in a moment.";
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Request failed. Please try again.";
    } finally {
      loading = false;
    }
  }

  $: __rich = documentText?.trim() || "";
</script>

<svelte:head>
  <title>Scope Guard – Day Log</title>
</svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Scope Guard</p>
          <h1 class="text-3xl font-bold leading-tight text-gray-900">Day Log Tool</h1>
        </div>
        <p class="max-w-3xl text-base text-gray-800">
          Record what actually happened. Crucial for disputes, variations, and remembering what you promised. The Day Log Tool is
          a simple, AI-enhanced daily record that captures work completed, delays, client chats, and unexpected changes so you
          can send proof, keep your team aligned, or attach it to quotes and invoices later.
        </p>
        <div class="grid gap-2 text-sm text-gray-800 md:grid-cols-2">
          {#each keyPurpose as item}
            <div class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 text-amber-600" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M9.55 17.45L4.8 12.7l1.4-1.4l3.35 3.35l8.35-8.35l1.4 1.4z"
                />
              </svg>
              <span>{item}</span>
            </div>
          {/each}
        </div>
      </div>
      <a href="/account/tools" class="btn btn-ghost self-start text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <form class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm space-y-10 sm:p-6" on:submit|preventDefault={generate}>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <label class="form-control gap-2">
        <span class="label-text">Job / site name</span>
        <input class="input input-bordered w-full" placeholder="e.g. Lot 42 coastal duplex" bind:value={jobName} />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Log date</span>
        <input type="date" class="input input-bordered w-full" bind:value={logDate} />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Tradie name</span>
        <input class="input input-bordered w-full" placeholder="Your name" bind:value={tradieName} />
      </label>
    </div>

    <div class="space-y-8">
      <label class="form-control gap-3">
        <div class="space-y-1">
          <span class="label-text">What happened onsite today?</span>
          <p class="text-xs text-gray-500">Work completed, crew on deck, deliveries, client conversations, weather notes.</p>
        </div>
        <textarea
          class="textarea textarea-bordered h-40 w-full"
          placeholder="Example: Finished decking install on levels 1-2, discussed change to balustrade finish with client, logged who signed off access..."
          bind:value={summaryNotes}
        ></textarea>
      </label>

      <label class="form-control gap-3">
        <div class="space-y-1">
          <span class="label-text">Issues, delays, variations, or risks</span>
          <p class="text-xs text-gray-500">Include scope changes, site incidents, downtime, approvals pending, or reminders for tomorrow.</p>
        </div>
        <textarea
          class="textarea textarea-bordered h-36 w-full"
          placeholder="Example: Rain delay 10-11am, verbal approval for extra conduit run, awaiting delivery docket photos..."
          bind:value={issuesNotes}
        ></textarea>
      </label>
    </div>

    {#if errorMessage}
      <div class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>
    {/if}

    <div class="flex flex-wrap items-center gap-3 pt-2">
      <button type="submit" class="btn btn-primary" disabled={loading}>
        {#if loading}
          <span class="loading loading-dots"></span>
        {/if}
        <span>{loading ? "Drafting" : "Generate day log"}</span>
      </button>
      <button type="button" class="btn" on:click={useExample} disabled={loading}>Use example</button>
      <button
        class="btn btn-ghost"
        type="button"
        on:click={() => documentText && navigator.clipboard?.writeText(documentText)}
        disabled={!documentText}
      >
        Copy
      </button>
    </div>
  </form>

  <div class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm">
    <div class="space-y-4 p-5 sm:p-6">
      {#if loading && !documentText}
        <p class="text-sm text-gray-500">Compiling your day log…</p>
      {:else if __rich}
        <RichAnswer text={__rich} />
      {:else}
        <p class="text-sm text-gray-500">Fill in the log above to produce a daily report you can save, email, or attach to job files.</p>
      {/if}
    </div>
  </div>
</section>
