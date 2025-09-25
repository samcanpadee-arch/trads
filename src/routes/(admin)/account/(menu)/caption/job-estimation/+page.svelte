<!-- /account/caption/job-estimation -->
<script lang="ts">
  /***** STATE *****/
  // Core meta
  let businessName = "";
  let abn = "";
  let contact = "";
  let contactEmail = "";
  let contactPhone = "";

  let clientName = "";
  let siteAddress = "";
  let projectTitle = "";

  // Trade presets
  type Trade = "General" | "HVAC" | "Electrical" | "Plumbing" | "Carpentry" | "Tiling" | "Construction" | "Landscaping" | "Painting" | "Other";
  let trade: Trade = "General";

  // Validity / tax / pricing controls
  let validityDays = 30;
  let includeGST = true;
  let gstRate = 0.10;
  let overheadPct = 0.10;   // applied to (materials + labour + subs + equipment)
  let marginPct = 0.10;     // applied to (materials + labour + subs + equipment + overhead)
  let contingencyPct = 0.00; // optional

  // Materials (paste friendly)
  type MaterialRow = { item: string; qty: number; unit: string; unitCost: number; markupPct: number; note?: string; };
  let materialsText = "";  // raw paste area
  let materials: MaterialRow[] = []; // parsed

  // Labour
  type LabourRow = { role: string; hours: number; rate: number; note?: string; };
  let labour: LabourRow[] = [];

  // Subs / equipment
  type SimpleCost = { label: string; amount: number; note?: string; };
  let subcontractors: SimpleCost[] = [];
  let equipment: SimpleCost[] = [];

  // Notes
  let exclusions = "";
  let assumptions = "";
  let specialInstructions = "";

  // Optional AI enhancement (adds a polished scope/overview paragraph)
  let aiEnhance = true;
  let model = "gpt-4o-mini";
  let loading = false;

  // Helpers: trade presets (starting labour roles & typical notes)
  const tradeLabourPresets: Record<Trade, LabourRow[]> = {
    General: [{ role: "Tradesperson", hours: 8, rate: 85 }],
    HVAC: [{ role: "HVAC Technician", hours: 8, rate: 95 }, { role: "Electrician", hours: 2, rate: 90 }],
    Electrical: [{ role: "Electrician", hours: 8, rate: 90 }, { role: "Apprentice", hours: 4, rate: 55 }],
    Plumbing: [{ role: "Plumber", hours: 8, rate: 90 }, { role: "Apprentice", hours: 4, rate: 55 }],
    Carpentry: [{ role: "Carpenter", hours: 8, rate: 85 }, { role: "Labourer", hours: 4, rate: 60 }],
    Tiling: [{ role: "Tiler", hours: 8, rate: 85 }],
    Construction: [{ role: "Builder", hours: 8, rate: 95 }, { role: "Labourer", hours: 4, rate: 60 }],
    Landscaping: [{ role: "Landscaper", hours: 8, rate: 80 }],
    Painting: [{ role: "Painter", hours: 8, rate: 75 }],
    Other: [{ role: "Tradesperson", hours: 8, rate: 85 }]
  };

  $: if (labour.length === 0) labour = structuredClone(tradeLabourPresets[trade]);

  // Parse materialsText into rows (flexible: CSV/TSV/pipe-separated; columns: item, qty, unit, unitCost, markup%)
  function parseMaterials() {
    materials = [];
    const lines = materialsText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const parts = line.split(/\s*\|\s*|\s*,\s*|\s+\t\s+|\t/g).map(p => p.trim());
      if (!parts.length) continue;
      const [item, qtyRaw = "1", unit = "", unitCostRaw = "0", markupRaw = "0"] = parts;
      const qty = Number((qtyRaw || "1").toString().replace(/[^0-9.\-]/g, "")) || 1;
      const unitCost = Number((unitCostRaw || "0").toString().replace(/[^0-9.\-]/g, "")) || 0;
      const markupPct = Number((markupRaw || "0").toString().replace(/[^0-9.\-]/g, "")) / 100 || 0;
      materials.push({ item, qty, unit, unitCost, markupPct });
    }
  }

  function addLabour() { labour = [...labour, { role: "", hours: 0, rate: 0 }]; }
  function removeLabour(i: number) { labour = labour.filter((_, idx) => idx !== i); }
  function addSub() { subcontractors = [...subcontractors, { label: "", amount: 0 }]; }
  function removeSub(i: number) { subcontractors = subcontractors.filter((_, idx) => idx !== i); }
  function addEquip() { equipment = [...equipment, { label: "", amount: 0 }]; }
  function removeEquip(i: number) { equipment = equipment.filter((_, idx) => idx !== i); }

  // Totals
  function matLineTotal(m: MaterialRow) { const base = m.qty * m.unitCost; return base + base * (m.markupPct || 0); }
  $: materialsSubtotal = materials.reduce((s, m) => s + matLineTotal(m), 0);
  $: labourSubtotal = labour.reduce((s, l) => s + (l.hours * l.rate), 0);
  $: subsTotal = subcontractors.reduce((s, x) => s + (x.amount || 0), 0);
  $: equipTotal = equipment.reduce((s, x) => s + (x.amount || 0), 0);
  $: baseSubtotal = materialsSubtotal + labourSubtotal + subsTotal + equipTotal;
  $: overhead = baseSubtotal * (overheadPct || 0);
  $: withOverhead = baseSubtotal + overhead;
  $: contingency = withOverhead * (contingencyPct || 0);
  $: withContingency = withOverhead + contingency;
  $: margin = withContingency * (marginPct || 0);
  $: subtotal = withContingency + margin;
  $: gst = includeGST ? subtotal * (gstRate || 0) : 0;
  $: grandTotal = subtotal + gst;

  // Currency helper
  const fmt = (n: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 }).format(n || 0);

  // Build Markdown output
  let output = "";
  async function generate(e: Event) {
    e.preventDefault();
    let md = `# Job Estimate (Quote)\n\n`;
    md += `**From:** ${businessName || "_Your Business_"}  \n`;
    if (abn) md += `**ABN:** ${abn}  \n`;
    md += `**Contact:** ${contact || ""}${contactEmail ? " | " + contactEmail : ""}${contactPhone ? " | " + contactPhone : ""}\n\n`;
    md += `**To:** ${clientName || "_Client_"}  \n`;
    md += `**Site:** ${siteAddress || "_Site Address_"}  \n`;
    md += `**Project:** ${projectTitle || \`\${trade} Works\`}  \n`;
    md += `**Estimate Valid For:** ${validityDays} days\n\n`;
    md += `> **Disclaimer:** Some values may be *estimated*. Please review and confirm quantities, rates, and assumptions before sending to your client.\n\n`;

    // Optional AI overview/scope
    let aiSection = "";
    if (aiEnhance) {
      loading = true;
      try {
        const SYSTEM_PROMPT = `You are an AI consultant for Australian tradies. Write a concise, client-friendly overview and scope paragraph in Australian English for a ${trade} job. Avoid prices; focus on what will be done and quality/safety/compliance. Keep it under 120 words.`;
        const user = [
          \`Client: \${clientName || "TBA"}\`,
          \`Site: \${siteAddress || "TBA"}\`,
          \`Project title: \${projectTitle || \`\${trade} Works\`}\`,
          \`Trade: \${trade}\`,
          \`Notes: \${specialInstructions || ""}\`
        ].join("\\n");

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: user }
          ]})
        });

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          while (true) {
            const chunk = await reader.read();
            if (chunk.done) break;
            aiSection += decoder.decode(chunk.value);
          }
        }
      } catch {}
      finally { loading = false; }
    }

    if (aiSection) {
      md += `## Overview\n\n${aiSection.trim()}\n\n`;
    }

    // Scope table from labour roles (labels only)
    md += `## Scope / Services\n\n`;
    md += `| # | Task Description |\n|---|------------------|\n`;
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
    const tasks = baseTasks[trade] || baseTasks.General;
    tasks.forEach((t, i) => { md += `| ${i + 1} | ${t} |\n`; });
    md += `\n`;

    // Materials
    md += `## Materials\n\n`;
    if (materials.length) {
      md += `| Item | Qty | Unit | Unit Cost | Mark-up % | Line Total |\n|------|-----|------|----------:|----------:|-----------:|\n`;
      for (const m of materials) {
        md += `| ${m.item} | ${m.qty} | ${m.unit || "-"} | ${fmt(m.unitCost)} | ${((m.markupPct||0)*100).toFixed(0)}% | ${fmt(matLineTotal(m))} |\n`;
      }
      md += `\n**Materials Subtotal:** ${fmt(materialsSubtotal)}\n\n`;
    } else {
      md += `_No materials entered — consider pasting from your calculator (see page form)._\n\n`;
    }

    // Labour
    md += `## Labour\n\n`;
    if (labour.length) {
      md += `| Role | Hours | Rate | Total |\n|------|------:|-----:|------:|\n`;
      for (const l of labour) {
        md += `| ${l.role || "-"} | ${l.hours || 0} | ${fmt(l.rate || 0)} | ${fmt((l.hours||0)*(l.rate||0))} |\n`;
      }
      md += `\n**Labour Subtotal:** ${fmt(labourSubtotal)}\n\n`;
    } else {
      md += `_No labour entered._\n\n`;
    }

    // Subs / Equipment
    md += `## Subcontractors / Equipment\n\n`;
    if (subcontractors.length || equipment.length) {
      if (subcontractors.length) {
        md += `**Subcontractors**\n\n| Item | Cost |\n|------|-----:|\n`;
        subcontractors.forEach(s => { md += `| ${s.label || "-"} | ${fmt(s.amount || 0)} |\n`; });
        md += `\n`;
      }
      if (equipment.length) {
        md += `**Equipment / Hire**\n\n| Item | Cost |\n|------|-----:|\n`;
        equipment.forEach(s => { md += `| ${s.label || "-"} | ${fmt(s.amount || 0)} |\n`; });
        md += `\n`;
      }
    } else {
      md += `_None._\n\n`;
    }

    // Summary
    md += `## Cost Summary\n\n`;
    md += `| Description | Amount |\n|-------------|-------:|\n`;
    md += `| Materials Subtotal | ${fmt(materialsSubtotal)} |\n`;
    md += `| Labour Subtotal | ${fmt(labourSubtotal)} |\n`;
    md += `| Subcontractors | ${fmt(subsTotal)} |\n`;
    md += `| Equipment / Hire | ${fmt(equipTotal)} |\n`;
    md += `| Overhead (${(overheadPct*100).toFixed(0)}%) | ${fmt(overhead)} |\n`;
    if (contingencyPct > 0) md += `| Contingency (${(contingencyPct*100).toFixed(0)}%) | ${fmt(contingency)} |\n`;
    md += `| Margin (${(marginPct*100).toFixed(0)}%) | ${fmt(margin)} |\n`;
    md += `| **Subtotal** | **${fmt(subtotal)}** |\n`;
    if (includeGST) {
      md += `| **GST (${(gstRate*100).toFixed(0)}%)** | **${fmt(gst)}** |\n`;
      md += `| **Total (AUD)** | **${fmt(grandTotal)}** |\n`;
    } else {
      md += `| **Total (AUD)** | **${fmt(grandTotal)}** |\n`;
    }
    md += `\n`;

    // Assumptions / exclusions / instructions
    md += `## Assumptions & Exclusions\n\n`;
    md += (assumptions?.trim() || exclusions?.trim())
      ? ((assumptions ? `**Assumptions:**\n${assumptions}\n\n` : "") + (exclusions ? `**Exclusions:**\n${exclusions}\n\n` : ""))
      : `_Standard working hours Mon–Fri; no structural changes; no asbestos; surface preparation assumed standard; client to provide clear access._\n\n`;

    md += `## Special Instructions / Client Requests\n\n`;
    md += specialInstructions?.trim() ? `${specialInstructions}\n\n` : `_None._\n\n`;

    // Terms / acceptance
    md += `## Terms, Validity & Acceptance\n\n`;
    md += `**Estimate validity:** ${validityDays} days from the date of issue.  \n`;
    md += `**Payment terms:** Deposit on acceptance; balance as agreed.  \n`;
    md += `**Warranty:** Workmanship warranty per trade standards; manufacturer warranties apply to materials.  \n\n`;
    md += `**Acceptance:** I, ______________________ (Client), accept this estimate and agree to proceed.  \n`;
    md += `Signature: __________________  Date: ________________\n`;

    output = md;
  }

  function copyOut() { navigator.clipboard.writeText(output || ""); }
  function downloadOut() {
    const blob = new Blob([output || ""], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "estimate-quote.md"; a.click();
    URL.revokeObjectURL(url);
  }

  // Quick starter to demo parsing
  function fillDemo() {
    businessName = "BrightBuild Renovations";
    abn = "12 345 678 910";
    contact = "Sam Taylor";
    contactEmail = "estimates@brightbuild.au";
    contactPhone = "0400 123 456";
    clientName = "Jordan Moore";
    siteAddress = "12 Rivergum Rd, Brunswick VIC 3056";
    projectTitle = "Kitchen Renovation – 5m × 4m";
    trade = "Carpentry";
    validityDays = 30;
    includeGST = true;
    overheadPct = 0.10;
    marginPct = 0.10;
    contingencyPct = 0.05;

    materialsText = [
      "Engineered stone benchtop | 1 | ea | 3000 | 10",
      "Ceramic subway tile | 50 | m2 | 60 | 15",
      "LED downlights | 6 | ea | 80 | 20"
    ].join("\\n");
    parseMaterials();

    labour = [
      { role: "Carpenter", hours: 40, rate: 85 },
      { role: "Electrician", hours: 12, rate: 90 },
      { role: "Plumber", hours: 10, rate: 85 }
    ];

    subcontractors = [{ label: "Stone fabricator", amount: 1200 }];
    equipment = [{ label: "Scaffold / hire", amount: 250 }];

    exclusions = "- Structural changes\n- Asbestos removal\n- Painting beyond patching";
    assumptions = "- Standard access and parking\n- Work hours Mon–Fri 7am–4pm";
    specialInstructions = "Keep kitchen semi-operational where possible; protect timber floors.";
  }
</script>

<svelte:head><title>Job Estimation Wizard</title></svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-semibold">Job Estimation Wizard</h1>
      <p class="text-sm opacity-70">Quote-style estimate with materials import, labour breakdown, overheads, margin & GST.</p>
    </div>
    <a href="/account/caption" class="btn btn-ghost">← Back</a>
  </header>

  <!-- Quick disclaimer -->
  <div class="alert alert-warning">
    <span><strong>Heads up:</strong> Some figures may be inferred. Please review and confirm before sending to your client.</span>
  </div>

  <!-- Form -->
  <form class="grid grid-cols-1 gap-4 2xl:grid-cols-3" on:submit={generate}>
    <!-- Column 1: Business / Client -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body gap-3">
        <h2 class="card-title text-base">Business</h2>
        <label class="form-control"><span class="label-text">Business name</span><input class="input input-bordered" bind:value={businessName} /></label>
        <label class="form-control"><span class="label-text">ABN</span><input class="input input-bordered" bind:value={abn} /></label>
        <label class="form-control"><span class="label-text">Contact</span><input class="input input-bordered" bind:value={contact} /></label>
        <label class="form-control"><span class="label-text">Email</span><input type="email" class="input input-bordered" bind:value={contactEmail} /></label>
        <label class="form-control"><span class="label-text">Phone</span><input class="input input-bordered" bind:value={contactPhone} /></label>

        <div class="divider my-2"></div>

        <h2 class="card-title text-base">Client & Job</h2>
        <label class="form-control"><span class="label-text">Client name</span><input class="input input-bordered" bind:value={clientName} /></label>
        <label class="form-control"><span class="label-text">Site address</span><input class="input input-bordered" bind:value={siteAddress} /></label>
        <label class="form-control"><span class="label-text">Project title</span><input class="input input-bordered" bind:value={projectTitle} placeholder="e.g. Switchboard upgrade, 22 circuits" /></label>
        <label class="form-control">
          <span class="label-text">Trade</span>
          <select class="select select-bordered" bind:value={trade} aria-label="Trade">
            <option>General</option><option>HVAC</option><option>Electrical</option><option>Plumbing</option><option>Carpentry</option><option>Tiling</option><option>Construction</option><option>Landscaping</option><option>Painting</option><option>Other</option>
          </select>
        </label>

        <div class="grid grid-cols-2 gap-3">
          <label class="form-control"><span class="label-text">Validity (days)</span><input type="number" min="1" class="input input-bordered" bind:value={validityDays} /></label>
          <label class="label cursor-pointer justify-start gap-3">
            <input type="checkbox" class="checkbox" bind:checked={includeGST} />
            <span class="label-text">Include GST ({(gstRate*100).toFixed(0)}%)</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Column 2: Materials / Labour -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body gap-4">
        <h2 class="card-title text-base">Materials</h2>
        <p class="text-xs opacity-70">
          Paste from your calculator. Columns accepted (any separator: pipe/CSV/tab): <em>Item | Qty | Unit | Unit Cost | Mark-up %</em>.
        </p>
        <textarea class="textarea textarea-bordered h-28" bind:value={materialsText} placeholder="e.g.
Ceramic subway tile | 50 | m2 | 60 | 15
LED downlights | 6 | ea | 80 | 20"></textarea>
        <div class="flex gap-2">
          <button type="button" class="btn btn-sm btn-outline" on:click={parseMaterials}>Parse Materials</button>
          <button type="button" class="btn btn-sm" on:click={fillDemo}>Fill demo</button>
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
                <td><input type="number" step="1" class="input input-bordered input-xs w-20" bind:value={m.markupPct} on:change={(e)=>m.markupPct=(Number((e.currentTarget as HTMLInputElement).value)||0)/100}></td>
                <td class="text-right">{fmt(matLineTotal(m))}</td>
              </tr>
              {/each}
            </tbody>
          </table>
          {:else}
          <div class="text-xs opacity-70">No materials parsed yet.</div>
          {/if}
        </div>

        <div class="divider my-2"></div>

        <h2 class="card-title text-base">Labour</h2>
        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead><tr><th>Role</th><th>Hours</th><th>Rate</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {#each labour as l, i}
              <tr>
                <td><input class="input input-bordered input-xs w-40" bind:value={l.role}></td>
                <td><input type="number" min="0" class="input input-bordered input-xs w-20" bind:value={l.hours}></td>
                <td><input type="number" step="0.01" class="input input-bordered input-xs w-24" bind:value={l.rate}></td>
                <td class="text-right">{fmt((l.hours||0)*(l.rate||0))}</td>
                <td><button type="button" class="btn btn-xs btn-ghost" on:click={() => removeLabour(i)}>✕</button></td>
              </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <button type="button" class="btn btn-sm" on:click={addLabour}>+ Add labour row</button>
      </div>
    </div>

    <!-- Column 3: Subs/Equip, Pricing Controls, Notes -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body gap-3">
        <h2 class="card-title text-base">Subs & Equipment</h2>
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

        <div class="divider my-2"></div>

        <div class="overflow-x-auto">
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

        <div class="divider my-2"></div>

        <h2 class="card-title text-base">Pricing Controls</h2>
        <div class="grid grid-cols-2 gap-3">
          <label class="form-control"><span class="label-text">Overhead %</span><input type="number" min="0" step="1" class="input input-bordered" bind:value={overheadPct} on:input={(e)=>overheadPct=(Number((e.currentTarget as HTMLInputElement).value)||0)/100}></label>
          <label class="form-control"><span class="label-text">Margin %</span><input type="number" min="0" step="1" class="input input-bordered" bind:value={marginPct} on:input={(e)=>marginPct=(Number((e.currentTarget as HTMLInputElement).value)||0)/100}></label>
          <label class="form-control"><span class="label-text">Contingency %</span><input type="number" min="0" step="1" class="input input-bordered" bind:value={contingencyPct} on:input={(e)=>contingencyPct=(Number((e.currentTarget as HTMLInputElement).value)||0)/100}></label>
          <label class="label cursor-pointer justify-start gap-3">
            <input type="checkbox" class="checkbox" bind:checked={includeGST} />
            <span class="label-text">Include GST ({(gstRate*100).toFixed(0)}%)</span>
          </label>
        </div>

        <div class="divider my-2"></div>

        <h2 class="card-title text-base">Notes</h2>
        <label class="form-control"><span class="label-text">Assumptions</span><textarea class="textarea textarea-bordered h-20" bind:value={assumptions}></textarea></label>
        <label class="form-control"><span class="label-text">Exclusions</span><textarea class="textarea textarea-bordered h-20" bind:value={exclusions}></textarea></label>
        <label class="form-control"><span class="label-text">Special instructions / client requests</span><textarea class="textarea textarea-bordered h-20" bind:value={specialInstructions}></textarea></label>

        <div class="divider my-2"></div>

        <label class="label cursor-pointer justify-start gap-3">
          <input type="checkbox" class="checkbox" bind:checked={aiEnhance} />
          <span class="label-text">Enhance Overview/Scope with AI</span>
        </label>

        <div class="mt-2 flex flex-wrap items-center gap-2">
          <button class="btn btn-primary" type="submit" disabled={loading}>
            {#if loading}<span class="loading loading-dots"></span>{/if}
            <span>Generate Quote</span>
          </button>
          <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}>Copy</button>
          <button type="button" class="btn btn-outline" on:click={downloadOut} disabled={!output}>Download .md</button>
        </div>
      </div>
    </div>
  </form>

  <!-- Live totals widget -->
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-base">Totals</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 text-sm">
        <div><div class="opacity-60">Materials</div><div class="font-semibold">{fmt(materialsSubtotal)}</div></div>
        <div><div class="opacity-60">Labour</div><div class="font-semibold">{fmt(labourSubtotal)}</div></div>
        <div><div class="opacity-60">Subs</div><div class="font-semibold">{fmt(subsTotal)}</div></div>
        <div><div class="opacity-60">Equipment</div><div class="font-semibold">{fmt(equipTotal)}</div></div>
        <div><div class="opacity-60">Overhead</div><div class="font-semibold">{fmt(overhead)}</div></div>
        <div><div class="opacity-60">Subtotal</div><div class="font-semibold">{fmt(subtotal)}</div></div>
        {#if includeGST}
          <div><div class="opacity-60">GST</div><div class="font-semibold">{fmt(gst)}</div></div>
        {/if}
        <div><div class="opacity-60">Total (AUD)</div><div class="font-semibold">{fmt(grandTotal)}</div></div>
      </div>
    </div>
  </div>

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
