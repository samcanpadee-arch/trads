<!-- /account/tools/material-cost → Terms & Conditions Generator -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);

  let clientName = "";
  let projectContext = "";
  let scopeSummary = "";
  let paymentStructure = "";
  let responsibilities = "";
  let variations = "";
  let additionalTerms = "";

  let loading = false;
  let errorMessage = "";
  let documentText = "";

  function useExample() {
    clientName = "Kelly Builders";
    projectContext = "Bathroom refresh at 54 Crossley St, Port Melbourne. Internal works only with access between 7am-4pm.";
    scopeSummary = [
      "Strip out existing tiles, fixtures and waterproofing",
      "Prep and waterproof floor and wet walls",
      "Supply/install tiles, trims, vanity, toilet, tapware",
      "Commission plumbing, electrical and final clean"
    ].join("\n");
    paymentStructure = "40% deposit to secure materials, 40% progress after waterproofing sign-off, 20% due within 3 days of handover. Late fees at 2% per week.";
    responsibilities = [
      "Client keeps driveway clear and pets confined",
      "Client makes tile/tapware selections by 18 May",
      "Builder manages waste removal and dust control"
    ].join("\n");
    variations = "Extras outside this scope will be priced and approved before work continues. Hourly variations billed at $95/hr + materials.";
    additionalTerms = "Quote valid 30 days. Work to NCC + AS/NZS 3500 with $20M public liability. Warranty applies per QBCC guidelines.";
  }

  async function generate(event: Event) {
    event.preventDefault();
    loading = true;
    errorMessage = "";
    documentText = "";

    const payload = {
      clientName,
      projectContext,
      scopeSummary,
      paymentStructure,
      responsibilities,
      variations,
      additionalTerms,
      ...(brandContext ? { brandContext } : {}),
    };

    try {
      const res = await fetch("/api/material-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
  <title>Terms & Conditions Generator</title>
</svelte:head>

<section class="mx-auto max-w-5xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="space-y-4">
      <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Agreements</p>
      <div class="space-y-2">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Terms & Conditions Generator</h1>
        <p class="max-w-3xl text-base text-gray-700">
          Skip the spreadsheets and draft the fine print faster. Capture the context, inclusions, and payment rules you work to,
          then let the assistant turn it into tidy terms for your clients to accept alongside your estimates or proposals.
        </p>
      </div>
      <a href="/account/tools" class="btn btn-ghost w-fit text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <form class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6" on:submit|preventDefault={generate}>
    <div class="space-y-6">
      <div class="grid gap-4 md:grid-cols-2">
        <label class="form-control gap-2">
          <span class="label-text">Client / business</span>
          <input class="input input-bordered" placeholder="e.g. Lawson Civil" bind:value={clientName} />
        </label>
        <label class="form-control gap-2 md:col-span-1">
          <span class="label-text">Project context & site</span>
          <textarea
            class="textarea textarea-bordered"
            rows="2"
            placeholder="Key location details, start windows, constraints"
            bind:value={projectContext}
          ></textarea>
        </label>
      </div>

      <label class="form-control gap-2">
        <span class="label-text">Scope & inclusions</span>
        <textarea
          class="textarea textarea-bordered"
          rows="3"
          placeholder="Bullet list of what you're delivering"
          bind:value={scopeSummary}
        ></textarea>
      </label>

      <label class="form-control gap-2">
        <span class="label-text">Payment structure</span>
        <textarea
          class="textarea textarea-bordered"
          rows="2"
          placeholder="Deposits, progress claims, due dates, late fees"
          bind:value={paymentStructure}
        ></textarea>
      </label>

      <label class="form-control gap-2">
        <span class="label-text">Responsibilities & site rules</span>
        <textarea
          class="textarea textarea-bordered"
          rows="2"
          placeholder="Access, selections, utilities, client prep, your obligations"
          bind:value={responsibilities}
        ></textarea>
      </label>

      <label class="form-control gap-2">
        <span class="label-text">Variations & extras</span>
        <textarea
          class="textarea textarea-bordered"
          rows="2"
          placeholder="How changes are approved and priced"
          bind:value={variations}
        ></textarea>
      </label>

      <label class="form-control gap-2">
        <span class="label-text">Other terms / compliance</span>
        <textarea
          class="textarea textarea-bordered"
          rows="2"
          placeholder="Licensing, warranty, insurance, dispute resolution, etc."
          bind:value={additionalTerms}
        ></textarea>
      </label>

      {#if errorMessage}
        <div class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>
      {/if}

      <div class="flex flex-wrap gap-3">
        <button type="submit" class="btn btn-primary" disabled={loading}>
          {#if loading}
            Drafting…
          {:else}
            Draft terms
          {/if}
        </button>
        <button type="button" class="btn btn-ghost" on:click={useExample} disabled={loading}>Load example</button>
      </div>

      <p class="text-xs text-gray-500">
        These terms are AI-generated. Review with your legal adviser and make sure they align with licensing and contract
        obligations before sharing with clients.
      </p>
    </div>
  </form>

  <div class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-primary">Preview</p>
        <h2 class="text-xl font-semibold text-gray-900">Terms & conditions</h2>
      </div>
      {#if documentText}
        <button class="btn btn-sm" type="button" on:click={() => navigator.clipboard?.writeText(documentText)}>
          Copy
        </button>
      {/if}
    </div>

    <div class="mt-4">
      {#if loading && !documentText}
        <p class="text-sm text-gray-500">Building your terms…</p>
      {:else if __rich}
        <RichAnswer text={__rich} />
      {:else}
        <p class="text-sm text-gray-500">Fill out the basics and generate to see your terms here.</p>
      {/if}
    </div>
  </div>
</section>
