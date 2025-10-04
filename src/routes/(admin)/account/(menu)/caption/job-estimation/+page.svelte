<!-- /account/caption/job-estimation (v3.2 — detailed sections, robust import, editable discounts) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";

  /***** Minimal inputs *****/
  let clientName = "";
  let siteAddress = "";
  let projectBrief = ""; // drives AI (overview/scope/assumptions/risks/timeline)

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

  // Pricing controls (whole numbers in UI)
  let overheadPctWhole = 10;
  let marginPctWhole = 10;
  let contingencyPctWhole = 0;
  let includeGST = true;
  let gstRate = 0.10;
  let validityDays = 30;

  // Materials (paste → import); client-facing columns + editable % discount
  type MaterialRow = {
    item: string;
    unitCost: number;   // editable
    qty: number;        // editable
    discountPct: number; // editable
    costBefore: number; // derived
    discountAmt: number; // derived
    subtotal: number;    // derived
  };
  let materialsText = "";
  let materials: MaterialRow[] = [];
  let parseFeedback = "";

  // Labour (optional)
  type LabourRow = { role: string; hours: number; rate: number };
  let labour: LabourRow[] = [];

  // Optional costs
  type SimpleCost = { label: string; amount: number };
  let subcontractors: SimpleCost[] = [];
  let equipment: SimpleCost[] = [];

  // Output
  let output = "";
  let loading = false;

  /************ Helpers ************/
  function toNumber(n: any, d = 0) {
    const x = Number(String(n).replace(/[^0-9.\-]/g, ""));
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
    // ensure any open paren gets closed or extend up to 28 words
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

  // Keep derived columns synced when user edits unitCost/qty/discountPct
  function recomputeMaterial(m: MaterialRow) {
    const before = (toNumber(m.unitCost) || 0) * (toNumber(m.qty) || 0);
    const discAmt = before * (toNumber(m.discountPct) / 100);
    m.costBefore = before;
    m.discountAmt = discAmt;
    m.subtotal = before - discAmt;
  }
  $: materials = materials.map((m) => {
    // ensure derived fields stay in sync
    const before = (toNumber(m.unitCost) || 0) * (toNumber(m.qty) || 0);
    const discAmt = before * (toNumber(m.discountPct) / 100);
    return {
      ...m,
      costBefore: before,
      discountAmt: discAmt,
      subtotal: before - discAmt
    };
  });

  // ---------- Import from “Costing Summary” table ----------
  // Expected header (order-insensitive mapping by names):
  // | Item | Unit Cost | Quantity | Cost Before Discount | Discount % | Discount Amount | Subtotal |
  function importFromCostingSummary() {
    materials = [];
    parseFeedback = "";

    const text = (materialsText || "").trim();
    if (!text) {
      parseFeedback = "Nothing to import — paste the Costing Summary table first.";
      return;
    }

    // Quick robust normalisation
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.replace(/\u00A0/g, " ").trim()); // strip non-breaking spaces

    // find header row (contains pipes and required labels in some order)
    const headerIdx = lines.findIndex((l) => /\|/.test(l) && /item/i.test(l) && /unit\s*cost/i.test(l) && /quantity/i.test(l) && /(before\s*discount|cost\s*before)/i.test(l) && /discount\s*%/i.test(l) && /discount\s*amount/i.test(l) && /subtotal/i.test(l));
    if (headerIdx === -1) {
      parseFeedback =
        "Couldn’t find a Costing Summary pipe-table. In the Material & Cost Calculator, copy the table **with | separators** and paste here.";
      return;
    }

    // parse header cells & build column index map
    const headerCells = lines[headerIdx]
      .split("|")
      .map((c) => c.trim().replace(/^\*\*|\*\*$/g, ""))
      .filter(Boolean);

    const idx = (name: RegExp) =>
      headerCells.findIndex((c) => name.test(c));

    const col = {
      item: idx(/^item$/i),
      unitCost: idx(/unit\s*cost/i),
      qty: idx(/^qty|quantity$/i),
      before: idx(/(before\s*discount|cost\s*before)/i),
      discPct: idx(/discount\s*%/i),
      discAmt: idx(/discount\s*amount/i),
      subtotal: idx(/^subtotal$/i)
    };

    // sanity check
    if (Object.values(col).some((v) => v === -1)) {
      parseFeedback = "Costing Summary header is missing required columns.";
      return;
    }

    // find separator row like |---|---|
    let sepIdx = -1;
    for (let i = headerIdx + 1; i < lines.length; i++) {
      if (/^\s*\|\s*-+\s*\|/.test(lines[i])) {
        sepIdx = i;
        break;
      }
    }
    if (sepIdx === -1) {
      parseFeedback = "Table looks malformed (no separator row).";
      return;
    }

    // iterate body rows until a non-pipe line
    let ok = 0;
    for (let i = sepIdx + 1; i < lines.length; i++) {
      const raw = lines[i];
      if (!/^\|/.test(raw)) break;
      const cells = raw
        .split("|")
        .map((c) => c.trim().replace(/^\*\*|\*\*$/g, ""))
        .filter((_, j, arr) => !(j === 0 || j === arr.length - 1)); // drop outer empties

      // minimum columns check
      if (cells.length < headerCells.length) continue;

      const grab = (pos: number) => (pos >= 0 && pos < cells.length ? cells[pos] : "");

      const itemStr = grab(col.item);
      // Skip total rows
      if (!itemStr || /^total/i.test(itemStr)) continue;

      const unitCost = toNumber(grab(col.unitCost));
      const qty = toNumber(grab(col.qty), 1);
      const before = toNumber(grab(col.before));
      const discPct = toNumber(grab(col.discPct));
      const discAmt = toNumber(grab(col.discAmt));
      const subtotal = toNumber(grab(col.subtotal));

      // Prefer deriving from editable inputs (unitCost, qty, discPct) when available
      const derivedBefore = unitCost * qty;
      const pct = Number.isFinite(discPct) ? discPct : (derivedBefore ? (discAmt / derivedBefore) * 100 : 0);
      const derivedDiscAmt = derivedBefore * (pct / 100);
      const derivedSubtotal = derivedBefore - derivedDiscAmt;

      materials.push({
        item: itemStr,
        unitCost,
        qty,
        discountPct: isFinite(pct) ? Math.max(0, pct) : 0,
        costBefore: derivedBefore || before,
        discountAmt: isFinite(derivedDiscAmt) ? derivedDiscAmt : discAmt,
        subtotal: isFinite(derivedSubtotal) ? derivedSubtotal : subtotal
      });
      ok++;
    }

    parseFeedback =
      ok > 0
        ? `Imported ${ok} item${ok === 1 ? "" : "s"} from Costing Summary.`
        : "Found a table but no line items (totals/blank rows were skipped).";
  }

  function resetAll() {
    clientName = "";
    siteAddress = "";
    projectBrief = "";
    overheadPctWhole = 10;
    marginPctWhole = 10;
    contingencyPctWhole = 0;
    includeGST = true;
    gstRate = 0.1;
    validityDays = 30;

    materialsText = "";
    materials = [];
    parseFeedback = "";
    labour = [];
    subcontractors = [];
    equipment = [];
    output = "";
  }

  // Derived totals (client-facing folds internal costs)
  $: materialsSubtotal = materials.reduce((s, m) => s + (m.subtotal || 0), 0);
  $: labourSubtotal = labour.reduce(
    (s, l) => s + toNumber(l.hours) * toNumber(l.rate),
    0
  );
  $: subsTotal = subcontractors.reduce((s, x) => s + toNumber(x.amount), 0);
  $: equipTotal = equipment.reduce((s, x) => s + toNumber(x.amount), 0);

  // Internal folding of overhead/contingency/margin (NOT shown as separate lines)
  $: baseBeforeBusiness = materialsSubtotal + labourSubtotal + subsTotal + equipTotal;
  $: withOverhead = baseBeforeBusiness * (1 + toNumber(overheadPctWhole) / 100);
  $: withContingency =
    withOverhead * (1 + toNumber(contingencyPctWhole) / 100);
  $: clientSubtotal = withContingency * (1 + toNumber(marginPctWhole) / 100);
  $: gst = includeGST ? clientSubtotal * (gstRate || 0) : 0;
  $: grandTotal = clientSubtotal + gst;

  // ---------- AI sections (JSON-only, *detailed*) ----------
  async function aiSections(): Promise<{
    overview: string;
    scope: string[];
    assumptions: string[];
    exclusions: string[];
    risks: string[];
    timeline: string[];
    options: string[]; // additional options (not included)
    labourSuggest: LabourRow[];
  }> {
    const SYSTEM = `You are an AI assistant for Australian tradies. Reply in Australian English.
Return ONLY JSON with keys and *detailed* content:
- overview: string (≈150–220 words; friendly, client-facing; mention specifics from the brief; explain approach, quality and compliance)
- scope: string[] (8–12 bullets; each a full, concrete sentence tailored to the trade & brief; describe what will be done and why it matters)
- assumptions: string[] (6–10 realistic assumptions)
- exclusions: string[] (4–8 clear boundaries)
- risks: string[] (4–8 items; flag unknowns and site-dependent factors)
- timeline: string[] (4–6 milestones; each with a short helpful description)
- options: string[] (3–6 value-adding items NOT included; e.g., preventative maintenance, minor upgrades, extended warranty)
- labourSuggest: {role,hours,rate}[] (only if useful; else [])
Keep content practical and specific; avoid generic fluff.`;

    const user =
      "Trade: " +
      trade +
      "\n" +
      "Brief: " +
      (projectBrief || "N/A") +
      "\n" +
      "HaveMaterials: " +
      (materials.length > 0 ? "Yes" : "No") +
      "\n" +
      "HaveLabour: " +
      (labour.length > 0 ? "Yes" : "No");

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
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value);
        }
      }
    } catch {}

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
          ? j.labourSuggest.map((r: any) => ({
              role: String(r.role || ""),
              hours: toNumber(r.hours, 0),
              rate: toNumber(r.rate, 0)
            }))
          : []
      };
    } catch {
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
    const usingAISuggestedLabour = labour.length === 0 && ai.labourSuggest.length > 0;
    if (usingAISuggestedLabour) labour = ai.labourSuggest;

    const title = deriveTitle(projectBrief);
    const quoteRef = randomRef();

    // Build Markdown for RichAnswer (detailed)
    let md = "";
    md += `# Job Estimate (Quote)\n\n`;
    md += `**Quote Ref:** ${quoteRef}  \n`;
    md += `**To:** ${clientName || "_Client_"}  \n`;
    md += `**Site:** ${siteAddress || "_Site Address_"}  \n`;
    md += `**Project:** ${title}  \n`;
    md += `**Estimate Valid For:** ${validityDays} days\n\n`;

    // Overview (detailed)
    md += `## Overview\n\n`;
    if (ai.overview) {
      md += ai.overview.trim() + `\n\n`;
    } else {
      md += `We propose to complete the requested works as described in your brief, focusing on compliance, tidy workmanship and clear communication. This estimate outlines a detailed scope, indicative timeline and pricing, subject to final site verification.\n\n`;
    }

    // Scope (8–12 full sentences)
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
    const scopeList =
      ai.scope && ai.scope.length
        ? ai.scope
        : baseTasks[trade];

    md += `## Scope / Services\n\n`;
    md += `| # | Task Description |\n|---|------------------|\n`;
    scopeList.forEach((t, i) => {
      md += `| ${i + 1} | ${String(t)} |\n`;
    });
    md += `\n`;

    // Materials (client view; Item, Unit Cost, Quantity, Before, Discount Amt, Subtotal)
    md += `## Materials\n\n`;
    if (materials.length) {
      md += `| Item | Unit Cost | Quantity | Cost Before Discount | Discount Amount | Subtotal |\n|------|----------:|---------:|---------------------:|---------------:|---------:|\n`;
      materials.forEach((m) => {
        md += `| ${m.item || "-"} | ${fmt(m.unitCost || 0)} | ${m.qty || 0} | ${fmt(m.costBefore || 0)} | ${fmt(m.discountAmt || 0)} | ${fmt(m.subtotal || 0)} |\n`;
      });
      md += `\n**Materials Subtotal:** ${fmt(materialsSubtotal)}\n\n`;
    } else {
      md += `_No materials entered._\n\n`;
    }

    // Labour
    md += `## Labour\n\n`;
    if (labour.length) {
      md += `| Role | Hours | Rate | Total |\n|------|------:|-----:|------:|\n`;
      labour.forEach((l) => {
        const total = toNumber(l.hours) * toNumber(l.rate);
        md += `| ${l.role || "-"} | ${toNumber(l.hours) || 0} | ${fmt(toNumber(l.rate) || 0)} | ${fmt(total)} |\n`;
      });
      md += `\n**Labour Subtotal:** ${fmt(labourSubtotal)}\n\n`;
    } else {
      md += `_No labour entered._\n\n`;
    }

    // Subs / Equipment
    if (subcontractors.length || equipment.length) md += `## Subcontractors / Equipment\n\n`;
    if (subcontractors.length) {
      md += `**Subcontractors**\n\n| Item | Cost |\n|------|-----:|\n`;
      subcontractors.forEach((s) => {
        md += `| ${s.label || "-"} | ${fmt(toNumber(s.amount) || 0)} |\n`;
      });
      md += `\n`;
    }
    if (equipment.length) {
      md += `**Equipment / Hire**\n\n| Item | Cost |\n|------|-----:|\n`;
      equipment.forEach((s) => {
        md += `| ${s.label || "-"} | ${fmt(toNumber(s.amount) || 0)} |\n`;
      });
      md += `\n`;
    }

    // Assumptions & Exclusions (detailed)
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

    md += `## Assumptions & Exclusions\n\n`;
    md += `**Assumptions**\n\n` + assumptions.map((a) => `- ${a}`).join("\n") + `\n\n`;
    md += `**Exclusions**\n\n` + exclusions.map((a) => `- ${a}`).join("\n") + `\n\n`;

    // Additional Options (not included)
    if (ai.options && ai.options.length) {
      md += `## Additional Options (not included)\n\n`;
      md += ai.options.map((o) => `- ${o}`).join("\n") + `\n\n`;
    }

    // Risks
    if (ai.risks && ai.risks.length) {
      md += `## Risks & Notes (review)\n\n`;
      md += ai.risks.map((r) => `- ${r}`).join("\n") + `\n\n`;
    }

    // Timeline (detailed milestones)
    const timeline =
      ai.timeline && ai.timeline.length
        ? ai.timeline
        : [
            "Scheduling & prep — confirm selections, access and set-down areas.",
            "Core works — carry out installation and coordinate any dependencies.",
            "Testing & tidy — verify performance, safety and finish; clean the site.",
            "Handover — brief operation/maintenance and confirm you’re happy."
          ];
    md += `## Timeline (indicative)\n\n`;
    md += timeline.map((t) => `- ${t}`).join("\n") + `\n\n`;

    // Cost Summary (client view only; folded)
    md += `## Cost Summary\n\n`;
    md += `| Description | Amount |\n|-------------|-------:|\n`;
    md += `| Materials Subtotal | ${fmt(materialsSubtotal)} |\n`;
    md += `| Labour Subtotal | ${fmt(labourSubtotal)} |\n`;
    md += `| Subcontractors | ${fmt(subsTotal)} |\n`;
    md += `| Equipment / Hire | ${fmt(equipTotal)} |\n`;
    md += `| **Subtotal** | **${fmt(clientSubtotal)}** |\n`;
    if (includeGST) md += `| **GST (${(gstRate * 100).toFixed(0)}%)** | **${fmt(gst)}** |\n`;
    md += `| **Total (AUD)** | **${fmt(grandTotal)}** |\n\n`;

    // Remove “Thank You / Contact” per your request.

    output = md;
    loading = false;
  }

  function copyOut() {
    try {
      navigator.clipboard.writeText(output || "");
    } catch {}
  }

  function useExample() {
    clientName = "Jordan Moore";
    siteAddress = "12 Rivergum Rd, Brunswick VIC 3056";
    trade = "Electrical";
    projectBrief =
      "Remove and replace two existing split systems (7.1kW) in lounge and master. Reuse circuits if compliant; allow minor switchboard work if required. Patch small penetrations; tidy finish.";

    // Example materials: paste your Costing Summary block, then click Import
    materialsText = `**Quote Summary**

**Currency:** AUD

| Item       | Unit Cost | Quantity | Cost Before Discount | Discount % | Discount Amount | Subtotal |
|------------|-----------|----------|----------------------|------------|-----------------|----------|
| Wiring     | $20       | 2        | $40                  | 10%        | $4              | $36      |
| Cabling    | $10       | 1        | $10                  | 0%         | $0              | $10      |
| **Total Material Cost** |           |          |                      |            |                 | **$46**  |

**Profit from Markup (20%)**: $9.20  
**Final Total**: $55.20

Thank you for considering our services!`;

    labour = [
      { role: "Electrician", hours: 12, rate: 90 },
      { role: "Apprentice", hours: 6, rate: 55 }
    ];
    subcontractors = [];
    equipment = [{ label: "Vacuum pump hire", amount: 45 }];
  }
</script>

<svelte:head><title>Job Estimation Wizard</title></svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-semibold">Job Estimation Wizard</h1>
      <p class="text-sm opacity-70">
        Type a short brief, optionally import materials from the Cost Calculator, and generate a client-ready quote.
      </p>
    </div>
    <a href="/account/caption" class="btn btn-ghost">← Back</a>
  </header>

  <!-- Quick mode -->
  <form class="card bg-base-100 border border-base-300 p-4 space-y-4" on:submit={generate}>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label class="form-control"><span class="label-text">Client name</span><input class="input input-bordered" bind:value={clientName} /></label>
      <label class="form-control"><span class="label-text">Site address</span><input class="input input-bordered" bind:value={siteAddress} /></label>
      <label class="form-control md:col-span-2">
        <span class="label-text">Project brief (1–3 sentences)</span>
        <textarea
          class="textarea textarea-bordered h-24"
          bind:value={projectBrief}
          placeholder="Describe the job in your words. We’ll draft a detailed overview, tailored scope, assumptions, risks and timeline."
        ></textarea>
      </label>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Materials -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body gap-3">
          <h2 class="card-title text-base">Materials (paste → Import)</h2>
          <textarea
            class="textarea textarea-bordered h-28"
            bind:value={materialsText}
            placeholder="Paste the Costing Summary table from the Material & Cost Calculator (with | columns), then click Import now."
          ></textarea>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" class="btn btn-sm btn-outline" on:click={importFromCostingSummary}>Import now</button>
            <button type="button" class="btn btn-sm" on:click={useExample}>Use example</button>
            <button type="button" class="btn btn-ghost btn-sm" on:click={() => { materialsText=''; materials=[]; parseFeedback=''; }}>Clear materials</button>
            {#if parseFeedback}<span class="text-xs opacity-70">{parseFeedback}</span>{/if}
          </div>

          <div class="overflow-x-auto">
            {#if materials.length}
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th class="text-right">Unit Cost</th>
                    <th class="text-right">Quantity</th>
                    <th class="text-right">Discount %</th>
                    <th class="text-right">Cost Before</th>
                    <th class="text-right">Discount Amount</th>
                    <th class="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {#each materials as m, i}
                    <tr>
                      <td><input class="input input-bordered input-xs w-56" bind:value={m.item}></td>
                      <td class="text-right"><input type="number" step="0.01" class="input input-bordered input-xs w-28 text-right" bind:value={m.unitCost} on:input={() => recomputeMaterial(m)}></td>
                      <td class="text-right"><input type="number" step="0.01" class="input input-bordered input-xs w-24 text-right" bind:value={m.qty} on:input={() => recomputeMaterial(m)}></td>
                      <td class="text-right"><input type="number" step="0.1" class="input input-bordered input-xs w-24 text-right" bind:value={m.discountPct} on:input={() => recomputeMaterial(m)}></td>
                      <td class="text-right">{fmt(m.costBefore)}</td>
                      <td class="text-right">{fmt(m.discountAmt)}</td>
                      <td class="text-right font-semibold">{fmt(m.subtotal)}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            {:else}
              <div class="text-xs opacity-70">No materials imported yet.</div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Labour / Subs / Equip (optional) -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body gap-3">
          <h2 class="card-title text-base">Labour (optional)</h2>
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead><tr><th>Role</th><th>Hours</th><th>Rate</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {#each labour as l, i}
                  <tr>
                    <td><input class="input input-bordered input-xs w-40" bind:value={l.role}></td>
                    <td><input type="number" min="0" class="input input-bordered input-xs w-20" bind:value={l.hours}></td>
                    <td><input type="number" step="0.01" class="input input-bordered input-xs w-24" bind:value={l.rate}></td>
                    <td class="text-right">{fmt((Number(l.hours) || 0) * (Number(l.rate) || 0))}</td>
                    <td><button type="button" class="btn btn-xs btn-ghost" on:click={() => (labour = labour.filter((_, idx) => idx !== i))}>✕</button></td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-sm" on:click={() => (labour = [...labour, { role: "", hours: 0, rate: 0 }])}>+ Add labour row</button>

          <div class="divider my-2"></div>

          <h2 class="card-title text-base">Subs / Equipment (optional)</h2>
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead><tr><th>Subcontractor</th><th class="text-right">Amount</th><th></th></tr></thead>
              <tbody>
                {#each subcontractors as s, i}
                  <tr>
                    <td><input class="input input-bordered input-xs w-48" bind:value={s.label}></td>
                    <td><input type="number" step="0.01" class="input input-bordered input-xs w-28 text-right" bind:value={s.amount}></td>
                    <td><button type="button" class="btn btn-xs btn-ghost" on:click={() => (subcontractors = subcontractors.filter((_, idx) => idx !== i))}>✕</button></td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-sm" on:click={() => (subcontractors = [...subcontractors, { label: "", amount: 0 }])}>+ Add subcontractor</button>

          <div class="overflow-x-auto mt-3">
            <table class="table table-sm">
              <thead><tr><th>Equipment/Hire</th><th class="text-right">Amount</th><th></th></tr></thead>
              <tbody>
                {#each equipment as s, i}
                  <tr>
                    <td><input class="input input-bordered input-xs w-48" bind:value={s.label}></td>
                    <td><input type="number" step="0.01" class="input input-bordered input-xs w-28 text-right" bind:value={s.amount}></td>
                    <td><button type="button" class="btn btn-xs btn-ghost" on:click={() => (equipment = equipment.filter((_, idx) => idx !== i))}>✕</button></td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-sm" on:click={() => (equipment = [...equipment, { label: "", amount: 0 }])}>+ Add equipment</button>
        </div>
      </div>
    </div>

    <!-- Advanced (collapsible) -->
    <details class="card bg-base-100 border border-base-300">
      <summary class="card-body cursor-pointer">
        <h2 class="card-title text-base">Advanced (optional) <span class="opacity-60 text-xs">(click to expand)</span></h2>
      </summary>
      <div class="px-4 pb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label class="form-control"><span class="label-text">Overhead %</span><input type="number" min="0" max="100" step="1" class="input input-bordered" bind:value={overheadPctWhole} /></label>
          <label class="form-control"><span class="label-text">Margin %</span><input type="number" min="0" max="100" step="1" class="input input-bordered" bind:value={marginPctWhole} /></label>
          <label class="form-control"><span class="label-text">Contingency %</span><input type="number" min="0" max="100" step="1" class="input input-bordered" bind:value={contingencyPctWhole} /></label>
        </div>
      </div>
    </details>

    <!-- Totals + Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h2 class="card-title text-base">Totals</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 text-sm">
            <div><div class="opacity-60">Materials</div><div class="font-semibold">{fmt(materialsSubtotal)}</div></div>
            <div><div class="opacity-60">Labour</div><div class="font-semibold">{fmt(labourSubtotal)}</div></div>
            <div><div class="opacity-60">Subs</div><div class="font-semibold">{fmt(subsTotal)}</div></div>
            <div><div class="opacity-60">Equipment</div><div class="font-semibold">{fmt(equipTotal)}</div></div>
            <div><div class="opacity-60">Subtotal</div><div class="font-semibold">{fmt(clientSubtotal)}</div></div>
            {#if includeGST}
              <div><div class="opacity-60">GST</div><div class="font-semibold">{fmt(gst)}</div></div>
            {/if}
            <div><div class="opacity-60">Total (AUD)</div><div class="font-semibold">{fmt(grandTotal)}</div></div>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body flex flex-wrap items-center gap-3">
          <button class="btn btn-primary" type="submit" disabled={loading}>
            {#if loading}<span class="loading loading-dots"></span>{/if}
            <span>Generate Quote</span>
          </button>
          <button type="button" class="btn" on:click={useExample}>Use example</button>
          <label class="label cursor-pointer justify-start gap-2">
            <input type="checkbox" class="checkbox" bind:checked={includeGST} />
            <span class="label-text">Include GST ({(gstRate * 100).toFixed(0)}%)</span>
          </label>
          <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}>Copy</button>
          <button type="button" class="btn btn-outline" on:click={resetAll}>Reset</button>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <p class="text-xs opacity-70">
            Tip: Copy the <em>Costing Summary</em> table from the
            <a href="/account/caption/material-cost" class="link link-primary">Material &amp; Cost Calculator</a>, then paste above and click <strong>Import now</strong>.
          </p>
        </div>
      </div>
    </div>
  </form>

  <!-- Rich Answer (final rendered quote) -->
  {#if output.trim().length}
    <div class="card bg-base-100 border mt-2">
      <div class="card-body">
        <RichAnswer text={output} />
      </div>
    </div>
  {/if}
</section>
