<!-- /account/caption/job-estimation (v2.1) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
/***** Minimal inputs *****/
  let clientName = "";
  let siteAddress = "";
  let projectBrief = ""; // drives AI (overview/scope/timeline/assumptions/risks)
  type Trade = "General" | "HVAC" | "Electrical" | "Plumbing" | "Carpentry" | "Tiling" | "Construction" | "Landscaping" | "Painting" | "Other";
  let trade: Trade = "General";

  // Pricing controls (whole numbers in UI)
  let overheadPctWhole = 10;
  let marginPctWhole = 10;
  let contingencyPctWhole = 0;
  let includeGST = true;
  let gstRate = 0.10;
  let validityDays = 30;

  // Materials (paste → add)
  type MaterialRow = { item: string; qty: number; unit: string; unitCost: number; markupPctWhole: number; };
  let materialsText = "";
  let materials: MaterialRow[] = [];
  let parseFeedback = "";

  // Labour (optional)
  type LabourRow = { role: string; hours: number; rate: number; };
  let labour: LabourRow[] = [];

  // Optional costs
  type SimpleCost = { label: string; amount: number; };
  let subcontractors: SimpleCost[] = [];
  let equipment: SimpleCost[] = [];

  // Output
  let output = "";
  let loading = false;

  /************ Helpers ************/
  function toNumber(n: any, d = 0) { const x = Number(String(n).replace(/[^0-9.\-]/g,"")); return Number.isFinite(x) ? x : d; }
  const fmt = (n: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 }).format(n || 0);

  function deriveTitle(brief: string, trade: string) {
    const clean = (brief || "").replace(/\s+/g, " ").trim();
    if (!clean) return trade + " Job";
    // take first sentence or 8–12 words
    const sentence = clean.split(/[.!?]/)[0];
    const words = sentence.split(" ").slice(0, 12).join(" ");
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  function parseMaterials() {
    materials = [];
    parseFeedback = "";
    const lines = materialsText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let ok = 0, bad: string[] = [];
    lines.forEach((line, i) => {
      // Accept: pipe, comma, or tab separated
      // Format: Item | Qty | Unit | Unit Cost | Markup%
      const parts = line.split(/\s*\|\s*|\s*,\s*|\t/g).map(p => p.trim()).filter(Boolean);
      if (!parts.length) return;
      const [itemRaw, qtyRaw = "1", unitRaw = "", unitCostRaw = "0", markupRaw = "0"] = parts;
      const item = itemRaw || "";
      const qty = toNumber(qtyRaw, 1);
      const unit = unitRaw || "";
      const unitCost = toNumber(unitCostRaw, 0);
      const markupPctWhole = toNumber(String(markupRaw).replace("%",""), 0);
      if (!item) { bad.push(String(i+1)); return; }
      materials.push({ item, qty, unit, unitCost, markupPctWhole });
      ok++;
    });
    parseFeedback = ok ? `Added ${ok} item${ok===1?"":"s"}${bad.length ? `; skipped rows ${bad.join(", ")}` : ""}` : (lines.length ? "Couldn’t read those rows — check the columns." : "");
  }

  function autoParseOnBlur() { if (!materials.length && materialsText.trim()) parseMaterials(); }

  function addLabour() { labour = [...labour, { role: "", hours: 0, rate: 0 }]; }
  function removeLabour(i: number) { labour = labour.filter((_, idx) => idx !== i); }
  function addSub() { subcontractors = [...subcontractors, { label: "", amount: 0 }]; }
  function removeSub(i: number) { subcontractors = subcontractors.filter((_, idx) => idx !== i); }
  function addEquip() { equipment = [...equipment, { label: "", amount: 0 }]; }
  function removeEquip(i: number) { equipment = equipment.filter((_, idx) => idx !== i); }

  function matLineTotal(m: MaterialRow) {
    const base = (m.qty || 0) * (m.unitCost || 0);
    const markup = base * ((m.markupPctWhole || 0) / 100);
    return base + markup;
  }

  // Derived totals
  $: materialsSubtotal = materials.reduce((s, m) => s + matLineTotal(m), 0);
  $: labourSubtotal = labour.reduce((s, l) => s + (toNumber(l.hours) * toNumber(l.rate)), 0);
  $: subsTotal = subcontractors.reduce((s, x) => s + toNumber(x.amount), 0);
  $: equipTotal = equipment.reduce((s, x) => s + toNumber(x.amount), 0);
  $: baseSubtotal = materialsSubtotal + labourSubtotal + subsTotal + equipTotal;
  $: overhead = baseSubtotal * (toNumber(overheadPctWhole)/100);
  $: withOverhead = baseSubtotal + overhead;
  $: contingency = withOverhead * (toNumber(contingencyPctWhole)/100);
  $: withContingency = withOverhead + contingency;
  $: margin = withContingency * (toNumber(marginPctWhole)/100);
  $: subtotal = withContingency + margin;
  $: gst = includeGST ? subtotal * (gstRate || 0) : 0;
  $: grandTotal = subtotal + gst;

  // Example
  function useExample() {
    clientName = "Jordan Moore";
    siteAddress = "12 Rivergum Rd, Brunswick VIC 3056";
    trade = "Electrical";
    projectBrief = "Remove and replace two existing split systems (7.1kW) in lounge and master. Reuse circuits if compliant; allow minor switchboard work if required. Patch small penetrations; tidy finish.";
    overheadPctWhole = 10; marginPctWhole = 12; contingencyPctWhole = 5; includeGST = true; validityDays = 30;

    materialsText = [
      "Split system 7.1kW | 2 | ea | 1750 | 10",
      "Copper pipe (pair) | 20 | m | 12.5 | 15",
      "Condensate hose | 12 | m | 4.5 | 15",
      "Cable TPS 2.5mm | 18 | m | 2.8 | 10"
    ].join("\n");
    parseMaterials();

    labour = [
      { role: "Electrician", hours: 12, rate: 90 },
      { role: "Apprentice", hours: 6, rate: 55 }
    ];

    subcontractors = [];
    equipment = [{ label: "Vacuum pump hire", amount: 45 }];
  }

  // ---------- AI sections (JSON-only, robust) ----------
  async function aiSections(): Promise<{
    overview: string;
    scope: string[];
    assumptions: string[];
    exclusions: string[];
    risks: string[];
    timeline: string[];
    labourSuggest: LabourRow[];
    materialsSuggest: MaterialRow[];
  }> {
    const SYSTEM =
`You are an AI assistant for Australian tradies. Reply in **Australian English**.
Return **ONLY JSON** (no prose) with keys:
- overview: string (80-120 words, friendly, client-facing, mentions specific context from the brief)
- scope: string[] (6-10 bullets, concrete tasks tailored to the trade & brief)
- assumptions: string[] (trade-specific; practical)
- exclusions: string[] (clear boundaries; e.g., Electrical: no switchboard relocation unless stated; Plumbing: no slab cutting)
- risks: string[] (flag guesses/unknowns; prompt client review)
- timeline: string[] (3-6 milestones)
- labourSuggest: {role,hours,rate}[]
- materialsSuggest: {item,qty,unit,unitCost,markupPctWhole}[]
Keep quantities conservative if inferring.`;

    const user =
      "Trade: " + trade + "\n" +
      "Brief: " + (projectBrief || "N/A") + "\n" +
      "HaveMaterials: " + (materials.length > 0 ? "Yes" : "No") + "\n" +
      "HaveLabour: " + (labour.length > 0 ? "Yes" : "No");

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
        scope: Array.isArray(j.scope) ? j.scope.slice(0,10).map(String) : [],
        assumptions: Array.isArray(j.assumptions) ? j.assumptions.map(String) : [],
        exclusions: Array.isArray(j.exclusions) ? j.exclusions.map(String) : [],
        risks: Array.isArray(j.risks) ? j.risks.map(String) : [],
        timeline: Array.isArray(j.timeline) ? j.timeline.map(String) : [],
        labourSuggest: Array.isArray(j.labourSuggest) ? j.labourSuggest.map((r:any)=>({ role:String(r.role||""), hours:toNumber(r.hours,0), rate:toNumber(r.rate,0) })) : [],
        materialsSuggest: Array.isArray(j.materialsSuggest) ? j.materialsSuggest.map((m:any)=>({ item:String(m.item||""), qty:toNumber(m.qty,0), unit:String(m.unit||""), unitCost:toNumber(m.unitCost,0), markupPctWhole:toNumber(m.markupPctWhole,0) })) : []
      };
    } catch {
      return { overview:"", scope:[], assumptions:[], exclusions:[], risks:[], timeline:[], labourSuggest:[], materialsSuggest:[] };
    }
  }

  async function generate(e: Event) {
    e.preventDefault();
    loading = true;

    const ai = await aiSections();

    const usingAISuggestedLabour = labour.length === 0 && ai.labourSuggest.length > 0;
    if (usingAISuggestedLabour) labour = ai.labourSuggest;

    const usingAISuggestedMaterials = materials.length === 0 && ai.materialsSuggest.length > 0;
    if (usingAISuggestedMaterials) materials = ai.materialsSuggest;

    // Recompute derived after AI suggestions
    const _materialsSubtotal = materials.reduce((s, m) => s + matLineTotal(m), 0);
    const _labourSubtotal = labour.reduce((s, l) => s + (toNumber(l.hours) * toNumber(l.rate)), 0);
    const _subsTotal = subcontractors.reduce((s, x) => s + toNumber(x.amount), 0);
    const _equipTotal = equipment.reduce((s, x) => s + toNumber(x.amount), 0);
    const _baseSubtotal = _materialsSubtotal + _labourSubtotal + _subsTotal + _equipTotal;
    const _overhead = _baseSubtotal * (toNumber(overheadPctWhole)/100);
    const _withOverhead = _baseSubtotal + _overhead;
    const _contingency = _withOverhead * (toNumber(contingencyPctWhole)/100);
    const _withContingency = _withOverhead + _contingency;
    const _margin = _withContingency * (toNumber(marginPctWhole)/100);
    const _subtotal = _withContingency + _margin;
    const _gst = includeGST ? _subtotal * (gstRate || 0) : 0;
    const _grandTotal = _subtotal + _gst;

    const title = deriveTitle(projectBrief, trade);

    const baseTasks: Record<Trade, string[]> = {
      General: ["Site prep & safety","Core works per brief","Cleanup & handover"],
      HVAC: ["Indoor/outdoor unit placement","Refrigerant, condensate & electrical","Commissioning & handover"],
      Electrical: ["Rough-in","Fit-off & testing","Compliance documentation"],
      Plumbing: ["Rough-in","Fit-off & testing","Compliance documentation"],
      Carpentry: ["Set-out & framing","Install & fix-off","Finishing & tidy"],
      Tiling: ["Surface prep","Tiling & grouting","Sealing & clean"],
      Construction: ["Set-out & temp works","Structural & architectural works","Completion & handover"],
      Landscaping: ["Site prep & edging","Planting/hardscape","Clean & maintenance guidelines"],
      Painting: ["Prep & masking","Undercoat & topcoats","Cut-in & cleanup"],
      Other: ["Site prep","Core works per brief","Cleanup & handover"]
    };
    const scopeList = (ai.scope && ai.scope.length) ? ai.scope : baseTasks[trade];

    // Build Markdown
    let md = "";
    md += "# Job Estimate (Quote)\n\n";
    md += "**To:** " + (clientName || "_Client_") + "  \n";
    md += "**Site:** " + (siteAddress || "_Site Address_") + "  \n";
    md += "**Project:** " + title + "  \n";
    md += "**Trade:** " + trade + "  \n";
    md += "**Estimate Valid For:** " + validityDays + " days\n\n";
    md += "> **Disclaimer:** This document includes AI-assisted sections and some values may be **estimated**. Please **review and confirm** quantities, rates and assumptions before sending to your client.\n\n";

    // Overview — prefer AI; otherwise a decent fallback
    md += "## Overview\n\n";
    if (ai.overview) {
      md += ai.overview.trim() + "\n\n";
    } else {
      md += "We propose to complete the requested " + trade.toLowerCase() + " works as described in your brief, focusing on compliance, tidy workmanship and clear communication. This estimate outlines the scope, indicative timeline and pricing, subject to final site verification.\n\n";
    }

    // Scope
    md += "## Scope / Services\n\n";
    md += "| # | Task Description |\n|---|------------------|\n";
    scopeList.forEach((t, i) => { md += "| " + (i+1) + " | " + String(t) + " |\n"; });
    md += "\n";

    // Materials
    md += "## Materials\n\n";
    if (materials.length) {
      if (usingAISuggestedMaterials) md += "_The following materials were **AI-suggested** from your brief — **review and adjust** as needed._\n\n";
      md += "| Item | Qty | Unit | Unit Cost | Markup % | Line Total |\n|------|-----|------|----------:|---------:|-----------:|\n";
      materials.forEach(m => {
        md += "| " + m.item + " | " + (m.qty||0) + " | " + (m.unit||"-") + " | " + fmt(m.unitCost||0) + " | " + (toNumber(m.markupPctWhole)||0) + "% | " + fmt(matLineTotal(m)) + " |\n";
      });
      md += "\n**Materials Subtotal:** " + fmt(_materialsSubtotal) + "\n\n";
    } else {
      md += "_No materials entered — paste from the **Material & Cost Calculator** and click **Add items** above._\n\n";
    }

    // Labour
    md += "## Labour\n\n";
    if (labour.length) {
      if (usingAISuggestedLabour) md += "_Labour roles were **AI-suggested** — **review and adjust** as needed._\n\n";
      md += "| Role | Hours | Rate | Total |\n|------|------:|-----:|------:|\n";
      labour.forEach(l => {
        const total = toNumber(l.hours)*toNumber(l.rate);
        md += "| " + (l.role||"-") + " | " + (toNumber(l.hours)||0) + " | " + fmt(toNumber(l.rate)||0) + " | " + fmt(total) + " |\n";
      });
      md += "\n**Labour Subtotal:** " + fmt(_labourSubtotal) + "\n\n";
    } else {
      md += "_No labour entered._\n\n";
    }

    // Subs / Equipment
    md += "## Subcontractors / Equipment\n\n";
    if (subcontractors.length) {
      md += "**Subcontractors**\n\n| Item | Cost |\n|------|-----:|\n";
      subcontractors.forEach(s => { md += "| " + (s.label||"-") + " | " + fmt(toNumber(s.amount)||0) + " |\n"; });
      md += "\n";
    }
    if (equipment.length) {
      md += "**Equipment / Hire**\n\n| Item | Cost |\n|------|-----:|\n";
      equipment.forEach(s => { md += "| " + (s.label||"-") + " | " + fmt(toNumber(s.amount)||0) + " |\n"; });
      md += "\n";
    }
    if (!subcontractors.length && !equipment.length) md += "_None._\n\n";

    // Assumptions & Exclusions
    const assumptions = (ai.assumptions && ai.assumptions.length) ? ai.assumptions : [
      "Standard working hours Mon–Fri; clear access assumed.",
      "Work to current Australian Standards; licenses as required."
    ];
    const exclusions = (ai.exclusions && ai.exclusions.length) ? ai.exclusions : [
      "Structural changes unless specified.",
      "Asbestos testing/removal."
    ];
    md += "## Assumptions & Exclusions\n\n";
    md += "**Assumptions**\n\n" + assumptions.map(a => "- " + a).join("\n") + "\n\n";
    md += "**Exclusions**\n\n" + exclusions.map(a => "- " + a).join("\n") + "\n\n";

    // Risks & Notes
    if (ai.risks && ai.risks.length) {
      md += "## Risks & Notes (review)\n\n";
      md += ai.risks.map(r => "- " + r).join("\n") + "\n\n";
    }

    // Timeline
    const timeline = (ai.timeline && ai.timeline.length) ? ai.timeline : ["Scheduling & prep", "Core works", "Finishing & handover"];
    md += "## Timeline (indicative)\n\n";
    md += timeline.map(t => "- " + t).join("\n") + "\n\n";

    // Cost summary
    md += "## Cost Summary\n\n";
    md += "| Description | Amount |\n|-------------|-------:|\n";
    md += "| Materials Subtotal | " + fmt(_materialsSubtotal) + " |\n";
    md += "| Labour Subtotal | " + fmt(_labourSubtotal) + " |\n";
    md += "| Subcontractors | " + fmt(_subsTotal) + " |\n";
    md += "| Equipment / Hire | " + fmt(_equipTotal) + " |\n";
    md += "| Overhead (" + toNumber(overheadPctWhole) + "%) | " + fmt(_overhead) + " |\n";
    if (toNumber(contingencyPctWhole) > 0) md += "| Contingency (" + toNumber(contingencyPctWhole) + "%) | " + fmt(_contingency) + " |\n";
    md += "| Margin (" + toNumber(marginPctWhole) + "%) | " + fmt(_margin) + " |\n";
    md += "| **Subtotal** | **" + fmt(_subtotal) + "** |\n";
    if (includeGST) md += "| **GST (" + (gstRate*100).toFixed(0) + "%)** | **" + fmt(_gst) + "** |\n";
    md += "| **Total (AUD)** | **" + fmt(_grandTotal) + "** |\n\n";

    // Terms
    md += "## Terms, Validity & Acceptance\n\n";
    md += "**Estimate validity:** " + validityDays + " days from the date of issue.  \n";
    md += "**Payment terms:** Deposit on acceptance; balance as agreed.  \n";
    md += "**Warranty:** Workmanship warranty per trade standards; manufacturer warranties apply to materials.  \n\n";
    md += "**Acceptance:** I, ______________________ (Client), accept this estimate and agree to proceed.  \n";
    md += "Signature: __________________  Date: ________________\n";

    output = md;
    loading = false;
  }

  function copyOut() { try { navigator.clipboard.writeText(output || ""); } catch {} }
  function downloadOut() {
    const blob = new Blob([output || ""], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "estimate-quote.md"; a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head><title>Job Estimation Wizard</title></svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-semibold">Job Estimation Wizard</h1>
      <p class="text-sm opacity-70">Type a short brief, optionally add materials, and generate a client-ready quote. Advanced is optional.</p>
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
        <textarea class="textarea textarea-bordered h-24" bind:value={projectBrief} placeholder="Describe the job in your words. We’ll draft the overview, tailored scope, assumptions, risks and timeline."></textarea>
      </label>
    </div>

    <div class="alert alert-warning">
      <span>
        <strong>Materials:</strong> Paste rows from the
        <a href="/account/caption/material-cost" class="link link-primary">Material &amp; Cost Calculator</a>
        and click <strong>Add items</strong>. Example format:<br>
        <code>Split system 7.1kW | 2 | ea | 1750 | 10</code>
      </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Materials -->
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body gap-3">
          <h2 class="card-title text-base">Materials (paste → Add items)</h2>
          <textarea class="textarea textarea-bordered h-28" bind:value={materialsText} on:blur={autoParseOnBlur} placeholder="One row per line. Example:
Split system 7.1kW | 2 | ea | 1750 | 10
Copper pipe | 20 | m | 12.5 | 15"></textarea>
          <div class="flex items-center gap-2">
            <button type="button" class="btn btn-sm btn-outline" on:click={parseMaterials}>Add items</button>
            {#if parseFeedback}<span class="text-xs opacity-70">{parseFeedback}</span>{/if}
          </div>

          <div class="overflow-x-auto">
            {#if materials.length}
            <table class="table table-sm">
              <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Unit Cost</th><th>Markup %</th><th>Line Total</th></tr></thead>
              <tbody>
                {#each materials as m, i}
                <tr>
                  <td><input class="input input-bordered input-xs w-48" bind:value={m.item}></td>
                  <td><input type="number" class="input input-bordered input-xs w-20" bind:value={m.qty}></td>
                  <td><input class="input input-bordered input-xs w-20" bind:value={m.unit}></td>
                  <td><input type="number" step="0.01" class="input input-bordered input-xs w-24" bind:value={m.unitCost}></td>
                  <td><input type="number" step="1" class="input input-bordered input-xs w-20" bind:value={m.markupPctWhole}></td>
                  <td class="text-right">{fmt(matLineTotal(m))}</td>
                </tr>
                {/each}
              </tbody>
            </table>
            {:else}
            <div class="text-xs opacity-70">No materials added yet.</div>
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
                  <td class="text-right">{fmt((Number(l.hours)||0)*(Number(l.rate)||0))}</td>
                  <td><button type="button" class="btn btn-xs btn-ghost" on:click={() => removeLabour(i)}>✕</button></td>
                </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-sm" on:click={addLabour}>+ Add labour row</button>

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
                  <td><button type="button" class="btn btn-xs btn-ghost" on:click={() => removeSub(i)}>✕</button></td>
                </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-sm" on:click={addSub}>+ Add subcontractor</button>

          <div class="overflow-x-auto mt-3">
            <table class="table table-sm">
              <thead><tr><th>Equipment/Hire</th><th class="text-right">Amount</th><th></th></tr></thead>
              <tbody>
                {#each equipment as s, i}
                <tr>
                  <td><input class="input input-bordered input-xs w-48" bind:value={s.label}></td>
                  <td><input type="number" step="0.01" class="input input-bordered input-xs w-28 text-right" bind:value={s.amount}></td>
                  <td><button type="button" class="btn btn-xs btn-ghost" on:click={() => removeEquip(i)}>✕</button></td>
                </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <button type="button" class="btn btn-sm" on:click={addEquip}>+ Add equipment</button>
        </div>
      </div>
    </div>

    <!-- Advanced (collapsible) -->
    <details class="card bg-base-100 border border-base-300">
      <summary class="card-body cursor-pointer">
        <h2 class="card-title text-base">Advanced (optional) <span class="opacity-60 text-xs">(click to expand)</span></h2>
        <p class="text-xs opacity-70">Smart, trade-ready assistants to draft proposals, build estimates, and create client-ready docs.</p>
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
            <div><div class="opacity-60">Overhead</div><div class="font-semibold">{fmt(baseSubtotal * (Number(overheadPctWhole)/100))}</div></div>
            <div><div class="opacity-60">Subtotal</div><div class="font-semibold">{fmt(subtotal)}</div></div>
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
            <span class="label-text">Include GST ({(gstRate*100).toFixed(0)}%)</span>
          </label>
          <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}>Copy</button>
          <button type="button" class="btn btn-outline" on:click={downloadOut} disabled={!output}>Download .md</button>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <p class="text-xs opacity-70">
            Tip: Get material lines from the <a href="/account/caption/material-cost" class="link link-primary">Material &amp; Cost Calculator</a>, then paste and click <strong>Add items</strong>.
          </p>
        </div>
      </div>
    </div>
  </form>

  <!-- Output -->
  {#if output}
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-base">Quote Preview (Markdown)</h2>
      <pre class="whitespace-pre-wrap text-sm">{output}</pre>
    </div>
  </div>
  {/if}
</section>

<!-- Rich preview (non-breaking): keep old output above until verified -->
{#if (
  typeof answer !== "undefined" && String(answer || "").trim() ||
  typeof output !== "undefined" && String(output || "").trim() ||
  typeof result !== "undefined" && String(result || "").trim()
)}
  <div class="card bg-base-100 border mt-4">
    <div class="card-body">
      <h3 class="card-title text-base">Formatted answer (preview)</h3>
      <RichAnswer content={(answer ?? output ?? result ?? "")} />
    </div>
  </div>
{/if}


<!-- Rich Answer preview (non-invasive; keeps old markdown too) -->
{#if typeof answer === "string" && answer.trim().length}
  <div class="mt-6">
    <RichAnswer text={answer} />
    <div class="mt-2 flex gap-2">
      <button type="button"
              class="btn btn-outline btn-sm"
              on:click={() => navigator.clipboard.writeText(answer)}>
        Copy answer
      </button>
    </div>
  </div>
{/if}
