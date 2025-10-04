<!-- /account/caption/job-estimation (v3.0) -->
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

  // Materials (paste → import)
  type MaterialRow = {
    item: string;
    unitCost: number;
    qty: number;
    costBefore: number;
    discountAmt: number;
    discountPct: number; // parsed but not shown
    subtotal: number;    // post-discount
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
    // take first sentence or up to ~16 words; avoid broken parentheses
    const firstSentence = clean.split(/(?<=[.!?])\s+/)[0] || clean;
    const words = firstSentence.split(" ");
    let out = words.slice(0, 16).join(" ");
    // if open paren not closed, extend until closed or 24 words
    let opens = (out.match(/\(/g) || []).length;
    let closes = (out.match(/\)/g) || []).length;
    let i = 16;
    while (opens > closes && i < Math.min(words.length, 24)) {
      out += " " + words[i++];
      opens = (out.match(/\(/g) || []).length;
      closes = (out.match(/\)/g) || []).length;
    }
    return out.replace(/[.!?]+$/, "");
  }

  // ---------- Import from “Costing Summary” table ----------
  // Expected header:
  // | Item | Unit Cost | Quantity | Cost Before Discount | Discount % | Discount Amount | Subtotal |
  function importFromCostingSummary() {
    materials = [];
    parseFeedback = "";

    const text = (materialsText || "").trim();
    if (!text) {
      parseFeedback = "Nothing to import — paste the Costing Summary block first.";
      return;
    }

    const lines = text.split(/\r?\n/);
    const headerIdx = lines.findIndex((l) =>
      /\|\s*Item\s*\|\s*Unit\s*Cost\s*\|\s*Quantity\s*\|\s*Cost\s*Before\s*Discount\s*\|\s*Discount\s*%?\s*\|\s*Discount\s*Amount\s*\|\s*Subtotal\s*\|/i.test(
        l
      )
    );
    if (headerIdx === -1) {
      parseFeedback =
        "Couldn’t find a Costing Summary table. Paste from the Material & Cost Calculator.";
      return;
    }

    // Find the separator row after header (---|---)
    const sepIdx =
      lines
        .slice(headerIdx + 1)
        .findIndex((l) => /^\s*\|\s*-+\s*\|/.test(l)) + headerIdx + 1;
    if (sepIdx <= headerIdx) {
      parseFeedback = "Table looks malformed (no separator row).";
      return;
    }

    // Iterate data rows until we hit a blank line or a non-table line
    let ok = 0;
    for (let i = sepIdx + 1; i < lines.length; i++) {
      const raw = lines[i];
      if (!/^\s*\|/.test(raw)) break; // end of table

      // split | columns
      const cols = raw
        .split("|")
        .map((c) => c.trim())
        .filter((c, idx) => !(idx === 0 || idx === raw.split("|").length - 1)); // drop leading/trailing empties

      if (cols.length < 7) continue; // skip malformed rows

      let [item, unitCost, qty, costBefore, discountPct, discountAmt, subtotal] =
        cols;

      // Drop bold markers and commas/dollar/% signs
      const stripMd = (s: string) => s.replace(/^\*\*|\*\*$/g, "").trim();

      const row: MaterialRow = {
        item: stripMd(item),
        unitCost: toNumber(unitCost),
        qty: toNumber(qty, 1),
        costBefore: toNumber(costBefore),
        discountPct: toNumber(discountPct),
        discountAmt: toNumber(discountAmt),
        subtotal: toNumber(stripMd(subtotal))
      };

      // Skip totals or empty item rows
      if (!row.item || /^total/i.test(row.item)) continue;

      materials.push(row);
      ok++;
    }

    parseFeedback = ok
      ? `Imported ${ok} item${ok === 1 ? "" : "s"} from Costing Summary.`
      : "Found the table but no line items (totals/blank rows were skipped).";
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

  // ---------- AI sections (JSON-only, robust) ----------
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
Return ONLY JSON with keys:
- overview: string (80-120 words; friendly, client-facing; mention specifics from the brief)
- scope: string[] (6-10 bullets, concrete tasks tailored to the trade & brief)
- assumptions: string[]
- exclusions: string[]
- risks: string[]
- timeline: string[] (3-6 milestones)
- options: string[] (3-5 value-adding items NOT included; e.g. extended warranty, preventative maintenance, minor upgrades)
- labourSuggest: {role,hours,rate}[] (only if clearly useful; else [])`;

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
        scope: Array.isArray(j.scope) ? j.scope.slice(0, 10).map(String) : [],
        assumptions: Array.isArray(j.assumptions)
          ? j.assumptions.map(String)
          : [],
        exclusions: Array.isArray(j.exclusions)
          ? j.exclusions.map(String)
          : [],
        risks: Array.isArray(j.risks) ? j.risks.map(String) : [],
        timeline: Array.isArray(j.timeline) ? j.timeline.map(String) : [],
        options: Array.isArray(j.options) ? j.options.map(String) : [],
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

    // Build Markdown for RichAnswer
    let md = "";
    md += `# Job Estimate (Quote)\n\n`;
    md += `**Quote Ref:** ${quoteRef}  \n`;
    md += `**To:** ${clientName || "_Client_"}  \n`;
    md += `**Site:** ${siteAddress || "_Site Address_"}  \n`;
    md += `**Project:** ${title}  \n`;
    md += `**Estimate Valid For:** ${validityDays} days\n\n`;

    // Overview
    md += `## Overview\n\n`;
    if (ai.overview) {
      md += ai.overview.trim() + `\n\n`;
    } else {
      md += `We propose to complete the requested works as described in your brief, focusing on compliance, tidy workmanship and clear communication. This estimate outlines the scope, indicative timeline and pricing, subject to final site verification.\n\n`;
    }

    // Scope
    const baseTasks: Record<Trade, string[]> = {
      General: ["Site prep & safety", "Core works per brief", "Cleanup & handover"],
      HVAC: ["Indoor/outdoor unit placement", "Refrigerant, condensate & electrical", "Commissioning & handover"],
      Electrical: ["Rough-in", "Fit-off & testing", "Compliance documentation"],
      Plumbing: ["Rough-in", "Fit-off & testing", "Compliance documentation"],
      Carpentry: ["Set-out & framing", "Install & fix-off", "Finishing & tidy"],
      Tiling: ["Surface prep", "Tiling & grouting", "Sealing & clean"],
      Construction: ["Set-out & temp works", "Structural & architectural works", "Completion & handover"],
      Landscaping: ["Site prep & edging", "Planting/hardscape", "Clean & maintenance guidelines"],
      Painting: ["Prep & masking", "Undercoat & topcoats", "Cut-in & cleanup"],
      Other: ["Site prep", "Core works per brief", "Cleanup & handover"]
    };
    const scopeList = ai.scope && ai.scope.length ? ai.scope : baseTasks[trade];
    md += `## Scope / Services\n\n`;
    md += `| # | Task Description |\n|---|------------------|\n`;
    scopeList.forEach((t, i) => {
      md += `| ${i + 1} | ${String(t)} |\n`;
    });
    md += `\n`;

    // Materials (client view; no unit/markup)
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

    // Assumptions & Exclusions
    const assumptions =
      ai.assumptions && ai.assumptions.length
        ? ai.assumptions
        : [
            "Standard working hours Mon–Fri; clear access assumed.",
            "Work to current Australian Standards; licenses as required."
          ];
    const exclusions =
      ai.exclusions && ai.exclusions.length
        ? ai.exclusions
        : ["Structural changes unless specified.", "Asbestos testing/removal."];

    md += `## Assumptions & Exclusions\n\n`;
    md += `**Assumptions**\n\n` + assumptions.map((a) => `- ${a}`).join("\n") + `\n\n`;
    md += `**Exclusions**\n\n` + exclusions.map((a) => `- ${a}`).join("\n") + `\n\n`;

    // Additional Options (not included) — after Assumptions & Exclusions
    if (ai.options && ai.options.length) {
      md += `## Additional Options (not included)\n\n`;
      md += ai.options.map((o) => `- ${o}`).join("\n") + `\n\n`;
    }

    // Risks & Notes (optional)
    if (ai.risks && ai.risks.length) {
      md += `## Risks & Notes (review)\n\n`;
      md += ai.risks.map((r) => `- ${r}`).join("\n") + `\n\n`;
    }

    // Timeline
    const timeline =
      ai.timeline && ai.timeline.length
        ? ai.timeline
        : ["Scheduling & prep", "Core works", "Finishing & handover"];
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

    // Payment Terms + Thank you / Contact
    md += `## Payment Terms & Acceptance\n\n`;
    md += `**Estimate validity:** ${validityDays} days from the date of issue.  \n`;
    md += `**Payment terms:** Deposit on acceptance; balance as agreed.  \n`;
    md += `**Warranty:** Workmanship warranty per trade standards; manufacturer warranties apply to materials.  \n\n`;
    md += `**Acceptance:** I, ______________________ (Client), accept this estimate and agree to proceed.  \n`;
    md += `Signature: __________________ Date: ________________\n\n`;

    md += `## Thank You / Contact\n\n`;
    md += `Thanks for the opportunity. If you have any questions about this quote, please reach out and we’ll help straight away.\n`;

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
| Wiring     | $20       | 2        | $40                  | 0%         | $0              | $40      |
| Cabling    | $10       | 1        | $10                  | 0%         | $0              | $10      |
| **Total Material Cost** |           |          |                      |            |                 | **$50**  |

**Profit from Markup (20%)**: $10  
**Final Total**: $60  

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
          placeholder="Describe the job in your words. We’ll draft the overview, tailored scope, assumptions, risks and timeline."
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
            placeholder="Paste the Costing Summary block from the Material & Cost Calculator, then click Import now."
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
                    <th class="text-right">Cost Before Discount</th>
                    <th class="text-right">Discount Amount</th>
                    <th class="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {#each materials as m}
                    <tr>
                      <td><input class="input input-bordered input-xs w-56" bind:value={m.item}></td>
                      <td class="text-right"><input type="number" step="0.01" class="input input-bordered input-xs w-28 text-right" bind:value={m.unitCost}></td>
                      <td class="text-right"><input type="number" step="0.01" class="input input-bordered input-xs w-24 text-right" bind:value={m.qty}></td>
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
            Tip: Copy the <em>Costing Summary</em> block from the
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
        <!-- Removed the old “Quote Preview” heading as requested -->
        <RichAnswer text={output} />
      </div>
    </div>
  {/if}
</section>
