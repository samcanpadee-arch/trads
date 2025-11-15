<!-- /account/tools/job-estimation (v4.0 — streamlined text-first estimator) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);

  let clientName = "";
  let siteAddress = "";
  let projectBrief = ""; // drives AI (overview/scope/assumptions/risks/timeline)
  let costsText = "";
  let adjustmentsText = "";

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
  let trade: Trade = "General";

  let includeGST = true;
  let gstRate = 0.1;
  let gstRateInput = 10;
  let validityDays = 30;

  let output = "";
  let loading = false;

  type ParsedEntry = { label: string; amount: number };
  type ParsedBlock = { entries: ParsedEntry[]; notes: string[] };

  function toNumber(n: unknown, d = 0) {
    const cleaned = typeof n === "string" ? n : String(n ?? "");
    const x = Number(cleaned.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(x) ? x : d;
  }
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 2
    }).format(n || 0);

  function randomRef() {
    const d = new Date();
    const ymd =
      d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0");
    const tail = Math.floor(Math.random() * 9000 + 1000);
    return `Q-${ymd}-${tail}`;
  }

  function deriveTitle(brief: string) {
    const clean = (brief || "").replace(/\s+/g, " ").trim();
    if (!clean) return "Job Estimate";
    const firstSentence = clean.split(/(?<=[.!?])\s+/)[0] || clean;
    const words = firstSentence.split(" ");
    let out = words.slice(0, 20).join(" ");
    let opens = (out.match(/\(/g) || []).length;
    let closes = (out.match(/\)/g) || []).length;
    let i = 20;
    while (opens > closes && i < Math.min(words.length, 28)) {
      out += " " + words[i++];
      opens = (out.match(/\(/g) || []).length;
      closes = (out.match(/\)/g) || []).length;
    }
    return out.replace(/[.!?]+$/, "");
  }

  function parseLabelledAmounts(text: string): ParsedBlock {
    const entries: ParsedEntry[] = [];
    const notes: string[] = [];
    (text || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .forEach((line) => {
        if (!line) return;
        const [first, ...rest] = line.split(":");
        if (rest.length) {
          const label = first.trim();
          const amountStr = rest.join(":").trim();
          const amount = toNumber(amountStr, NaN);
          if (label && amountStr && Number.isFinite(amount)) {
            entries.push({ label, amount });
            return;
          }
        }
        notes.push(line);
      });
    return { entries, notes };
  }

  let parsedCosts: ParsedBlock = { entries: [], notes: [] };
  let parsedAdjustments: ParsedBlock = { entries: [], notes: [] };
  $: parsedCosts = parseLabelledAmounts(costsText);
  $: parsedAdjustments = parseLabelledAmounts(adjustmentsText);

  $: {
    const pct = Math.min(100, Math.max(0, Number(gstRateInput) || 0));
    if (pct !== gstRateInput) {
      gstRateInput = pct;
    }
    gstRate = pct / 100;
  }

  $: baseCostsTotal = parsedCosts.entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  $: adjustmentsTotal = parsedAdjustments.entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  $: clientSubtotal = baseCostsTotal + adjustmentsTotal;
  $: gst = includeGST ? clientSubtotal * (gstRate || 0) : 0;
  $: grandTotal = clientSubtotal + gst;

  const exampleCosts = `Materials supply: $10,500
Labour crew (40 hrs): $6,400
Equipment hire: $950
Contingency: $750
Markup: 12%`;

  const exampleAdjustments = `Provisional sum — switchboard tidy: $650
Risk allowance — hidden services: $400
Client note: Access via rear lane only for deliveries`;

  function useExample() {
    clientName = "Jordan Moore";
    siteAddress = "12 Rivergum Rd, Brunswick VIC 3056";
    trade = "Electrical";
    projectBrief =
      "Remove and replace two existing split systems (7.1kW) in lounge and master. Reuse circuits if compliant; allow minor switchboard tidy-up. Patch penetrations and leave clean.";
    costsText = exampleCosts;
    adjustmentsText = exampleAdjustments;
  }

  function resetAll() {
    clientName = "";
    siteAddress = "";
    projectBrief = "";
    costsText = "";
    adjustmentsText = "";
    trade = "General";
    includeGST = true;
    gstRateInput = 10;
    validityDays = 30;
    output = "";
  }

  function copyOut() {
    try {
      navigator.clipboard.writeText(output || "");
    } catch (error) {
      console.error("copy failed", error);
    }
  }

  type LabourRow = { role: string; hours: number; rate: number };

  /************ AI helper ************/
  async function aiSections(): Promise<{
    overview: string;
    scope: string[];
    assumptions: string[];
    exclusions: string[];
    risks: string[];
    timeline: string[];
    options: string[];
    labourSuggest: LabourRow[];
  }> {
    const SYSTEM = `You are an AI assistant for Australian tradies. Reply in Australian English.
Return ONLY JSON with keys and detailed content:
- overview: string (≈150–220 words; friendly, client-facing; mention specifics from the brief; explain approach, quality and compliance)
- scope: string[] (8–12 bullets; each a full, concrete sentence tailored to the trade & brief)
- assumptions: string[] (6–10 realistic assumptions)
- exclusions: string[] (4–8 clear boundaries)
- risks: string[] (4–8 items; flag unknowns and site-dependent factors)
- timeline: string[] (4–6 milestones; each with a short helpful description)
- options: string[] (3–6 value-adding items NOT included; e.g., preventative maintenance, minor upgrades, extended warranty)
- labourSuggest: {role,hours,rate}[] (only if useful; else [])
Keep content practical and specific; avoid generic fluff.`;

    const parsedCostLines = parsedCosts.entries
      .map((entry) => `${entry.label}: ${fmt(entry.amount)}`)
      .join("\n");
    const parsedAdjustmentLines = parsedAdjustments.entries
      .map((entry) => `${entry.label}: ${fmt(entry.amount)}`)
      .join("\n");

    const user =
      "Trade: " +
      trade +
      "\n" +
      "Brief: " +
      (projectBrief || "N/A") +
      "\n\n" +
      "Costs text (raw):\n" +
      (costsText || "N/A") +
      "\n\n" +
      (parsedCostLines ? `Parsed cost lines:\n${parsedCostLines}\n\n` : "") +
      "Adjustments text (raw):\n" +
      (adjustmentsText || "N/A") +
      "\n\n" +
      (parsedAdjustmentLines ? `Parsed adjustments:\n${parsedAdjustmentLines}\n\n` : "") +
      `Totals before GST: ${fmt(clientSubtotal)}; Include GST: ${includeGST ? "Yes" : "No"}` +
      (brandContext ? `\nBusiness context:\n${brandContext}` : "");

    let text = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: user }
          ]
        })
      });
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let finished = false;
        while (!finished) {
          const { done, value } = await reader.read();
          finished = Boolean(done);
          if (value) {
            text += decoder.decode(value);
          }
        }
      }
    } catch (error) {
      console.error("job-estimation request failed", error);
    }

    try {
      const j = JSON.parse(text);
      return {
        overview: typeof j.overview === "string" ? j.overview : "",
        scope: Array.isArray(j.scope) ? j.scope.slice(0, 12).map(String) : [],
        assumptions: Array.isArray(j.assumptions)
          ? j.assumptions.slice(0, 10).map(String)
          : [],
        exclusions: Array.isArray(j.exclusions)
          ? j.exclusions.slice(0, 8).map(String)
          : [],
        risks: Array.isArray(j.risks) ? j.risks.slice(0, 8).map(String) : [],
        timeline: Array.isArray(j.timeline)
          ? j.timeline.slice(0, 6).map(String)
          : [],
        options: Array.isArray(j.options)
          ? j.options.slice(0, 6).map(String)
          : [],
        labourSuggest: Array.isArray(j.labourSuggest)
          ? j.labourSuggest.map((r: Record<string, unknown>) => ({
              role: String(r.role || ""),
              hours: toNumber(r.hours, 0),
              rate: toNumber(r.rate, 0)
            }))
          : []
      };
    } catch (error) {
      console.warn("job-estimation parse failed", error);
      return {
        overview: "",
        scope: [],
        assumptions: [],
        exclusions: [],
        risks: [],
        timeline: [],
        options: [],
        labourSuggest: []
      };
    }
  }

  async function generate(e: Event) {
    e.preventDefault();
    loading = true;

    const ai = await aiSections();
    const usingAISuggestedLabour = ai.labourSuggest.length > 0;
    const title = deriveTitle(projectBrief);
    const quoteRef = randomRef();

    const assumptions =
      ai.assumptions && ai.assumptions.length
        ? ai.assumptions
        : [
            "Standard working hours Mon–Fri; clear access assumed.",
            "Work to current Australian Standards; licenses as required.",
            "Quoted items and quantities are based on the brief and may be adjusted at site verification.",
            "Customer to confirm colours, finishes and final placement before works commence.",
            "Any hidden conditions may affect scope, timing and price.",
            "Waste removal limited to trade-related offcuts and packaging unless noted."
          ];
    const exclusions =
      ai.exclusions && ai.exclusions.length
        ? ai.exclusions
        : [
            "Structural alterations unless specified.",
            "Asbestos testing/removal.",
            "Painting or patching beyond small penetrations caused by our works.",
            "Council permits or engineering unless listed."
          ];
    const timeline =
      ai.timeline && ai.timeline.length
        ? ai.timeline
        : [
            "Scheduling & prep — confirm selections, access and set-down areas.",
            "Core works — carry out installation and coordinate any dependencies.",
            "Testing & tidy — verify performance, safety and finish; clean the site.",
            "Handover — brief operation/maintenance and confirm you’re happy."
          ];

    const baseTasks: Record<Trade, string[]> = {
      General: [
        "Prepare the work area safely and confirm access details with you before starting.",
        "Carry out the core works per the brief, coordinating any sequencing with other trades.",
        "Keep the site tidy and minimise disruption throughout the works.",
        "Conduct quality checks and confirm the result meets your expectations.",
        "Provide a concise handover once complete, including basic care instructions."
      ],
      HVAC: [
        "Confirm indoor/outdoor unit placement for efficient airflow, drainage and service access.",
        "Install refrigeration pipework and condensate management to manufacturer guidelines.",
        "Coordinate electrical requirements and test power, isolation and controls.",
        "Pressure test, evacuate and commission the system for performance and safety.",
        "Provide a handover covering operation, filter care and warranty notes."
      ],
      Electrical: [
        "Plan cable routes and confirm protective devices, RCD coverage and labelling.",
        "Complete rough-in with correct fixing, clearances and segregation where required.",
        "Fit-off devices, terminate neatly and label circuits for traceability.",
        "Test and verify to AS/NZS standards and prepare compliance documentation.",
        "Provide a clean handover and explain device operation where needed."
      ],
      Plumbing: [
        "Confirm fixture locations and set-outs against the brief and site constraints.",
        "Complete rough-in with correct pipe selection, support and isolation points.",
        "Fit-off fixtures, seal correctly and test for leaks and correct operation.",
        "Comply with relevant standards and complete any required certification.",
        "Provide a tidy handover and maintenance notes where appropriate."
      ],
      Carpentry: [
        "Set out and prepare framing or fixings to suit the design and site conditions.",
        "Install components accurately, allowing for tolerances and finishing details.",
        "Coordinate with other trades to avoid clashes, particularly in wet areas.",
        "Finish surfaces, alignments and hardware neatly and securely.",
        "Leave the site clean and ready for following trades or handover."
      ],
      Tiling: [
        "Prepare surfaces to achieve the right fall, adhesion and waterproofing compatibility.",
        "Lay tiles to pattern with accurate alignment and spacing for clean lines.",
        "Grout and seal as specified, ensuring a consistent, durable finish.",
        "Address edges, trims and penetrations neatly with appropriate detailing.",
        "Clean down and provide care notes for grout and seal maintenance."
      ],
      Construction: [
        "Carry out set-out and any temporary works required for safe progress.",
        "Complete structural and architectural elements per plans and standards.",
        "Coordinate inspections and hold points for quality and compliance.",
        "Finish surfaces and fittings neatly and prepare for handover.",
        "Manage waste and leave the site secure and tidy."
      ],
      Landscaping: [
        "Prepare the area, levels and edging for the specified planting and hardscape.",
        "Install hardscape elements with correct falls, bedding and compaction.",
        "Plant selection and placement per plan, with appropriate soil and irrigation.",
        "Finish with mulch, edging and tidy boundaries.",
        "Provide basic care and irrigation guidance on handover."
      ],
      Painting: [
        "Prepare surfaces, repair defects and mask adjoining finishes for clean lines.",
        "Apply undercoats and topcoats to manufacturer specs and even coverage.",
        "Cut-in carefully and maintain consistent finish across surfaces.",
        "Address touch-ups and final checks with you present where practical.",
        "Leave the site clean and remove masking and waste."
      ],
      Other: [
        "Prepare the work area safely and confirm access before starting.",
        "Carry out the core works per the brief to an agreed finish.",
        "Coordinate with other trades to avoid clashes and delays.",
        "Check quality throughout and rectify issues promptly.",
        "Provide a short handover and care notes."
      ]
    };
    const scopeList = ai.scope && ai.scope.length ? ai.scope : baseTasks[trade];

    let md = "";
    md += `# Proposal & Estimate\n\n`;
    md += `**Quote Ref:** ${quoteRef}  \n`;
    md += `**To:** ${clientName || "_Client_"}  \n`;
    md += `**Site:** ${siteAddress || "_Site Address_"}  \n`;
    md += `**Project:** ${title}  \n`;
    md += `**Estimate Valid For:** ${validityDays} days\n\n`;

    md += `## Overview\n\n`;
    if (ai.overview) {
      md += ai.overview.trim() + `\n\n`;
    } else {
      md += `We propose to complete the requested works as described in your brief, focusing on compliance, tidy workmanship and clear communication. This estimate doubles as your full proposal with a detailed scope, indicative timeline and pricing, subject to final site verification.\n\n`;
    }

    md += `## Scope / Services\n\n`;
    md += `| # | Task Description |\n|---|------------------|\n`;
    scopeList.forEach((t, i) => {
      md += `| ${i + 1} | ${String(t)} |\n`;
    });
    md += `\n`;

    md += `## Costs & Allowances\n\n`;
    if (parsedCosts.entries.length) {
      md += `| Item | Amount (AUD) |\n|------|--------------:|\n`;
      parsedCosts.entries.forEach((entry) => {
        md += `| ${entry.label} | ${fmt(entry.amount)} |\n`;
      });
      md += `\n**Costs subtotal:** ${fmt(baseCostsTotal)}\n\n`;
    } else {
      md += `_List materials, labour, plant hire, markup or other allowances above to keep pricing transparent._\n\n`;
    }
    if (parsedCosts.notes.length) {
      md += `**Notes:**\n` + parsedCosts.notes.map((n) => `- ${n}`).join("\n") + `\n\n`;
    }

    if (parsedAdjustments.entries.length || parsedAdjustments.notes.length) {
      md += `## Adjustments & Notes\n\n`;
      if (parsedAdjustments.entries.length) {
        md += `| Item | Amount (AUD) |\n|------|--------------:|\n`;
        parsedAdjustments.entries.forEach((entry) => {
          md += `| ${entry.label} | ${fmt(entry.amount)} |\n`;
        });
        md += `\n`;
      }
      if (parsedAdjustments.notes.length) {
        md += parsedAdjustments.notes.map((n) => `- ${n}`).join("\n") + `\n\n`;
      }
    }

    if (usingAISuggestedLabour && ai.labourSuggest.length) {
      md += `## Suggested Labour Mix\n\n`;
      md += `| Role | Hours | Rate |\n|------|------:|-----:|\n`;
      ai.labourSuggest.forEach((row) => {
        md += `| ${row.role || "-"} | ${row.hours || 0} | ${fmt(row.rate || 0)} |\n`;
      });
      md += `\n`;
    }

    md += `## Assumptions & Exclusions\n\n`;
    md += `**Assumptions**\n\n` + assumptions.map((a) => `- ${a}`).join("\n") + `\n\n`;
    md += `**Exclusions**\n\n` + exclusions.map((a) => `- ${a}`).join("\n") + `\n\n`;

    if (ai.options && ai.options.length) {
      md += `## Additional Options (not included)\n\n`;
      md += ai.options.map((o) => `- ${o}`).join("\n") + `\n\n`;
    }

    if (ai.risks && ai.risks.length) {
      md += `## Risks & Notes (review)\n\n`;
      md += ai.risks.map((r) => `- ${r}`).join("\n") + `\n\n`;
    }

    md += `## Timeline (indicative)\n\n`;
    md += timeline.map((t) => `- ${t}`).join("\n") + `\n\n`;

    md += `## Summary & Totals\n\n`;
    md += `| Description | Amount |\n|-------------|-------:|\n`;
    md += `| Costs & Allowances | ${fmt(baseCostsTotal)} |\n`;
    md += `| Adjustments | ${fmt(adjustmentsTotal)} |\n`;
    md += `| **Subtotal** | **${fmt(clientSubtotal)}** |\n`;
    if (includeGST) md += `| **GST (${(gstRate * 100).toFixed(0)}%)** | **${fmt(gst)}** |\n`;
    md += `| **Total (AUD)** | **${fmt(grandTotal)}** |\n\n`;

    md += `## Payment Terms & Acceptance\n\n`;
    md += `**Estimate validity:** ${validityDays} days from the date of issue. After this period, pricing and availability of materials and labour may be subject to change. \n`;
    md += `**Payment terms:** A deposit is required to confirm your booking and secure materials. The remaining balance is payable once the job is completed, unless other arrangements have been agreed to in writing. Payment can be made by bank transfer, EFT, or another approved method.  \n`;
    md += `**Warranty:** Workmanship warranty per trade standards; manufacturer warranties apply to materials.  \n\n`;
    md += `**Acceptance:** I, ______________________ (Client), accept this estimate and agree to proceed.  \n`;
    md += `Signature: __________________ Date: ________________\n`;

    output = md;
    loading = false;
  }
</script>

<svelte:head><title>Proposal & Estimate Builder</title></svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Pricing & proposals</p>
          <h1 class="text-3xl font-bold leading-tight text-gray-900">Proposal & Estimate Builder</h1>
          <p class="mt-2 max-w-3xl text-base text-gray-800">
            Draft a tradie-ready proposal and price summary from one screen. Add the project brief and cost assumptions, then let the AI flesh out the detailed scope, inclusions, and terms.
          </p>
        </div>
      </div>
      <a href="/account/tools" class="btn btn-ghost self-start text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <form class="rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-sm space-y-8" on:submit={generate}>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <label class="form-control gap-3">
        <span class="label-text">Client name</span>
        <input class="input input-bordered w-full" bind:value={clientName} placeholder="e.g. Jordan Moore" />
      </label>
      <label class="form-control gap-3">
        <span class="label-text">Site address</span>
        <input class="input input-bordered w-full" bind:value={siteAddress} placeholder="e.g. 12 Rivergum Rd, Brunswick" />
      </label>
    </div>

    <label class="form-control gap-3">
      <span class="label-text">Project brief (1–3 sentences)</span>
      <textarea
        class="textarea textarea-bordered h-28 w-full"
        bind:value={projectBrief}
        placeholder="Describe what's being supplied/installed, the rooms or areas involved, and any standards or timing constraints."
      ></textarea>
    </label>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <label class="form-control gap-3">
        <div class="space-y-1">
          <span class="label-text">Costs &amp; allowances</span>
          <p class="text-xs text-gray-500">List each allowance on its own line (e.g. "Materials supply: 10500"). We'll total any line that includes a colon and numbers.</p>
        </div>
        <textarea
          class="textarea textarea-bordered h-48 w-full"
          bind:value={costsText}
          placeholder="Materials supply: $10,500\nLabour crew (40 hrs): $6,400\nEquipment hire: $950\nContingency: $750\nMarkup: 12%"
        ></textarea>
      </label>

      <label class="form-control gap-3">
        <div class="space-y-1">
          <span class="label-text">Adjustments &amp; notes (optional)</span>
          <p class="text-xs text-gray-500">Use this for provisional sums, risks, or client reminders. Add a colon before any figure so it's included in the totals.</p>
        </div>
        <textarea
          class="textarea textarea-bordered h-48 w-full"
          bind:value={adjustmentsText}
          placeholder="Provisional sum — switchboard tidy: $650\nRisk allowance — hidden services: $400\nClient note: Access via rear lane only for deliveries"
        ></textarea>
      </label>
    </div>

    <details class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm">
      <summary class="cursor-pointer space-y-1 p-5 sm:p-6">
        <h2 class="text-lg font-semibold">Advanced controls</h2>
        <p class="text-sm text-gray-500">Set trade focus, GST and validity. Leave closed for a fast, default estimate.</p>
      </summary>
      <div class="space-y-4 px-5 pb-5 sm:px-6">
        <label class="form-control gap-3">
          <span class="label-text">Trade focus</span>
          <select class="select select-bordered" bind:value={trade}>
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
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label class="form-control gap-2">
            <span class="label-text">Include GST?</span>
            <label class="label cursor-pointer justify-start gap-2">
              <input type="checkbox" class="checkbox" bind:checked={includeGST} />
              <span class="label-text">Yes, apply {gstRateInput.toFixed(0)}%</span>
            </label>
          </label>
          <label class="form-control gap-2">
            <span class="label-text">GST rate (%)</span>
            <input type="number" min="0" max="100" step="0.1" class="input input-bordered" bind:value={gstRateInput} />
          </label>
          <label class="form-control gap-2">
            <span class="label-text">Validity (days)</span>
            <input type="number" min="7" max="120" class="input input-bordered" bind:value={validityDays} />
          </label>
        </div>
      </div>
    </details>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm">
        <div class="space-y-4 p-5 sm:p-6 text-sm">
          <h2 class="text-lg font-semibold">Totals snapshot</h2>
          <div class="space-y-2">
            <div class="flex items-center justify-between"><span class="opacity-70">Costs &amp; allowances</span><span class="font-semibold">{fmt(baseCostsTotal)}</span></div>
            <div class="flex items-center justify-between"><span class="opacity-70">Adjustments</span><span class="font-semibold">{fmt(adjustmentsTotal)}</span></div>
            <div class="flex items-center justify-between"><span class="opacity-70">Subtotal</span><span class="font-semibold">{fmt(clientSubtotal)}</span></div>
            {#if includeGST}
              <div class="flex items-center justify-between"><span class="opacity-70">GST ({(gstRate * 100).toFixed(0)}%)</span><span class="font-semibold">{fmt(gst)}</span></div>
            {/if}
            <div class="flex items-center justify-between text-base"><span class="opacity-70">Grand total</span><span class="font-semibold">{fmt(grandTotal)}</span></div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm lg:col-span-2">
        <div class="flex flex-wrap items-center gap-3 p-5 sm:p-6">
          <button class="btn btn-primary" type="submit" disabled={loading}>
            {#if loading}<span class="loading loading-dots"></span>{/if}
            <span>Generate proposal</span>
          </button>
          <button type="button" class="btn" on:click={useExample}>Use example</button>
          <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}>Copy</button>
          <button type="button" class="btn btn-outline" on:click={resetAll}>Reset</button>
          <p class="text-xs text-gray-500">Tip: Paste rows straight from spreadsheets or emails—if a line reads "Thing: 1234" we'll crunch it before calling the AI.</p>
        </div>
      </div>
    </div>
  </form>

  {#if output.trim().length}
    <div class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm mt-4">
      <div class="p-5 sm:p-6">
        <RichAnswer text={output} />
      </div>
    </div>
  {/if}
</section>
