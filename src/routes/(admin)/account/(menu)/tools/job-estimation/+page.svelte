<!-- /account/tools/job-estimation (v4.0 — streamlined text-first estimator) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);
  const cleanStr = (value: string | null | undefined) => (value ?? "").trim();
  const defaultTradieName = cleanStr(profile?.full_name);
  const defaultBusinessName = cleanStr(profile?.company_name);
  const defaultBusinessPhone = "";
  const defaultBusinessWebsite = cleanStr(profile?.website);

  let tradieName = defaultTradieName;
  let businessName = defaultBusinessName;
  let businessPhone = defaultBusinessPhone;
  let businessWebsite = defaultBusinessWebsite;
  let clientName = "";
  let siteAddress = "";
  let projectBrief = ""; // drives AI (overview/scope/assumptions/risks/timeline)
  let costsText = "";

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
  type PercentAdj = { label: string; percent: number; context?: string };
  type ParsedBlock = { entries: ParsedEntry[]; percentAdjustments: PercentAdj[]; notes: string[] };
  type MarkupEntry = { label: string; percent: number; amount: number; context?: string };

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
  const fmtPercent = (value: number) => {
    if (!Number.isFinite(value)) return "";
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
  };

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

  const currencyRe =
    /((?:AUD\s*)?(?:A\$|\$)\s*\d[\d,]*(?:\.\d{1,2})?(?:\s?[kK])?|\b\d[\d,]{2,}(?:\.\d{1,2})?\b|\b\d[\d,]*(?:\.\d{1,2})?\s?[kK]\b)/gi;
  const percentRe = /(\d+(?:\.\d+)?)\s*%/gi;
  const HOURS_PER_DAY = 8;
  const wordNumberMap: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12
  };

  function cleanLabel(label: string) {
    if (!label) return "";
    let out = label;
    const colonIdx = out.indexOf(":");
    if (colonIdx !== -1) {
      out = out.slice(0, colonIdx);
    }
    out = out
      .replace(/\([^()]*\)\s*$/g, "")
      .replace(/\b(allowance|approx|approximately|around|about|allowing|allow)\b$/gi, "")
      .replace(/[–—-]+$/g, "")
      .replace(/\b(is|are|at|for|approx|around|about|to|more|extra)\b$/i, "")
      .replace(/\s+/g, " ")
      .trim();
    return out;
  }

  function toAmount(raw: string) {
    const hasK = /k$/i.test(raw.trim());
    const cleaned = raw.replace(/[^0-9.-]/g, "").replace(/k$/i, "");
    const n = toNumber(cleaned, NaN);
    if (!Number.isFinite(n)) return NaN;
    return hasK ? n * 1000 : n;
  }

  function toQuantity(fragment: string | undefined | null) {
    if (!fragment) return null;
    const cleaned = fragment.trim().toLowerCase();
    if (cleaned in wordNumberMap) {
      return wordNumberMap[cleaned];
    }
    const numeric = Number(cleaned.replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? numeric : null;
  }

  type DurationUnit = "hour" | "day";

  function detectLabourAllowance(line: string): ParsedEntry | null {
    if (!line) return null;
    const rateMatch = line.match(
      /(?:@\s*)?(?:about\s+|approx(?:\.|\s+))?(\$[\d,]+(?:\.\d+)?)(?:\s*(?:\/|per)\s*)(hour|hr|hrs?|day|days|shift)/i
    );
    if (!rateMatch) return null;
    const rate = toAmount(rateMatch[1]);
    if (!Number.isFinite(rate) || rate <= 0) return null;
    const rateUnit: DurationUnit = /day|shift/i.test(rateMatch[2]) ? "day" : "hour";
    const workerMatch = line.match(
      /(\d+(?:\.\d+)?|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b)\s*(?:techs?|technicians?|trad(?:es)?people|installers?|sparkies|electricians?|plumbers?|crew|workers?|team|staff)/i
    );
    const workerQty = toQuantity(workerMatch?.[1]) ?? 1;
    const durationMatch = line.match(
      /(\d+(?:\.\d+)?|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b)\s*(?:full\s+|business\s+|working\s+)?(days?|day|hours?|hrs?|h)/i
    );
    let durationValue = durationMatch ? toQuantity(durationMatch[1]) ?? 1 : 1;
    let durationUnit: DurationUnit = durationMatch
      ? (/day/i.test(durationMatch[2]) ? "day" : "hour")
      : rateUnit;
    if (!durationMatch && rateUnit === "hour") {
      durationValue = HOURS_PER_DAY;
      durationUnit = "hour";
    }
    let totalUnits = durationValue;
    if (durationUnit === "day" && rateUnit === "hour") {
      totalUnits = durationValue * HOURS_PER_DAY;
    } else if (durationUnit === "hour" && rateUnit === "day") {
      totalUnits = durationValue / HOURS_PER_DAY;
    }
    const amount = workerQty * totalUnits * rate;
    if (!Number.isFinite(amount) || amount <= 0) return null;
    const label = cleanLabel(line) || "Labour allowance";
    return { label, amount };
  }

  function listToParagraph(items: string[]) {
    return items
      .map((item) => item.replace(/^[-•\s]+/, "").trim())
      .filter(Boolean)
      .join(" ");
  }

  function parseCostContext(text: string): ParsedBlock {
    const entries: ParsedEntry[] = [];
    const percentAdjustments: PercentAdj[] = [];
    const notes: string[] = [];

    (text || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .forEach((line) => {
        if (!line) return;
        let matchedAmount = false;
        const labourAllowance = detectLabourAllowance(line);
        if (labourAllowance) {
          entries.push(labourAllowance);
          matchedAmount = true;
        }
        const matches = labourAllowance ? [] : [...line.matchAll(currencyRe)];
        matches.forEach((match) => {
          if (!match[0]) return;
          const raw = match[0];
          const start = match.index ?? 0;
          const amount = toAmount(raw);
          if (!Number.isFinite(amount)) {
            return;
          }
          const nextChar = line[start + raw.length];
          const hasCurrencySymbol = /\$|AUD|A\$/i.test(raw);
          if (!hasCurrencySymbol && amount < 100) {
            return;
          }
          if (nextChar && nextChar.trim().startsWith("%")) {
            return;
          }
          const around = line
            .slice(Math.max(0, start - 8), Math.min(line.length, start + raw.length + 8))
            .toLowerCase();
          const looksUnitRate =
            /(per\s|\/|@)\s*(hour|hr|day|week|shift)/i.test(around) || /\b(hr|hour|day|days)\b/.test(around);
          if (looksUnitRate && !/total|sum|allowance|visit|call|mobilisation|materials|supply|install|markup/i.test(line)) {
            return;
          }
          const before = cleanLabel(line.slice(0, start));
          const after = cleanLabel(line.slice(start + raw.length));
          const label = before || after || cleanLabel(line) || "Allowance";
          entries.push({ label, amount });
          matchedAmount = true;
        });

        const percentMatches = [...line.matchAll(percentRe)];
        if (percentMatches.length) {
          percentMatches.forEach((p) => {
            const pct = toNumber(p[1], NaN);
            if (!Number.isFinite(pct)) return;
            const label = cleanLabel(line) || `${pct}% allowance`;
            percentAdjustments.push({ label, percent: pct, context: line });
          });
          matchedAmount = true;
        }

        if (!matchedAmount) {
          notes.push(line);
        }
      });

    return { entries, percentAdjustments, notes };
  }

  let parsedCosts: ParsedBlock = { entries: [], percentAdjustments: [], notes: [] };
  $: parsedCosts = parseCostContext(costsText);

  $: {
    const pct = Math.min(100, Math.max(0, Number(gstRateInput) || 0));
    if (pct !== gstRateInput) {
      gstRateInput = pct;
    }
    gstRate = pct / 100;
  }

  $: baseCostsTotal = parsedCosts.entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  let markupEntries: MarkupEntry[] = [];
  $: markupEntries = parsedCosts.percentAdjustments.map((adj) => ({
    label: adj.label,
    context: adj.context,
    percent: adj.percent,
    amount: baseCostsTotal * ((adj.percent || 0) / 100)
  }));
  $: markupTotal = markupEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  $: clientSubtotal = baseCostsTotal + markupTotal;
  const exampleCosts = `Materials & equipment: Supply and install Panasonic ducted system, dampers and controls – approx $20,000.
Labour effort: Two techs on site for 3 full days @ $95/hr each, apprentice support on day two for 6 hrs.
Program & supervision: 15% markup to cover design checks, procurement and warranty handling.
Access / cranage: Allowance of $1,100 for traffic control and crane if parking is limited.
Risks: Labour may increase if the existing switchboard needs upgrades or ceiling access is restricted.`;

  function useExample() {
    clientName = "Jordan Moore";
    siteAddress = "12 Rivergum Rd, Brunswick VIC 3056";
    trade = "Electrical";
    tradieName = "Taylor Reid";
    businessName = "Reid Electrical & Air";
    businessPhone = "0400 123 678";
    businessWebsite = "reidelectrical.au";
    projectBrief =
      "Remove and replace two existing split systems (7.1kW) in lounge and master. Reuse circuits if compliant; allow minor switchboard tidy-up. Patch penetrations and leave clean.";
    costsText = exampleCosts;
  }

  function resetAll() {
    tradieName = defaultTradieName;
    businessName = defaultBusinessName;
    businessPhone = defaultBusinessPhone;
    businessWebsite = defaultBusinessWebsite;
    clientName = "";
    siteAddress = "";
    projectBrief = "";
    costsText = "";
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
  type AICostItem = { label: string; amount: number; detail?: string };

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
    costSummary: AICostItem[];
    pricingNotes: string[];
  }> {
    const SYSTEM = `You are an AI assistant for Australian tradies. Reply in Australian English.
Return ONLY JSON with keys and detailed content:
- overview: string (≈150–220 words; client-facing; reference the brief, site realities and trade expertise)
- scope: string[] (8–12 bullets; each a concrete service activity tailored to the trade)
- assumptions: string[] (6–10 realistic assumptions)
- exclusions: string[] (4–8 clear boundaries)
- risks: string[] (4–8 site/brief-dependent risks to monitor)
- timeline: string[] (4–6 milestone-style bullets, each with a timeframe or dependency)
- options: string[] (3–6 upsell ideas NOT included)
- labourSuggest: {role,hours,rate}[] (only when helpful)
- costSummary: {label:string, amount:number, detail?:string}[] (convert the provided cost context into line items, combine similar allowances, calculate labour totals from hours/day rates if information is there, and include markups or contingencies as their own rows)
- pricingNotes: string[] (call out any special caveats, exclusions or assumptions tied to pricing)
Rules:
- Analyse the free-form pricing context and detected figures to produce professional totals rather than echoing the text.
- If labour rates are provided (e.g. two techs for 3 days @ $95/hr), multiply them out and explain the assumption in the detail field.
 - If only percentages are given (e.g. 15% markup), apply them to the detected base costs to estimate the amount.
 - Clean up spelling, casing and grammar of any user-provided allowance names before outputting them in tables.
 - Convert any percentage surcharges or call-out loadings into dollar figures using the detected base costs so totals remain accurate.
 - Always produce a timeline, even if you must infer it from trade best practice.
- Prefer practical Australian trade language.
- Never copy the user's raw cost sentences verbatim—rewrite allowances, markups and caveats in polished, client-facing language.
- Pricing notes should summarise the key assumptions or caveats from the brief instead of repeating the same sentences.`;

    const parsedCostLines = parsedCosts.entries
      .map((entry) => `${entry.label}: ${fmt(entry.amount)}`)
      .join("\n");
    const markupLines = markupEntries
      .map((entry) => `${entry.label} → +${fmt(entry.amount)}`)
      .join("\n");
    const notesBlock = parsedCosts.notes.map((note) => `- ${note}`).join("\n");
    const user =
      `Trade: ${trade}\n` +
      `Tradie name: ${tradieName || "N/A"}\n` +
      `Business: ${businessName || "N/A"}\n` +
      `Business phone: ${businessPhone || "N/A"}\n` +
      `Business website: ${businessWebsite || "N/A"}\n` +
      `Brief: ${projectBrief || "N/A"}\n` +
      `Client: ${clientName || "N/A"}\n` +
      `Site: ${siteAddress || "N/A"}\n\n` +
      `Cost context (raw):\n${costsText || "N/A"}\n\n` +
      (parsedCostLines ? `Detected dollar figures:\n${parsedCostLines}\n\n` : "") +
      (markupLines ? `Detected markups/contingencies:\n${markupLines}\n\n` : "") +
      (notesBlock ? `Non-dollar context to weave into pricing:\n${notesBlock}\n\n` : "") +
      `Current subtotal before GST (from user figures): ${fmt(clientSubtotal)}; Include GST: ${includeGST ? "Yes" : "No"}` +
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
          : [],
        costSummary: Array.isArray(j.costSummary)
          ? j.costSummary.map((row: Record<string, unknown>) => ({
              label: String(row.label || ""),
              amount: toNumber(row.amount, 0),
              detail: row.detail ? String(row.detail) : undefined
            }))
          : [],
        pricingNotes: Array.isArray(j.pricingNotes) ? j.pricingNotes.map(String) : []
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
        labourSuggest: [],
        costSummary: [],
        pricingNotes: []
      };
    }
  }

  async function generate(e: Event) {
    e.preventDefault();
    loading = true;

    const ai = await aiSections();
    const usingAISuggestedLabour = ai.labourSuggest.length > 0;
    const aiCostRows = ai.costSummary && ai.costSummary.length ? ai.costSummary : [];
    const aiCostRowsClean = aiCostRows.filter(
      (row) => (row.amount || 0) > 0 && !/(subtotal|total|gst|tax)/i.test(row.label || "")
    );
    const parsedPricingRows: AICostItem[] = parsedCosts.entries.map((entry) => ({
      label: entry.label,
      amount: entry.amount,
      detail: undefined
    }));
    const pricingSource: AICostItem[] = [];
    const seenLabels = new Set<string>();
    parsedPricingRows.forEach((row) => {
      const key = (row.label || "").toLowerCase();
      if (key) {
        seenLabels.add(key);
      }
      pricingSource.push(row);
    });
    if (pricingSource.length && aiCostRowsClean.length) {
      aiCostRowsClean.forEach((row) => {
        const key = (row.label || "").toLowerCase();
        if (!key || seenLabels.has(key) || !(row.amount || 0)) return;
        seenLabels.add(key);
        pricingSource.push(row);
      });
    } else if (!pricingSource.length && aiCostRowsClean.length) {
      pricingSource.push(...aiCostRowsClean);
    }
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
    md += `**Estimate Valid For:** ${validityDays} days  \n`;
    const preparedByPieces = [tradieName, businessName].filter((value) => value && value.trim().length);
    md += `**Prepared by:** ${
      preparedByPieces.length ? preparedByPieces.join(" — ") : "_Add your name or business before sending_"
    }  \n`;
    const contactPieces = [businessPhone, businessWebsite].filter((value) => value && value.trim().length);
    md += `**Contacts:** ${contactPieces.length ? contactPieces.join(" · ") : "_Add phone or website_"}\n\n`;

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

    md += `## Pricing Summary\n\n`;
    if (pricingSource.length) {
      md += `| Item | Amount (AUD) | Notes |\n|------|--------------:|-------|\n`;
      pricingSource.forEach((entry) => {
        const note = "detail" in entry && entry.detail ? entry.detail : "";
        md += `| ${entry.label || "Allowance"} | ${fmt(entry.amount || 0)} | ${note} |\n`;
      });
      let sourceSubtotal = pricingSource.reduce((sum, entry) => sum + (entry.amount || 0), 0);
      if (markupEntries.length && baseCostsTotal > 0) {
        markupEntries.forEach((adj) => {
          md += `| ${adj.label || "Markup"} | ${fmt(adj.amount)} | ${adj.percent ? `${fmtPercent(adj.percent)}% allowance on base costs` : "Markup applied"} |\n`;
        });
        sourceSubtotal += markupTotal;
      }
      md += `| **Subtotal** | **${fmt(sourceSubtotal)}** |  |\n`;
      if (includeGST) {
        const gstLine = sourceSubtotal * (gstRate || 0);
        md += `| **GST (${(gstRate * 100).toFixed(0)}%)** | **${fmt(gstLine)}** |  |\n`;
      }
      const totalLine = includeGST ? sourceSubtotal * (1 + (gstRate || 0)) : sourceSubtotal;
      md += `| **Client total (AUD)** | **${fmt(totalLine)}** |  |\n\n`;
    } else {
      md += `_Add any pricing context above (materials, labour, markups) so we can summarise it here._\n\n`;
    }
    const contextNotes = ai.pricingNotes && ai.pricingNotes.length ? ai.pricingNotes : [];
    if (contextNotes.length) {
      md += `**Pricing assumptions & reminders**\n\n`;
      md += `${listToParagraph(contextNotes)}\n\n`;
    }

    if (usingAISuggestedLabour && ai.labourSuggest.length) {
      const labourNarrative = ai.labourSuggest
        .map((row) => {
          const role = row.role ? row.role.trim() : "Crew";
          const hoursVal = Number(row.hours);
          const hoursLabel = Number.isFinite(hoursVal) && hoursVal > 0
            ? `${hoursVal % 1 === 0 ? hoursVal.toFixed(0) : hoursVal.toFixed(1)} hours`
            : "hours as required";
          const rateLabel = Number(row.rate) > 0 ? ` (allow ${fmt(row.rate)} for this crew type)` : "";
          return `${role} — approx ${hoursLabel}${rateLabel}.`;
        })
        .filter(Boolean);
      if (labourNarrative.length) {
        md += `## Crew & labour outlook\n\n`;
        md += labourNarrative.join(" ") + `\n\n`;
      }
    }

    md += `## Project considerations\n\n`;
    md += `**Working assumptions to confirm**\n\n${listToParagraph(assumptions)}\n\n`;
    if (ai.risks && ai.risks.length) {
      md += `**Site risks & watchpoints**\n\n${listToParagraph(ai.risks)}\n\n`;
    }
    md += `**Exclusions / outside this estimate**\n\n${listToParagraph(exclusions)}\n\n`;

    if (ai.options && ai.options.length) {
      md += `## Optional upgrades (quoted separately)\n\n`;
      md += ai.options.map((o) => `- ${o}`).join("\n") + `\n\n`;
    }

    md += `## Program & next steps\n\n`;
    md += timeline.map((t, idx) => `${idx + 1}. ${t}`).join("\n") + `\n\n`;
    md += `_Timeline is indicative and may shift after site verification or supplier lead times are confirmed._\n\n`;

    md += `## Payment Terms & Acceptance\n\n`;
    md += `**Estimate validity:** ${validityDays} days from the date of issue. After this period, pricing and availability of materials and labour may be subject to change. \n`;
    md += `**Payment terms:** A deposit is required to confirm your booking and secure materials. The remaining balance is payable once the job is completed, unless other arrangements have been agreed to in writing. Payment can be made by bank transfer, EFT, or another approved method.  \n`;
    md += `**Warranty:** Workmanship warranty per trade standards; manufacturer warranties apply to materials.  \n`;
    md += `**Business contact:** ${
      preparedByPieces.length ? preparedByPieces.join(" — ") : "Add your name and business"
    }${contactPieces.length ? ` · ${contactPieces.join(" · ")}` : ""}  \n`;
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

  <form class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm space-y-8 sm:p-6" on:submit={generate}>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <label class="form-control gap-2">
        <span class="label-text">Client name</span>
        <input
          class="input input-bordered w-full"
          bind:value={clientName}
          placeholder="Who’s the quote for or the main site contact?"
        />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Site address</span>
        <input
          class="input input-bordered w-full"
          bind:value={siteAddress}
          placeholder="Street, suburb and state so the AI references the right site."
        />
      </label>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <label class="form-control gap-2">
        <span class="label-text">Tradie or estimator name</span>
        <input
          class="input input-bordered w-full"
          bind:value={tradieName}
          placeholder="Who is preparing this estimate?"
        />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Business name</span>
        <input
          class="input input-bordered w-full"
          bind:value={businessName}
          placeholder="Trading or company name shown on the proposal."
        />
      </label>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <label class="form-control gap-2">
        <span class="label-text">Business phone</span>
        <input
          class="input input-bordered w-full"
          bind:value={businessPhone}
          placeholder="Best phone number for client follow-ups."
        />
      </label>
      <label class="form-control gap-2">
        <span class="label-text">Website or booking link</span>
        <input
          class="input input-bordered w-full"
          bind:value={businessWebsite}
          placeholder="URL where clients can read more or book in (optional)."
        />
      </label>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <label class="form-control gap-2">
        <span class="label-text">Project brief (1–3 sentences)</span>
        <textarea
          class="textarea textarea-bordered h-32 w-full"
          bind:value={projectBrief}
          placeholder="Describe what's being supplied/installed, the rooms or areas involved, and any standards or timing constraints."
        ></textarea>
      </label>

      <label class="form-control gap-2">
        <div class="space-y-2">
          <span class="label-text">Cost &amp; pricing context</span>
          <p class="text-xs leading-relaxed text-gray-500">
            Write costs in natural sentences (e.g. equipment, crew effort, call-out fees, markups, allowances, risks). We detect any
            $ or % figures automatically and total them before drafting the AI proposal.
          </p>
        </div>
        <textarea
          class="textarea textarea-bordered h-56 w-full"
          bind:value={costsText}
          placeholder="Example: ‘Panasonic ducted kit supplied/installed about $20k; two techs for 3 days and apprentice support (labour ≈$4,500); crane + traffic mgmt $1.1k if required; add 15% supervision/variations buffer.’"
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

    <div class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm">
      <div class="flex flex-wrap items-center gap-3 p-5 sm:p-6">
        <button class="btn btn-primary" type="submit" disabled={loading}>
          {#if loading}<span class="loading loading-dots"></span>{/if}
          <span>Generate proposal</span>
        </button>
        <button type="button" class="btn" on:click={useExample}>Use example</button>
        <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}>Copy</button>
        <button type="button" class="btn btn-outline" on:click={resetAll}>Reset</button>
        <p class="text-xs leading-relaxed text-gray-500">
          <span class="font-semibold text-gray-600">Reminder:</span>
          Plain-English cost notes are fine—we’ll detect any $ or % figures automatically. All pricing and timelines are AI-generated
          from your inputs, so double-check before presenting to a client.
        </p>
      </div>
    </div>
  </form>

  {#if output.trim().length}
    <div class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm mt-4">
      <div class="p-5 sm:p-6">
        <RichAnswer text={output} />
        <p class="mt-3 text-xs text-gray-500">AI-generated content—review the pricing and timeline before sharing externally.</p>
      </div>
    </div>
  {/if}
</section>
