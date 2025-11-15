<!-- /account/tools/material-cost (v1.3 — clean RichAnswer only, no extra headings, strips currency line) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);

  type Item = { name: string; unitCost: number; quantity: number; discountPct: number };

  let items: Item[] = [{ name: "", unitCost: 0, quantity: 1, discountPct: 0 }];

  let markupPct = 20;
  let currency: "AUD" | "USD" | "EUR" | "GBP" = "AUD";

  let generating = false;
  let summary = "";

  function addRow() {
    items = [...items, { name: "", unitCost: 0, quantity: 1, discountPct: 0 }];
  }
  function removeRow(i: number) {
    items = items.filter((_, idx) => idx !== i);
  }
  const toNumber = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const money = (n: number) => n.toLocaleString(undefined, { style: "currency", currency });

  $: breakdown = items.map((r) => {
    const unit = toNumber(r.unitCost);
    const qty = clamp(toNumber(r.quantity), 0, 1e9);
    const disc = clamp(toNumber(r.discountPct), 0, 100);
    const discountedUnit = unit * (1 - disc / 100);
    const before = unit * qty;
    const subtotal = discountedUnit * qty;
    const discountAmount = before - subtotal;
    return { ...r, unit, qty, disc, discountedUnit, before, discountAmount, subtotal };
  });

  $: totalMaterial = breakdown.reduce((s, r) => s + r.subtotal, 0);
  $: profit = totalMaterial * (toNumber(markupPct) / 100);
  $: finalTotal = totalMaterial + profit;

  async function generateSummary() {
    generating = true;
    summary = "";
    try {
      const res = await fetch("/api/material-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          markupPercent: toNumber(markupPct),
          currency,
          ...(brandContext ? { brandContext } : {}),
        })
      });
      if (!res.ok) {
        summary = "Server error: " + (await res.text());
        return;
      }
      const data = await res.json();
      summary = data.summary ?? "";
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      summary = "Request failed: " + message;
    } finally {
      generating = false;
    }
  }

  // --- Clean the generated text: remove "Quote Summary" headings & "Currency: XXX" lines
  function sanitizeRich(t: string): string {
    if (!t) return "";
    let out = t;

    // Remove markdown heading variants for "Quote Summary" (e.g., "# Quote Summary", "## Quote Summary")
    out = out.replace(/^\s*#{1,6}\s*quote\s+summary\s*$/gim, "");

    // Remove plain line "Quote Summary" (any case)
    out = out.replace(/^\s*quote\s+summary\s*$/gim, "");

    // Remove standalone "Currency: XXX" line
    out = out.replace(/^\s*currency:\s*[A-Z]{3}\s*$/gim, "");

    // Trim excessive blank lines created by removals (collapse 3+ to 2, then 2+ to 1 where useful)
    out = out.replace(/\n{3,}/g, "\n\n").trim();

    return out;
  }

  // Rich preview source (exactly what we generated, then sanitized)
  $: __richRaw = (summary || "").trim();
  $: __rich = sanitizeRich(__richRaw);
</script>

<svelte:head><title>Material & Cost Calculator</title></svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Costing</p>
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Material &amp; Cost Calculator</h1>
        <p class="max-w-3xl text-base text-gray-700">
          Stack every nut, bolt, and roll of cable in one place, then let the calculator spit out clean totals with markup baked in.
          It’s built for Aussie job sheets so you can eyeball the margin, tweak discounts, and hand clients a polished summary without spreadsheets.
        </p>
      </div>
      <a href="/account/tools" class="btn btn-ghost self-start text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <div class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6">
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="form-control gap-2" for="markupPct">
        <span class="label-text">Markup % (profit)</span>
        <input
          id="markupPct"
          type="number"
          class="input input-bordered w-full"
          min="0"
          step="0.1"
          bind:value={markupPct}
        />
      </label>
      <label class="form-control gap-2" for="currency">
        <span class="label-text">Currency</span>
        <select id="currency" class="select select-bordered w-full" bind:value={currency}>
          <option value="AUD">AUD</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </label>
    </div>
  </div>

  <div class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm">
    <div class="space-y-6 p-5 sm:p-6">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Material</th>
              <th class="text-right">Unit Cost</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Trade Disc. %</th>
              <th class="text-right">Before</th>
              <th class="text-right">Discount</th>
              <th class="text-right">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each items as r, i}
              <tr>
                <td class="min-w-[12rem]">
                  <input
                    class="input input-bordered w-full sm:input-sm"
                    placeholder="e.g. 2.5mm TPS Cable"
                    bind:value={r.name}
                  />
                </td>
                <td class="min-w-[8rem] text-right">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    class="input input-bordered text-right w-full sm:w-28 sm:input-sm"
                    bind:value={r.unitCost}
                  />
                </td>
                <td class="min-w-[6rem] text-right">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    class="input input-bordered text-right w-full sm:w-20 sm:input-sm"
                    bind:value={r.quantity}
                  />
                </td>
                <td class="min-w-[6rem] text-right">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="input input-bordered text-right w-full sm:w-24 sm:input-sm"
                    bind:value={r.discountPct}
                  />
                </td>
                {#if breakdown[i]}
                  <td class="text-right">{money(breakdown[i].before)}</td>
                  <td class="text-right">{money(breakdown[i].discountAmount)}</td>
                  <td class="text-right font-semibold">{money(breakdown[i].subtotal)}</td>
                {:else}
                  <td class="text-right">—</td>
                  <td class="text-right">—</td>
                  <td class="text-right">—</td>
                {/if}
                <td class="text-right">
                  {#if items.length > 1}
                    <button class="btn btn-ghost w-full sm:w-auto sm:btn-xs" on:click={() => removeRow(i)}>Remove</button>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button class="btn btn-outline w-full sm:w-auto sm:btn-sm" on:click={addRow}>+ Add Material</button>
        <div class="space-y-1 text-right">
          <div>
            Total materials: <span class="font-semibold">{money(totalMaterial)}</span>
          </div>
          <div>
            Profit ({markupPct}%): <span class="font-semibold">{money(profit)}</span>
          </div>
          <div class="text-lg">
            Final total: <span class="font-bold">{money(finalTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Costing Summary -->
  <div class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm">
    <div class="space-y-4 p-5 sm:p-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-lg font-semibold">Costing Summary</h2>
        <button class="btn btn-primary w-full sm:w-auto sm:btn-sm" on:click={generateSummary} disabled={generating}>
          {generating ? "Generating…" : "Generate"}
        </button>
      </div>

      {#if __rich.length}
        <!-- Rich preview only (no extra headings, no markdown fallback) -->
        <div class="space-y-3">
          <RichAnswer text={__rich} />
          <div class="mt-2">
            <button
              type="button"
              class="btn btn-outline w-full sm:w-auto sm:btn-sm"
              on:click={() => navigator.clipboard.writeText(__rich)}
            >
              Copy answer
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
