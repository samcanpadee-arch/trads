import { W as head, $ as ensure_array_like } from "../../../../../../../chunks/index.js";
import { a as attr } from "../../../../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../../../../chunks/escaping.js";
function _page($$renderer) {
  let breakdown, totalMaterial, profit, finalTotal;
  let items = [{ name: "", unitCost: 0, quantity: 1, discountPct: 0 }];
  let markupPct = 20;
  let currency = "AUD";
  let generating = false;
  const num = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const money = (n) => n.toLocaleString(void 0, { style: "currency", currency });
  breakdown = items.map((r) => {
    const unit = num(r.unitCost);
    const qty = clamp(num(r.quantity), 0, 1e9);
    const disc = clamp(num(r.discountPct), 0, 100);
    const discountedUnit = unit * (1 - disc / 100);
    const before = unit * qty;
    const subtotal = discountedUnit * qty;
    const discountAmount = before - subtotal;
    return {
      ...r,
      unit,
      qty,
      disc,
      discountedUnit,
      before,
      discountAmount,
      subtotal
    };
  });
  totalMaterial = breakdown.reduce((s, r) => s + r.subtotal, 0);
  profit = totalMaterial * (num(markupPct) / 100);
  finalTotal = totalMaterial + profit;
  head($$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Material &amp; Cost Calculator</title>`);
    });
  });
  $$renderer.push(`<div class="max-w-5xl mx-auto p-4 space-y-6"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold">Material &amp; Cost Calculator</h1> <div class="flex items-center gap-3"><div class="form-control"><label class="label" for="markupPct"><span class="label-text">Markup % (profit)</span></label> <input id="markupPct" type="number" class="input input-bordered input-sm w-28" min="0" step="0.1"${attr("value", markupPct)}/></div> <div class="form-control"><label class="label" for="currencySel"><span class="label-text">Currency</span></label> `);
  $$renderer.select(
    {
      id: "currencySel",
      class: "select select-bordered select-sm w-28",
      value: currency
    },
    ($$renderer2) => {
      $$renderer2.option({ value: "AUD" }, ($$renderer3) => {
        $$renderer3.push(`AUD`);
      });
    }
  );
  $$renderer.push(`</div></div></div> <div class="card bg-base-100 border"><div class="card-body"><div class="overflow-x-auto"><table class="table"><thead><tr><th>Material</th><th class="text-right">Unit Cost</th><th class="text-right">Qty</th><th class="text-right">Trade Disc. %</th><th class="text-right">Before</th><th class="text-right">Discount</th><th class="text-right">Subtotal</th><th></th></tr></thead><tbody><!--[-->`);
  const each_array = ensure_array_like(items);
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let r = each_array[i];
    $$renderer.push(`<tr><td class="min-w-[12rem]"><input class="input input-bordered input-sm w-full" placeholder="e.g. 2.5mm TPS Cable"${attr("value", r.name)}/></td><td class="min-w-[8rem] text-right"><input id="markupPct" type="number" min="0" step="0.01" class="input input-bordered input-sm text-right w-28"${attr("value", r.unitCost)}/></td><td class="min-w-[6rem] text-right"><input id="markupPct" type="number" min="0" step="0.01" class="input input-bordered input-sm text-right w-20"${attr("value", r.quantity)}/></td><td class="min-w-[6rem] text-right"><input id="markupPct" type="number" min="0" max="100" step="0.1" class="input input-bordered input-sm text-right w-24"${attr("value", r.discountPct)}/></td>`);
    if (breakdown[i]) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<td class="text-right">${escape_html(money(breakdown[i].before))}</td> <td class="text-right">${escape_html(money(breakdown[i].discountAmount))}</td> <td class="text-right font-semibold">${escape_html(money(breakdown[i].subtotal))}</td>`);
    } else {
      $$renderer.push("<!--[!-->");
      $$renderer.push(`<td class="text-right">—</td><td class="text-right">—</td><td class="text-right">—</td>`);
    }
    $$renderer.push(`<!--]--><td class="text-right">`);
    if (items.length > 1) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<button class="btn btn-ghost btn-xs">Remove</button>`);
    } else {
      $$renderer.push("<!--[!-->");
    }
    $$renderer.push(`<!--]--></td></tr>`);
  }
  $$renderer.push(`<!--]--></tbody></table></div> <div class="flex justify-between items-center pt-4"><button class="btn btn-outline btn-sm">+ Add Material</button> <div class="text-right space-y-1"><div>Total materials: <span class="font-semibold">${escape_html(money(totalMaterial))}</span></div> <div>Profit (${escape_html(markupPct)}%): <span class="font-semibold">${escape_html(money(profit))}</span></div> <div class="text-lg">Final total: <span class="font-bold">${escape_html(money(finalTotal))}</span></div></div></div></div></div> <div class="card bg-base-100 border"><div class="card-body"><div class="flex items-center justify-between"><h2 class="card-title">Generate AI Summary</h2> <button class="btn btn-primary btn-sm"${attr("disabled", generating, true)}>${escape_html("Generate")}</button></div> <p class="text-sm opacity-70">We calculate totals deterministically. If an OpenAI key is configured, we’ll create a clean, client-ready
        summary including itemised costs, discounts, profit and final price.</p> `);
  {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--></div></div></div>`);
}
export {
  _page as default
};
