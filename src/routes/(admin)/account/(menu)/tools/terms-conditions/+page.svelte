<!-- /account/tools/terms-conditions → Terms & Conditions Generator -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);

  const cleanStr = (value: string | null | undefined) => (value ?? "").trim();
  const defaultBusinessName = cleanStr(profile?.company_name);
  const defaultWebsite = cleanStr(profile?.website);

  type Trade =
    | "General"
    | "HVAC"
    | "Electrical"
    | "Plumbing"
    | "Carpentry"
    | "Tiling"
    | "Construction"
    | "Landscaping"
    | "Painting"
    | "Other";

  let businessName = defaultBusinessName;
  let businessWebsite = defaultWebsite;
  let trade: Trade = "General";
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
    trade = "Plumbing";
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
      trade,
      projectSpecificTerms,
      businessNotes,
      ...(brandContext ? { brandContext } : {})
    };

    try {
      const res = await fetch("/api/terms-conditions", {
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
  <title>Terms & Conditions Generator</title>
</svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Compliance</p>
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Terms & Conditions Generator</h1>
        <p class="max-w-3xl text-base text-gray-800">
          Tradies need more than a verbal nod. Generate detailed terms that cover scope, payment timing, variations, access, warranties, and liability so you can attach them to quotes, invoices, onboarding packs, or approval emails before work starts.
        </p>
      </div>
      <a href="/account/tools" class="btn btn-ghost self-start text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <form class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm space-y-8 sm:p-6" on:submit|preventDefault={generate}>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <label class="form-control gap-2">
        <span class="label-text">Business name</span>
        <input class="input input-bordered w-full" placeholder="e.g. Lawson Civil" bind:value={businessName} />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Website or booking link</span>
        <input class="input input-bordered w-full" placeholder="https://yourbusiness.com.au" bind:value={businessWebsite} />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Trade focus</span>
        <select class="select select-bordered w-full" bind:value={trade}>
          <option value="General">General</option>
          <option value="HVAC">HVAC</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Carpentry">Carpentry</option>
          <option value="Tiling">Tiling</option>
          <option value="Construction">Construction</option>
          <option value="Landscaping">Landscaping</option>
          <option value="Painting">Painting</option>
          <option value="Other">Other</option>
        </select>
      </label>
    </div>

    <label class="form-control gap-3">
      <div class="space-y-1">
        <span class="label-text">Project-specific terms</span>
        <p class="text-xs text-gray-500">Site quirks, staged payments, client responsibilities, or approvals to call out for this job.</p>
      </div>
      <textarea
        class="textarea textarea-bordered h-32 w-full"
        placeholder="Example: Allow one shutdown of water (max 2 hrs). Client to confirm tile selections before demo."
        bind:value={projectSpecificTerms}
      ></textarea>
    </label>

    <label class="form-control gap-3">
      <div class="space-y-1">
        <span class="label-text">Evergreen business policies</span>
        <p class="text-xs text-gray-500">Payment schedule, variation rules, licensing info, insurances, warranties, or guarantees.</p>
      </div>
      <textarea
        class="textarea textarea-bordered h-40 w-full"
        placeholder="Example: 40% deposit, balance within 5 days of completion. Variations priced in writing before work proceeds."
        bind:value={businessNotes}
      ></textarea>
    </label>

    {#if errorMessage}
      <div class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>
    {/if}

    <div class="flex flex-wrap items-center gap-3">
      <button type="submit" class="btn btn-primary" disabled={loading}>
        {#if loading}
          <span class="loading loading-dots"></span>
        {/if}
        <span>{loading ? "Drafting" : "Generate terms"}</span>
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
    <div class="p-5 sm:p-6 space-y-4">
      {#if loading && !documentText}
        <p class="text-sm text-gray-500">Building your terms…</p>
      {:else if __rich}
        <RichAnswer text={__rich} />
      {:else}
        <p class="text-sm text-gray-500">Fill out the details above and hit Generate to see your clauses.</p>
      {/if}
    </div>
  </div>
</section>
