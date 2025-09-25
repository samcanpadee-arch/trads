<!-- /account/caption/proposal -->
<script lang="ts">
  // === State ===
  let model = "gpt-4o-mini";
  let output = "";
  let loading = false;

  // Company / job info
  let companyName = "";
  let abn = "";
  let contactName = "";
  let contactEmail = "";
  let phone = "";

  let clientName = "";
  let projectTitle = "";
  let siteAddress = "";

  // Scope & details
  let brief = "";
  let scopeItems = "";
  let materials = "";
  let labourNotes = "";
  let exclusions = "";
  let extraNotes = "";

  // Timelines & milestones
  let startDate = "";
  let durationWeeks: number | "" = "";
  let milestones = "";

  // Pricing prefs
  let currency = "AUD";
  let includeGST = true;
  let gstRate = 0.10; // 10% AU GST
  let warranty = "2-year workmanship warranty on all completed works. Manufacturer warranties apply per product.";
  let paymentTerms = "50% deposit, 40% mid-way, 10% on completion (7-day terms).";

  // Voice & format
  let tone: "professional" | "friendly" | "formal" | "straightforward" = "professional";
  let brandVoice = "";
  let includeCoverLetter = true;
  let includeAcceptance = true;

  // Helpers
  const example = () => {
    companyName = "BrightBuild Renovations";
    abn = "12 345 678 910";
    contactName = "Sam Taylor";
    contactEmail = "estimates@brightbuild.au";
    phone = "0400 123 456";
    clientName = "Jordan Moore";
    projectTitle = "Kitchen Renovation – 5m x 4m";
    siteAddress = "12 Rivergum Rd, Brunswick VIC 3056";
    brief = "Demolish existing kitchen, new cabinetry, stone benchtops, splashback tiling, electrical & plumbing rough-ins, appliance install. Remove debris and clean.";
    scopeItems = "- Site prep & protection\n- Demolition & disposal\n- Cabinetry install\n- Benchtops & splashback tiling\n- Electrical rough-in & fitoff\n- Plumbing rough-in & fitoff\n- Appliance install\n- Finishing & clean";
    materials = "- 20mm engineered stone benchtop\n- Ceramic subway tiles 75x300mm\n- Soft-close hinges & runners\n- LED downlights x6\n- GPOs x4\n- Mixer tap & sink";
    labourNotes = "Two carpenters, one electrician, one plumber as needed. Licensed trades only.";
    exclusions = "Structural changes, asbestos removal, painting, appliance supply.";
    extraNotes = "Work hours Mon–Fri 7am–4pm. Client to clear access to area prior to start.";
    startDate = "2025-10-20";
    durationWeeks = 3;
    milestones = "- Week 1: Demo + rough-ins\n- Week 2: Cabinets + benchtops\n- Week 3: Tiling + fitoffs + clean";
    warranty = "2-year workmanship warranty. Manufacturer warranties per product. Fair wear/tear excluded.";
    paymentTerms = "40% deposit, 40% mid-way, 20% on completion (7-day terms).";
    tone = "professional";
    brandVoice = "Clear, punctual, no fluff. Focus on reliability and tidy workmanship.";
    includeCoverLetter = true;
    includeAcceptance = true;
  };

  function mdEsc(s: string) { return (s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function buildUserContent() {
    return [
      `COMPANY`,
      `- Name: ${companyName || "N/A"}`,
      `- ABN: ${abn || "N/A"}`,
      `- Contact: ${contactName || "N/A"} | ${contactEmail || "N/A"} | ${phone || "N/A"}`,
      ``,
      `CLIENT & PROJECT`,
      `- Client: ${clientName || "N/A"}`,
      `- Project: ${projectTitle || "N/A"}`,
      `- Site: ${siteAddress || "N/A"}`,
      ``,
      `BRIEF`,
      mdEsc(brief || "N/A"),
      ``,
      `SCOPE OF WORKS (bulleted)`,
      mdEsc(scopeItems || "N/A"),
      ``,
      `MATERIALS (bulleted)`,
      mdEsc(materials || "N/A"),
      ``,
      `LABOUR NOTES`,
      mdEsc(labourNotes || "N/A"),
      ``,
      `MILESTONES`,
      mdEsc(milestones || "N/A"),
      ``,
      `TIMELINE`,
      `- Target start: ${startDate || "TBA"}`,
      `- Duration (weeks): ${durationWeeks || "TBA"}`,
      ``,
      `PRICING SETTINGS`,
      `- Currency: ${currency}`,
      `- GST: ${includeGST ? `Include at ${(gstRate*100).toFixed(0)}% (AU)` : "Exclude GST"}`,
      ``,
      `TERMS`,
      `- Payment terms: ${paymentTerms || "TBA"}`,
      `- Warranty: ${warranty || "TBA"}`,
      `- Exclusions: ${mdEsc(exclusions || "None")}`,
      ``,
      `VOICE`,
      `- Tone: ${tone}`,
      `- Brand voice: ${mdEsc(brandVoice || "N/A")}`,
      ``,
      `EXTRA NOTES`,
      mdEsc(extraNotes || "None")
    ].join("\n");
  }

  const SYSTEM_PROMPT = `You are an AI consultant for Aussie trades. Produce a comprehensive **project proposal** in clean Markdown for a tradie to send to a client. The proposal must be structured with the following sections and headings:

1. Cover Letter (only if requested)
2. Project Overview
3. Scope of Works (bulleted)
4. Materials & Inclusions (bulleted)
5. Exclusions (bulleted)
6. Timeline & Milestones (with dates if provided; otherwise relative timing)
7. Pricing & Cost Breakdown (materials vs labour). If GST is included, show subtotal, GST amount, and total in AUD.
8. Warranty & Guarantees
9. Payment Terms
10. Acceptance & Next Steps (signature block) (only if requested)

Rules:
- Write in Australian English.
- Use the provided tone/brand voice.
- Keep language clear and client-friendly (no jargon).
- Use tables where helpful for cost breakdowns.
- If information is missing, make sensible placeholders and clearly mark them (e.g., "_TBA_").
- Currency must be ${currency}; if GST is included, calculate GST as ${(gstRate*100).toFixed(0)}% on subtotal and show a 3-line summary: Subtotal / GST / Total (AUD).
- Do NOT include system/user prompts in the output. Output only the final proposal in Markdown.`;

  async function onGenerate(e: Event) {
    e.preventDefault();
    output = "";
    loading = true;

    // Build the messages payload
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserContent() }
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages })
      });

      if (!res.ok || !res.body) {
        output = `Failed to generate. HTTP ${res.status}`;
        loading = false;
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        output += decoder.decode(chunk.value);
      }
    } catch (err) {
      output = "Error generating proposal. " + (err as Error).message;
    } finally {
      loading = false;
    }
  }

  async function copyOut() {
    try {
      await navigator.clipboard.writeText(output || "");
    } catch {}
  }

  function downloadOut() {
    const blob = new Blob([output || ""], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const titleSlug = (projectTitle || "proposal").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.download = `${titleSlug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetForm() {
    companyName = abn = contactName = contactEmail = phone = "";
    clientName = projectTitle = siteAddress = "";
    brief = scopeItems = materials = labourNotes = exclusions = extraNotes = "";
    startDate = "";
    durationWeeks = "";
    milestones = "";
    currency = "AUD";
    includeGST = true;
    gstRate = 0.10;
    warranty = "2-year workmanship warranty on all completed works. Manufacturer warranties apply per product.";
    paymentTerms = "50% deposit, 40% mid-way, 10% on completion (7-day terms).";
    tone = "professional";
    brandVoice = "";
    includeCoverLetter = true;
    includeAcceptance = true;
  }
</script>

<svelte:head><title>Proposal Builder</title></svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-start justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold">Proposal Builder</h1>
      <p class="text-sm opacity-70">Generate a polished, client-ready proposal with cost breakdowns and milestones.</p>
    </div>
    <a href="/account/caption" class="btn btn-ghost">← Back</a>
  </header>

  <!-- Form -->
  <form class="grid grid-cols-1 gap-4 lg:grid-cols-3" on:submit={onGenerate}>
    <!-- Left column: Company & Client -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body gap-3">
        <h2 class="card-title text-base">Company</h2>
        <div class="grid grid-cols-1 gap-3">
          <label class="form-control"><span class="label-text">Company name</span><input class="input input-bordered" bind:value={companyName} /></label>
          <label class="form-control"><span class="label-text">ABN</span><input class="input input-bordered" bind:value={abn} /></label>
          <label class="form-control"><span class="label-text">Contact name</span><input class="input input-bordered" bind:value={contactName} /></label>
          <label class="form-control"><span class="label-text">Contact email</span><input type="email" class="input input-bordered" bind:value={contactEmail} /></label>
          <label class="form-control"><span class="label-text">Phone</span><input class="input input-bordered" bind:value={phone} /></label>
        </div>

        <div class="divider my-2"></div>

        <h2 class="card-title text-base">Client & Project</h2>
        <div class="grid grid-cols-1 gap-3">
          <label class="form-control"><span class="label-text">Client name</span><input class="input input-bordered" bind:value={clientName} /></label>
          <label class="form-control"><span class="label-text">Project title</span><input class="input input-bordered" bind:value={projectTitle} placeholder="e.g., Kitchen Renovation – 5m x 4m" /></label>
          <label class="form-control"><span class="label-text">Site address</span><input class="input input-bordered" bind:value={siteAddress} /></label>
        </div>
      </div>
    </div>

    <!-- Middle column: Scope -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body gap-3">
        <h2 class="card-title text-base">Scope & Details</h2>
        <label class="form-control"><span class="label-text">Brief / context</span><textarea class="textarea textarea-bordered h-24" bind:value={brief}></textarea></label>
        <label class="form-control"><span class="label-text">Scope of works (bulleted)</span><textarea class="textarea textarea-bordered h-28" bind:value={scopeItems} placeholder="- Task 1\n- Task 2"></textarea></label>
        <label class="form-control"><span class="label-text">Materials & inclusions (bulleted)</span><textarea class="textarea textarea-bordered h-24" bind:value={materials}></textarea></label>
        <label class="form-control"><span class="label-text">Labour notes</span><textarea class="textarea textarea-bordered h-20" bind:value={labourNotes}></textarea></label>
        <label class="form-control"><span class="label-text">Exclusions (bulleted)</span><textarea class="textarea textarea-bordered h-20" bind:value={exclusions} placeholder="- Painting\n- Appliance supply"></textarea></label>
        <label class="form-control"><span class="label-text">Extra notes</span><textarea class="textarea textarea-bordered h-20" bind:value={extraNotes}></textarea></label>
      </div>
    </div>

    <!-- Right column: Timing, Pricing, Voice -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body gap-3">
        <h2 class="card-title text-base">Timeline & Milestones</h2>
        <div class="grid grid-cols-1 gap-3">
          <label class="form-control"><span class="label-text">Target start date</span><input type="date" class="input input-bordered" bind:value={startDate} /></label>
          <label class="form-control"><span class="label-text">Duration (weeks)</span><input type="number" min="1" class="input input-bordered" bind:value={durationWeeks} /></label>
          <label class="form-control"><span class="label-text">Milestones (bulleted)</span><textarea class="textarea textarea-bordered h-24" bind:value={milestones} placeholder="- Week 1: …\n- Week 2: …"></textarea></label>
        </div>

        <div class="divider my-2"></div>

        <h2 class="card-title text-base">Pricing</h2>
        <div class="grid grid-cols-1 gap-3">
          <label class="form-control"><span class="label-text">Currency</span>
            <select class="select select-bordered" bind:value={currency} aria-label="Currency">
              <option value="AUD">AUD</option>
              <option value="NZD">NZD</option>
            </select>
          </label>
          <label class="label cursor-pointer justify-start gap-3">
            <input type="checkbox" class="checkbox" bind:checked={includeGST} />
            <span class="label-text">Include GST ({(gstRate*100).toFixed(0)}%)</span>
          </label>
          <label class="form-control"><span class="label-text">Payment terms</span><input class="input input-bordered" bind:value={paymentTerms} /></label>
          <label class="form-control"><span class="label-text">Warranty</span><textarea class="textarea textarea-bordered h-20" bind:value={warranty}></textarea></label>
        </div>

        <div class="divider my-2"></div>

        <h2 class="card-title text-base">Voice & Format</h2>
        <div class="grid grid-cols-1 gap-3">
          <label class="form-control"><span class="label-text">Tone</span>
            <select class="select select-bordered" bind:value={tone} aria-label="Tone">
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="straightforward">Straightforward</option>
              <option value="formal">Formal</option>
            </select>
          </label>
          <label class="form-control"><span class="label-text">Brand voice notes</span><textarea class="textarea textarea-bordered h-20" bind:value={brandVoice} placeholder="E.g., concise, no fluff; emphasise punctuality and clean workmanship."></textarea></label>

          <label class="label cursor-pointer justify-start gap-3">
            <input type="checkbox" class="checkbox" bind:checked={includeCoverLetter} />
            <span class="label-text">Include a short Cover Letter</span>
          </label>

          <label class="label cursor-pointer justify-start gap-3">
            <input type="checkbox" class="checkbox" bind:checked={includeAcceptance} />
            <span class="label-text">Include an Acceptance & Next Steps section</span>
          </label>
        </div>

        <div class="mt-2 flex flex-wrap items-center gap-2">
          <button class="btn btn-primary" type="submit" disabled={loading}>
            {#if loading}<span class="loading loading-dots"></span>{/if}
            <span>Generate</span>
          </button>
          <button class="btn btn-outline" type="button" on:click={example}>Fill example</button>
          <button class="btn btn-ghost" type="button" on:click={resetForm}>Reset</button>
        </div>
      </div>
    </div>
  </form>

  <!-- Output -->
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <div class="flex items-center justify-between gap-2">
        <h2 class="card-title text-base">Output (Markdown)</h2>
        <div class="flex gap-2">
          <button class="btn btn-sm" type="button" on:click={copyOut} disabled={!output}>Copy</button>
          <button class="btn btn-sm btn-outline" type="button" on:click={downloadOut} disabled={!output}>Download .md</button>
        </div>
      </div>
      <pre class="whitespace-pre-wrap text-sm">{output}</pre>
    </div>
  </div>
</section>
