<!-- /account/tools/material-cost → Safety Document Assistant -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);

  type DocType = "swms" | "toolbox" | "induction";
  const docOptions: { value: DocType; label: string; helper: string }[] = [
    {
      value: "swms",
      label: "Safe Work Method Statement (SWMS)",
      helper: "Step-by-step tasks, hazards, and controls for high-risk work.",
    },
    {
      value: "toolbox",
      label: "Toolbox Talk Summary",
      helper: "Talking points for the pre-start chat and daily reminders.",
    },
    {
      value: "induction",
      label: "Site Induction Outline",
      helper: "Welcome, access, and safety expectations for new arrivals.",
    },
  ];

  let docType: DocType = "swms";
  let projectName = "";
  let siteLocation = "";
  let workDescription = "";
  let hazards = "";
  let controls = "";
  let crew = "";
  let notes = "";
  let includeSignOff = true;

  let loading = false;
  let errorMessage = "";
  let documentText = "";

  $: activeDoc = docOptions.find((d) => d.value === docType) ?? docOptions[0]!;
  $: docLabel = activeDoc.label;

  function useExample() {
    docType = "swms";
    projectName = "Switchboard upgrade – Kilsyth Workshop";
    siteLocation = "24 Holloway Dr, Kilsyth";
    workDescription =
      "Isolate existing supply, install new 3-phase switchboard, label circuits, test, and hand back to production.";
    hazards = [
      "Live electrical parts when isolations fail",
      "Working around forklifts and plant movement",
      "Manual handling of board components",
      "Working at height for cable management",
    ].join("\n");
    controls = [
      "Lock-out/tag-out with tested voltage indicators",
      "Spotter to control forklift traffic during lifts",
      "Use of lifting trolley and two-person lift for heavy gear",
      "Platform ladder with fall restraint for cable tray access",
      "PPE: arc-rated kit, safety boots, gloves, face shield",
    ].join("\n");
    crew = "Lead electrician, apprentice, client maintenance manager";
    notes = "Reference AS/NZS 3000, confirm client sign-off once testing sheets are attached.";
  }

  async function generate(event: Event) {
    event.preventDefault();
    loading = true;
    errorMessage = "";
    documentText = "";

    const payload = {
      docType,
      projectName,
      siteLocation,
      workDescription,
      hazards,
      controls,
      crew,
      notes,
      includeSignOff,
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
  <title>Safety Document Assistant</title>
</svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Compliance</p>
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Safety Document Assistant</h1>
        <p class="max-w-3xl text-base text-gray-700">
          Skip the blank Word doc. Drop in the job basics, risks, and controls and this assistant will draft a clean
          {docLabel.toLowerCase()} ready for your crew, complete with Aussie standards and sign-off reminders.
        </p>
      </div>
      <a href="/account/tools" class="btn btn-ghost self-start text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
    <form class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6" on:submit|preventDefault={generate}>
      <div class="space-y-6">
        <label class="form-control">
          <span class="label-text font-semibold">Document type</span>
          <select class="select select-bordered" bind:value={docType}>
            {#each docOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
          <span class="label-text-alt text-gray-500">{activeDoc.helper}</span>
        </label>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="form-control gap-2">
            <span class="label-text">Client / project name</span>
            <input class="input input-bordered" placeholder="e.g. Lawson Civil – Pump upgrade" bind:value={projectName} />
          </label>
          <label class="form-control gap-2">
            <span class="label-text">Site / address</span>
            <input class="input input-bordered" placeholder="Where is the work happening?" bind:value={siteLocation} />
          </label>
        </div>

        <label class="form-control gap-2">
          <span class="label-text">Scope / project brief</span>
          <textarea
            class="textarea textarea-bordered"
            rows="3"
            placeholder="Describe the work stages or main deliverables."
            bind:value={workDescription}
          ></textarea>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">Key hazards or risks</span>
          <textarea
            class="textarea textarea-bordered"
            rows="3"
            placeholder="List one per line – e.g. live electrical parts, confined space access."
            bind:value={hazards}
          ></textarea>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">Controls, PPE & procedures</span>
          <textarea
            class="textarea textarea-bordered"
            rows="3"
            placeholder="Isolation steps, PPE, permits, supervision, toolbox reminders."
            bind:value={controls}
          ></textarea>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">Crew & responsibilities</span>
          <textarea
            class="textarea textarea-bordered"
            rows="2"
            placeholder="Who is on site and what they cover."
            bind:value={crew}
          ></textarea>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">Extra notes / compliance requirements</span>
          <textarea
            class="textarea textarea-bordered"
            rows="2"
            placeholder="Permits, references to standards, client reminders, handover steps."
            bind:value={notes}
          ></textarea>
        </label>

        <label class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-sm">
          <input type="checkbox" class="checkbox checkbox-primary" bind:checked={includeSignOff} />
          <div>
            <p class="font-semibold">Include sign-off & next steps</p>
            <p class="text-gray-500">Adds a table or bullet block for supervisor sign-off and distribution.</p>
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
              Generate {docLabel.split(" ")[0]}
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
        <li>Task breakdown with hazards and controls mapped to each stage.</li>
        <li>PPE and permit reminders tailored to your notes.</li>
        <li>Toolbox talk or induction talking points with action items.</li>
        <li>Optional sign-off block so the paperwork is ready to issue.</li>
      </ul>
      <p class="mt-4 text-gray-600">
        The assistant leans on your brand details automatically so tone, business name, and web links stay consistent with your
        other documents.
      </p>
    </aside>
  </div>

  <div class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-primary">Preview</p>
        <h2 class="text-xl font-semibold text-gray-900">{docLabel}</h2>
      </div>
      {#if documentText}
        <button class="btn btn-sm" type="button" on:click={() => navigator.clipboard?.writeText(documentText)}>
          Copy
        </button>
      {/if}
    </div>

    <div class="mt-4">
      {#if loading && !documentText}
        <p class="text-sm text-gray-500">Building your document…</p>
      {:else if __rich}
        <RichAnswer text={__rich} />
      {:else}
        <p class="text-sm text-gray-500">Fill out the form and generate to see your SWMS / toolbox / induction doc here.</p>
      {/if}
    </div>
  </div>
</section>
