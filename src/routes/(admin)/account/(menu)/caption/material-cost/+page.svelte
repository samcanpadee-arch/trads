<!-- /account/caption/material-cost — Material & Cost Calculator (clean, mobile-safe) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";

  type Item = { name: string; unitCost: number; quantity: number; discountPct: number };

  // Table state
  let items: Item[] = [{ name: "", unitCost: 0, quantity: 1, discountPct: 0 }];

  // Totals + currency
  let markupPct = 20;
  let currency: "AUD" | "USD" | "EUR" | "GBP" = "AUD";

  // Output state
  let generating = false;
  let summary = "";

  // ---------- helpers ----------
  function addRow() {
    items = [...items, { name: "", unitCost: 0, quantity: 1, discountPct: 0 }];
  }
  function removeRow(i: number) {
    items = items.filter((_, idx) => idx !== i);
  }
  const num = (v: any) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const money = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency });

  // ---------- derived row values ----------
  $: breakdown = items.map((r) => {
    const unit = num(r.unitCost);
    const qty = clamp(num(r.quantity), 0, 1e9);
    const disc = clamp(num(r.discountPct), 0, 100);
    const discountedUnit = unit * (1 - disc / 100);
    const before = unit * qty;
    const subtotal = discountedUnit * qty;
    const discountAmount = before - subtotal;
    return { ...r, unit, qty, disc, discountedUnit, before, discountAmount, subtotal };
  });

  // ---------- derived totals ----------
  $: totalMaterial = breakdown.reduce((s, r) => s + r.subtotal, 0);
  $: profit = totalMaterial * (num(markupPct) / 100);
  $: finalTotal = totalMaterial + profit;

  // ---------- API calls ----------
  async function generateSummary() {
    generating = true;
    summary = "";
    try {
      const res = await fetch("/api/material-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Keep payload simple & identical to your working server shape
        body: JSON.stringify({
          items,
          markupPercent: num(markupPct),
          currency
        })
      });

      if (!res.ok) {
        // If server returned 5xx/4xx (e.g. ERR_EMPTY_RESPONSE upstream), show text
        const txt = await res.text().catch(() => "");
        summary = `Server error: ${txt || res.status}`;
        return;
        }
      const data = await res.json().catch(() => ({}));
      summary = String(data?.summary || "").trim();
      if (!summary) summary = "No summary returned.";
    } catch (e: any) {
      // Network/socket edge cases (e.g. ERR_EMPTY_RESPONSE at browser)
      summary = "Request failed: " + (e?.message || e);
    } finally {
      generating = false;
    }
  }

  function copySummary() {
    try {
      if (summary) navigator.clipboard.writeText(summary);
    } catch {}
  }
</script>

<svelte:head><title>Material & Cost Calculator</title></svelte:head>

<div class="max-w-5xl mx-auto p-4 space-y-6">
  <!-- Header -->
  <div class="flex items-start justify-between gap-3">
    <div>
      <h1 class="text-2xl font-bold">Material &amp; Cost Calculator</h1>
      <p class="text-sm opacity-70">
        Enter materials, trade discounts and markup to calculate totals, then generate a clean client summary you can paste into your Job Estimation.
      </p>
    </div>
    <a href="/account/caption" class="btn btn-ghost shrink-0">← Back</a>
  </div>

  <!-- Controls: markup + currency -->
  <div class="card bg-base-100 border">
    <div class="card-body">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="form-control">
          <label class="label" for="markup"><span class="label-text">Markup % (profit)</span></label>
          <input id="markup" type="number" min="0" step="0.1"
                 class="input input-bordered w-full"
                 bind:value={markupPct} />
        </div>
        <div class="form-control">
          <label class="label" for="currency"><span class="label-text">Currency</span></label>
          <select id="currency" class="select select-bordered w-full" bind:value={currency}>
            <option value="AUD">AUD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div class="flex items-end justify-start">
          <button class="btn btn-outline btn-sm" on:click={addRow}>+ Add Material</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Items table -->
  <div class="card bg-base-100 border">
    <div class="card-body">
      <div class="overflow-x-auto -mx-2 sm:mx-0">
        <table class="table">
          <thead>
            <tr>
              <th class="min-w-[12rem]">Material</th>
              <th class="text-right min-w-[8rem]">Unit Cost</th>
              <th class="text-right min-w-[6rem]">Qty</th>
              <th class="text-right min-w-[7rem]">Trade Disc. %</th>
              <th class="text-right min-w-[7rem]">Before</th>
              <th class="text-right min-w-[7rem]">Discount</th>
              <th class="text-right min-w-[7rem]">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each items as r, i}
              <tr>
                <td>
                  <input
                    class="input input-bordered input-sm w-full"
                    placeholder="e.g. 2.5mm TPS Cable"
                    bind:value={r.name} />
                </td>

                <td class="text-right">
                  <input
                    type="number" min="0" step="0.01"
                    class="input input-bordered input-sm text-right w-full sm:w-28"
                    bind:value={r.unitCost} />
                </td>

                <td class="text-right">
                  <input
                    type="number" min="0" step="0.01"
                    class="input input-bordered input-sm text-right w-full sm:w-20"
                    bind:value={r.quantity} />
                </td>

                <td class="text-right">
                  <input
                    type="number" min="0" max="100" step="0.1"
                    class="input input-bordered input-sm text-right w-full sm:w-24"
                    bind:value={r.discountPct} />
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
                    <button class="btn btn-ghost btn-xs" on:click={() => removeRow(i)}>Remove</button>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="text-left">
          <button class="btn btn-outline btn-sm" on:click={addRow}>+ Add Material</button>
        </div>
        <div class="text-right space-y-1">
          <div>Total materials: <span class="font-semibold">{money(totalMaterial)}</span></div>
          <div>Profit ({markupPct}%): <span class="font-semibold">{money(profit)}</span></div>
          <div class="text-lg">Final total: <span class="font-bold">{money(finalTotal)}</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Costing Summary (RichAnswer) -->
  <div class="card bg-base-100 border">
    <div class="card-body">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="card-title">Costing Summary</h2>
        <div class="flex gap-2">
          {#if summary}
            <button class="btn btn-outline btn-sm" on:click={copySummary}>Copy</button>
          {/if}
          <button class="btn btn-primary btn-sm" on:click={generateSummary} disabled={generating}>
            {generating ? "Generating…" : "Generate"}
          </button>
        </div>
      </div>

      {#if summary}
        <div class="mt-2">
          <RichAnswer content={summary} />
        </div>
      {/if}
    </div>
  </div>
</div>
