<header class="flex justify-end mb-4"><a href="/account/caption" class="btn btn-ghost">← Back</a></header>
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  type Item = { name: string; unitCost: number; quantity: number; discountPct: number };

  let items: Item[] = [{ name: '', unitCost: 0, quantity: 1, discountPct: 0 }];
  let markupPct = 20;
  let currency: 'AUD' = 'AUD';
  let generating = false;
  let summary = '';

  function addRow() {
    items = [...items, { name: '', unitCost: 0, quantity: 1, discountPct: 0 }];
  }
  function removeRow(i: number) {
    items = items.filter((_, idx) => idx !== i);
  }
  const num = (v: any) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const money = (n: number) => n.toLocaleString(undefined, { style: 'currency', currency });

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

  async function generateSummary() {
    generating = true;
    summary = '';
    try {
      const res = await fetch('/api/material-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          markupPercent: num(markupPct),
          currency
        })
      });
      if (!res.ok) {
        summary = 'Server error: ' + (await res.text());
        return;
      }
      const data = await res.json();
      summary = data.summary ?? '';
    } catch (e: any) {
      summary = 'Request failed: ' + (e?.message || e);
    } finally {
      generating = false;
    }
  }
</script>

<svelte:head><title>Material & Cost Calculator</title></svelte:head>

<div class="max-w-5xl mx-auto p-4 space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Material & Cost Calculator</h1>
    <div class="flex items-center gap-3">
      <div class="form-control">
        <label class="label"><span class="label-text">Markup % (profit)</span></label>
        <input type="number" class="input input-bordered input-sm w-28" min="0" step="0.1" bind:value={markupPct} />
      </div>
      <div class="form-control">
        <label class="label"><span class="label-text">Currency</span></label>
        <select class="select select-bordered select-sm w-28" bind:value={currency}>
          <option value="AUD">AUD</option>
        </select>
      </div>
    </div>
  </div>

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
                  <input class="input input-bordered input-sm w-full" placeholder="e.g. 2.5mm TPS Cable"
                         bind:value={r.name} />
                </td>
                <td class="min-w-[8rem] text-right">
                  <input type="number" min="0" step="0.01"
                         class="input input-bordered input-sm text-right w-28"
                         bind:value={r.unitCost} />
                </td>
                <td class="min-w-[6rem] text-right">
                  <input type="number" min="0" step="0.01"
                         class="input input-bordered input-sm text-right w-20"
                         bind:value={r.quantity} />
                </td>
                <td class="min-w-[6rem] text-right">
                  <input type="number" min="0" max="100" step="0.1"
                         class="input input-bordered input-sm text-right w-24"
                         bind:value={r.discountPct} />
                </td>
                {#if breakdown[i]}
                  <td class="text-right">{money(breakdown[i].before)}</td>
                  <td class="text-right">{money(breakdown[i].discountAmount)}</td>
                  <td class="text-right font-semibold">{money(breakdown[i].subtotal)}</td>
                {:else}
                  <td class="text-right">—</td><td class="text-right">—</td><td class="text-right">—</td>
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

  <div class="card bg-base-100 border">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <h2 class="card-title">Generate AI Summary</h2>
        <button class="btn btn-primary btn-sm" on:click={generateSummary} disabled={generating}>
          {generating ? 'Generating…' : 'Generate'}
        </button>
      </div>
      <p class="text-sm opacity-70">Smart, trade-ready assistants to draft proposals, build estimates, and create client-ready docs.</p>
      {#if summary}
        <div class="prose max-w-none mt-3 whitespace-pre-wrap">{summary}</div>
      {/if}
    </div>
  </div>
</div>

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
