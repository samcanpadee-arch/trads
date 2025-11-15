<!-- /account/tools/material-cost → Terms & Conditions Generator -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);

  const defaultBusinessName = (profile?.company_name ?? "").trim();
  const defaultWebsite = (profile?.website ?? "").trim();

  let businessName = defaultBusinessName;
  let businessWebsite = defaultWebsite;
  let projectSpecificTerms = "";
  let businessNotes = "";

  let loading = false;
  let errorMessage = "";
  let documentText = "";

  function useExample() {
    if (!businessName) {
      businessName = "Portside Plumbing Co.";
    }
    if (!businessWebsite) {
      businessWebsite = "portsideplumbing.com.au";
    }
    projectSpecificTerms = [
      "Project: Laundry re-fit at 12 Victoria St, Northcote",
      "Client provides clear access via rear lane between 7am-4pm",
      "Allow one shutdown of water (max 2 hrs). Notice required for extra shutdowns",
      "Tile selections finalised before demo starts"
    ].join("\n");
    businessNotes = [
      "Licensed VIC plumbers (LIC 123456) with $20M public liability",
      "Standard payment: 40% deposit, progress at rough-in, balance within 5 days of completion",
      "Variations priced in writing and approved via SMS/email before work proceeds",
      "We follow NCC + AS/NZS 3500 and warrant labour for 6 years"
    ].join("\n");
  }

  async function generate(event: Event) {
    event.preventDefault();
    loading = true;
    errorMessage = "";
    documentText = "";

    const payload = {
      businessName,
      businessWebsite,
      projectSpecificTerms,
      businessNotes,
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

<section class="mx-auto max-w-6xl space-y-10 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Compliance</p>
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Terms & Conditions Generator</h1>
        <p class="max-w-3xl text-base text-gray-700">
          Produce plain-English terms that cover scope, payment expectations, variations, warranties, access, and liability.
          We pull your business identity automatically—just add any evergreen policies plus job-specific notes when needed.
        </p>
      </div>
      <a href="/account/tools" class="btn btn-ghost self-start text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <div class="grid gap-6 lg:grid-cols-2">
    <form class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6 space-y-6" on:submit|preventDefault={generate}>
      <div class="grid gap-4 md:grid-cols-2">
        <label class="form-control gap-2">
          <span class="label-text font-semibold">Business name</span>
          <input class="input input-bordered" placeholder="e.g. Lawson Civil" bind:value={businessName} />
        </label>
        <label class="form-control gap-2">
          <span class="label-text font-semibold">Website or booking link</span>
          <input class="input input-bordered" placeholder="https://yourbusiness.com.au" bind:value={businessWebsite} />
        </label>
      </div>

      <label class="form-control gap-2">
        <span class="label-text font-semibold">Project-specific terms</span>
        <textarea
          class="textarea textarea-bordered"
          rows="3"
          placeholder="Access rules, staged payments, special responsibilities for this job"
          bind:value={projectSpecificTerms}
        ></textarea>
      </label>

      <label class="form-control gap-2">
        <span class="label-text font-semibold">General trade policies</span>
        <textarea
          class="textarea textarea-bordered"
          rows="5"
          placeholder="Payment schedule, variation rules, licensing info, insurances, warranty promises"
          bind:value={businessNotes}
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
            Generate terms
          {/if}
        </button>
        <button type="button" class="btn btn-ghost" on:click={useExample} disabled={loading}>Use example</button>
      </div>

      <div class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900">
        These terms are AI-generated. Review them with your legal adviser and confirm they match your licensing obligations
        before you send or sign anything.
      </div>
    </form>

    <div class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-xl font-semibold text-gray-900">Terms & conditions</h2>
        {#if documentText}
          <button class="btn btn-sm" type="button" on:click={() => navigator.clipboard?.writeText(documentText)}>Copy</button>
        {/if}
      </div>

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
