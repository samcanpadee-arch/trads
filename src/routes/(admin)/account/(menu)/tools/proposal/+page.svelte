<!-- /account/tools/proposal → Scope Guard – Variation Tracker Tool -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);

  const cleanStr = (value: string | null | undefined) => (value ?? "").trim();

  const today = new Date().toISOString().slice(0, 10);

  let businessName = cleanStr(profile?.company_name);
  let projectName = "";
  let variationTitle = "";
  let changeDate = today;
  let requestedBy = "";
  let approvedBy = "";
  let costImpact = "";
  let timeImpact = "";
  let changeDescription = "";
  let evidenceNotes = "";

  let loading = false;
  let errorMessage = "";
  let documentText = "";

  function useExample() {
    if (!businessName) {
      businessName = "Coastline Electrical";
    }
    projectName = "Bayview Apartments – Level 8 fit-off";
    variationTitle = "Variation 07 – Extra balcony power & data";
    changeDate = today;
    requestedBy = "Site supervisor (L. Carter)";
    approvedBy = "Client rep (M. Singh)";
    costImpact = "+$1,850 ex GST for hardware + labour";
    timeImpact = "+0.5 day for install & testing";
    changeDescription = [
      "Client asked for two additional weatherproof GPOs and one data outlet per balcony after initial rough-in.",
      "Cable pathways already roughed in; requires extra circuit protection and testing to AS/NZS 3000.",
      "Need to coordinate balcony waterproofing cut-outs before re-seal."
    ].join("\n");
    evidenceNotes = [
      "Photo refs: IMG_2041-2044 (existing balcony feed)",
      "Variation request email 12/05 attached.",
      "Update drawings V7 issued; crew to sign SWMS amendment before works."
    ].join("\n");
  }

  async function generate(event: Event) {
    event.preventDefault();
    loading = true;
    errorMessage = "";
    documentText = "";

    const payload = {
      businessName,
      projectName,
      variationTitle,
      changeDate,
      requestedBy,
      approvedBy,
      costImpact,
      timeImpact,
      changeDescription,
      evidenceNotes,
      ...(brandContext ? { brandContext } : {})
    };

    try {
      const res = await fetch("/api/variation-tracker", {
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
  <title>Scope Guard – Variation Tracker</title>
</svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Scope Guard</p>
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Variation Tracker Tool</h1>
        <p class="max-w-3xl text-base text-gray-800">
          Log scope changes on the fly so nothing slips through. Capture what changed, who signed it off, expected time or cost impacts,
          and quick photo notes so you can attach the variation log to quotes, invoices, or client updates.
        </p>
      </div>
      <a href="/account/tools" class="btn btn-ghost self-start text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <form class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm space-y-10 sm:p-6" on:submit|preventDefault={generate}>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <label class="form-control gap-2">
        <span class="label-text">Business or crew name</span>
        <input class="input input-bordered w-full" placeholder="e.g. Lawson Civil" bind:value={businessName} />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Project / site</span>
        <input class="input input-bordered w-full" placeholder="e.g. Lot 42 – Coastal duplex" bind:value={projectName} />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Variation title</span>
        <input class="input input-bordered w-full" placeholder="e.g. Variation 04 – Extra lighting" bind:value={variationTitle} />
      </label>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
      <label class="form-control gap-2">
        <span class="label-text">Date logged</span>
        <input type="date" class="input input-bordered w-full" bind:value={changeDate} />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Raised by</span>
        <input class="input input-bordered w-full" placeholder="Client, supervisor, or team member" bind:value={requestedBy} />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Approved by</span>
        <input class="input input-bordered w-full" placeholder="Name + role" bind:value={approvedBy} />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Cost impact</span>
        <input class="input input-bordered w-full" placeholder="e.g. +$2,400 or allowance only" bind:value={costImpact} />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Time impact</span>
        <input class="input input-bordered w-full" placeholder="e.g. +1 day, no impact" bind:value={timeImpact} />
      </label>
    </div>

    <div class="space-y-8">
      <label class="form-control gap-3">
        <div class="space-y-1">
          <span class="label-text">Change description &amp; reason</span>
          <p class="text-xs text-gray-500">Explain what triggered the variation, the scope shift, and any standards or constraints involved.</p>
        </div>
        <textarea
          class="textarea textarea-bordered h-36 w-full"
          placeholder="Example: Client added two more circuits, needs new GPO locations, additional waterproofing checks..."
          bind:value={changeDescription}
        ></textarea>
      </label>

      <label class="form-control gap-3">
        <div class="space-y-1">
          <span class="label-text">Evidence, photos &amp; next steps (optional)</span>
          <p class="text-xs text-gray-500">Reference photo filenames, attached documents, site notes, or confirmation of how the change will be tracked.</p>
        </div>
        <textarea
          class="textarea textarea-bordered h-32 w-full"
          placeholder="Example: Photos IMG_2041-2044, client email dated 12/05, update SWMS & issue new plan mark-up."
          bind:value={evidenceNotes}
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
        <span>{loading ? "Drafting" : "Generate variation log"}</span>
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
        <p class="text-sm text-gray-500">Documenting the variation…</p>
      {:else if __rich}
        <RichAnswer text={__rich} />
      {:else}
        <p class="text-sm text-gray-500">Fill in the variation details above to build a clean log you can attach to client comms.</p>
      {/if}
    </div>
  </div>
</section>
