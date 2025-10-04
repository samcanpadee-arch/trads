<!-- /account/caption/material-cost -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";

  type Item = { name: string; unitCost: number; quantity: number; discountPct: number };

  // Table state
  let items: Item[] = [{ name: "", unitCost: 0, quantity: 1, discountPct: 0 }];

  // Currency & markup
  type Currency = "AUD" | "USD" | "EUR" | "GBP";
  let currency: Currency = "AUD";
  let markupPct = 20;

  // Derived values
  const num = (v: any) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const money = (n: number) => n.toLocaleString(undefined, { style: "currency", currency });

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

  $: totalMaterial = breakdown.reduce((s, r) => s + r.subtotal, 0);
  $: profit = totalMaterial * (num(markupPct) / 100);
  $: finalTotal = totalMaterial + profit;

  // UI helpers
  function addRow() {
    items = [...items, { name: "", unitCost: 0, quantity: 1, discountPct: 0 }];
  }
  function removeRow(i: number) {
    items = items.filter((_, idx) => idx !== i);
  }

  // AI summary state
  let generating = false;
  let summary = "";

  async function generateSummary() {
    generating = true;
    summary = "";
    try {
      const res = await fetch("/api/material-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          markupPercent: num(markupPct),
          currency,
          // Non-breaking hints for the server endpoint (ignored if unsupported)
          style: "client_narrative",
          return: "markdown"
        })
      });
      if (!res.ok) {
        summary = "Server error: " + (await res.text());
        return;
        }
      const data = await res.json();
      summary = data.summary ?? "";
    } catch (e: any) {
      summary = "Request failed: " + (e?.message || e);
    } finally {
      generating = false;
    }
  }

  function copySummary() {
    try { navigator.clipboard.writeText(summary || ""); } catch {}
  }
  function downloadSummary() {
    const blob = new Blob([summary || ""], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "costing-summary.md"; a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head><title>Material & Cost Calculator</title></svelte:head>

<div class="max-w-5xl mx-auto p-4 space-y-6">
  <!-- Title + description -->
  <div class="flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-bold">Material & Cost Calculator</h1>
      <p class="text-sm opacity-70 mt-1">
        Build a clear cost breakdown from your materials, discounts and mark-up. Get an AI-written <em>Costing Summary</em> you can drop straight into your Job Estimation.
      </p>
    </div>
    <a href="/account/caption" class="btn btn-ghost">← Back</a>
  </div>

  <!-- Controls row -->
  <div class="flex items-center justify-between">
    <div class="text-sm opacity-0">.</div>
    <div class="flex items-center gap-3">
      <div class="form-control">
        <label class="label" for="markup"><span class="label-text">Markup % (profit)</span></label>
        <input id="markup" type="number" class="input input-bordered input-sm w-28" min="0" step="0.1" bind:value={markupPct} />
      </div>
      <div class="form-control">
        <label class="label" for="currency"><span class="label-text">Currency</span></label>
        <select id="currency" class="select select-bordered select-sm w-28" bind:value={currency}>
          <option value="AUD">AUD</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Materials table -->
  <div class="card bg-base-100 border">
    <div class="card-body">
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
                    class="input input-bordered input-sm w-full"
                    placeholder="e.g. 2.5mm TPS Cable"
                    bind:value={r.name}
                  />
                </td>
                <td class="min-w-[8rem] text-right">
                  <input
                    type="number" min="0" step="0.01"
                    class="input input-bordered input-sm text-right w-28"
                    bind:value={r.unitCost}
                  />
                </td>
                <td class="min-w-[6rem] text-right">
                  <input
                    type="number" min="0" step="0.01"
                    class="input input-bordered input-sm text-right w-20"
                    bind:value={r.quantity}
                  />
                </td>
                <td class="min-w-[6rem] text-right">
                  <input
                    type="number" min="0" max="100" step="0.1"
                    class="input input-bordered input-sm text-right w-24"
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
                    <button class="btn btn-ghost btn-xs" on:click={() => removeRow(i)}>Remove</button>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center pt-4">
        <button class="btn btn-outline btn-sm" on:click={addRow}>+ Add Material</button>
        <div class="text-right space-y-1">
          <div>Total materials: <span class="font-semibold">{money(totalMaterial)}</span></div>
          <div>Profit ({markupPct}%): <span class="font-semibold">{money(profit)}</span></div>
          <div class="text-lg">Final total: <span class="font-bold">{money(finalTotal)}</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Costing Summary (rich output) -->
  <div class="card bg-base-100 border">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <h2 class="card-title">Costing Summary</h2>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm" on:click={copySummary} disabled={!summary}>Copy</button>
          <button class="btn btn-ghost btn-sm" on:click={downloadSummary} disabled={!summary}>Download .md</button>
          <button class="btn btn-primary btn-sm" on:click={generateSummary} disabled={generating}>
            {generating ? "Generating…" : "Generate"}
          </button>
        </div>
      </div>

      {#if summary}
        <div class="mt-2">
          <RichAnswer content={summary} />
        </div>
      {:else}
        <p class="text-sm opacity-70">
          Generate a concise, client-friendly narrative of your materials, discounts and mark-up, ready to paste into your Job Estimation.
        </p>
      {/if}
    </div>
  </div>
</div>
