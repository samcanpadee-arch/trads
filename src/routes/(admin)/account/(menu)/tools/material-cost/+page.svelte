<!-- /account/tools/material-cost → Customer Agreement Templates -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);

  let clientName = "";
  let siteAddress = "";
  let projectBrief = "";
  let inclusions = "";
  let responsibilities = "";
  let paymentTerms = "";
  let schedule = "";
  let variations = "";
  let specialTerms = "";
  let includeSignature = true;

  let loading = false;
  let errorMessage = "";
  let documentText = "";

  function useExample() {
    clientName = "Kelly Builders";
    siteAddress = "54 Crossley St, Port Melbourne";
    projectBrief =
      "Refresh upstairs bathroom including waterproofing, tiling, new vanity and fittings. Demo, prep, install, and handover.";
    inclusions = [
      "Site protection, dust control and clean-up",
      "Demolition and disposal of existing fixtures",
      "Supply and install waterproofing, tiles, and trims",
      "Fit vanity, mirror cabinet, tapware, toilet, and accessories",
      "Final test, clean, and walkthrough",
    ].join("\n");
    responsibilities = [
      "Client to provide access between 7am-4pm and keep driveway clear",
      "Builder to handle council waste permits if required",
      "Client to choose tile/fixture selections by 18 May",
    ].join("\n");
    paymentTerms = "40% deposit to lock in materials, 40% progress after waterproofing, 20% on completion within 3 days.";
    schedule = "Estimated 12 working days once we start. Allow 2 days float for tile lead times.";
    variations = "Extras outside this scope will be discussed and priced before proceeding. Hourly variations at $95/hr + materials.";
    specialTerms = "Quote valid 30 days. Work carried out to NCC and AS/NZS 3500. Builder carries $20M public liability.";
  }

  async function generate(event: Event) {
    event.preventDefault();
    loading = true;
    errorMessage = "";
    documentText = "";

    const payload = {
      clientName,
      siteAddress,
      projectBrief,
      inclusions,
      responsibilities,
      paymentTerms,
      schedule,
      variations,
      specialTerms,
      includeSignature,
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
  <title>Customer Agreement Templates</title>
</svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Agreements</p>
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Customer Agreement Templates</h1>
        <p class="max-w-3xl text-base text-gray-700">
          Drop in the basics of the job, outline inclusions, payment milestones, and any non-negotiables. The assistant kicks
          back a tidy agreement your client can sign before you lift a tool.
        </p>
      </div>
      <a href="/account/tools" class="btn btn-ghost self-start text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
    <form class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6" on:submit|preventDefault={generate}>
      <div class="space-y-6">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="form-control gap-2">
            <span class="label-text">Client / business name</span>
            <input class="input input-bordered" placeholder="e.g. Lawson Civil" bind:value={clientName} />
          </label>
          <label class="form-control gap-2">
            <span class="label-text">Site / address</span>
            <input class="input input-bordered" placeholder="Where the work happens" bind:value={siteAddress} />
          </label>
        </div>

        <label class="form-control gap-2">
          <span class="label-text">Project brief</span>
          <textarea
            class="textarea textarea-bordered"
            rows="3"
            placeholder="Short rundown of what you're delivering."
            bind:value={projectBrief}
          ></textarea>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">Inclusions & deliverables</span>
          <textarea
            class="textarea textarea-bordered"
            rows="3"
            placeholder="List the work you're responsible for, one line each."
            bind:value={inclusions}
          ></textarea>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">Client responsibilities / prep</span>
          <textarea
            class="textarea textarea-bordered"
            rows="3"
            placeholder="Access, selections, utilities, decisions, permits, etc."
            bind:value={responsibilities}
          ></textarea>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">Payment terms</span>
          <textarea
            class="textarea textarea-bordered"
            rows="2"
            placeholder="Deposits, progress claims, due dates, late fees."
            bind:value={paymentTerms}
          ></textarea>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">Schedule / expected timeframes</span>
          <textarea
            class="textarea textarea-bordered"
            rows="2"
            placeholder="When you start, how long it takes, contingencies."
            bind:value={schedule}
          ></textarea>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">Variations & exclusions</span>
          <textarea
            class="textarea textarea-bordered"
            rows="2"
            placeholder="How you'll price changes, items not included."
            bind:value={variations}
          ></textarea>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">Special terms / compliance</span>
          <textarea
            class="textarea textarea-bordered"
            rows="2"
            placeholder="Warranty info, insurance, licensing, other conditions."
            bind:value={specialTerms}
          ></textarea>
        </label>

        <label class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-sm">
          <input type="checkbox" class="checkbox checkbox-primary" bind:checked={includeSignature} />
          <div>
            <p class="font-semibold">Add sign-off panel</p>
            <p class="text-gray-500">Adds a ready-to-sign acknowledgement for both parties.</p>
          </div>
        </label>

        {#if errorMessage}
          <div class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>
        {/if}

        <div class="flex flex-wrap gap-3">
          <button type="submit" class="btn btn-primary" disabled={loading}>
            {#if loading}
              Generating…
            {:else}
              Draft agreement
            {/if}
          </button>
          <button type="button" class="btn btn-ghost" on:click={useExample} disabled={loading}>
            Load example
          </button>
        </div>
      </div>
    </form>

    <aside class="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-5 text-sm text-gray-700 shadow-sm">
      <h2 class="text-base font-semibold text-primary">What you get</h2>
      <ul class="mt-3 space-y-2 list-disc pl-4">
        <li>Plain-English summary of the job, inclusions, and responsibilities.</li>
        <li>Clear payment milestones, timeline expectations, and variation rules.</li>
        <li>Terms and conditions that echo Aussie standards and licensing duties.</li>
        <li>Optional signature panel so you can lock it in straight away.</li>
      </ul>
      <p class="mt-4 text-gray-600">
        The copy automatically leans on your brand profile so tone, business name, and links feel like the rest of your docs.
      </p>
    </aside>
  </div>

  <div class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-primary">Preview</p>
        <h2 class="text-xl font-semibold text-gray-900">Customer agreement</h2>
      </div>
      {#if documentText}
        <button class="btn btn-sm" type="button" on:click={() => navigator.clipboard?.writeText(documentText)}>
          Copy
        </button>
      {/if}
    </div>

    <div class="mt-4">
      {#if loading && !documentText}
        <p class="text-sm text-gray-500">Building your agreement…</p>
      {:else if __rich}
        <RichAnswer text={__rich} />
      {:else}
        <p class="text-sm text-gray-500">Fill out the form and generate to see your agreement here.</p>
      {/if}
    </div>
  </div>
</section>
