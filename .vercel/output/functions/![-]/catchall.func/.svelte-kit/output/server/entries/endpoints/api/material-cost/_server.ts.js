const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const POST = async ({ request }) => {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  const currency = (body.currency || "AUD").toUpperCase();
  const markupPercent = clamp(num(body.markupPercent), 0, 1e3);
  const raw = Array.isArray(body.items) ? body.items : [];
  const rows = raw.map((r) => {
    const unit = clamp(num(r.unitCost), 0, 1e12);
    const qty = clamp(num(r.quantity), 0, 1e9);
    const disc = clamp(num(r.discountPct), 0, 100);
    const name = (r.name || "").toString().slice(0, 200);
    const discountedUnit = unit * (1 - disc / 100);
    const before = unit * qty;
    const subtotal = discountedUnit * qty;
    const discountAmount = before - subtotal;
    return { name, unit, qty, disc, discountedUnit, before, discountAmount, subtotal };
  });
  const totalMaterial = rows.reduce((s, r) => s + r.subtotal, 0);
  const profit = totalMaterial * markupPercent / 100;
  const finalTotal = totalMaterial + profit;
  const payload = {
    breakdown: rows,
    totals: { currency, markupPercent, totalMaterial, profit, finalTotal }
  };
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ ...payload, summary: fallbackSummary(rows, payload.totals) });
  }
  const systemPrompt = "You are a sophisticated calculation tool tailored for Australian tradies. Given itemised materials (with trade discounts) and a markup %, present a clear, client-ready summary. Include each material's cost before/after discount, the total material cost, profit from markup, and final total. Keep it concise and professional. Use the provided numbers exactly; do not alter calculations.";
  const userContent = {
    currency,
    markupPercent,
    items: rows.map((r) => ({
      name: r.name,
      unitCost: r.unit,
      quantity: r.qty,
      discountPct: r.disc,
      before: r.before,
      discountAmount: r.discountAmount,
      subtotal: r.subtotal
    })),
    totals: { totalMaterial, profit, finalTotal }
  };
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: "Prepare a neatly formatted summary for a quote based on this JSON (do not change the numbers):\n" + JSON.stringify(userContent, null, 2)
          }
        ],
        temperature: 0.2
      })
    });
    if (!r.ok) {
      const err = await r.text();
      return json({ ...payload, summary: fallbackSummary(rows, payload.totals), error: `OpenAI error: ${err}` });
    }
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || "";
    return json({ ...payload, summary: text });
  } catch (e) {
    return json({ ...payload, summary: fallbackSummary(rows, payload.totals), error: e?.message || "LLM failed" });
  }
};
const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const money = (n, ccy) => n.toLocaleString(void 0, { style: "currency", currency: ccy });
function fallbackSummary(rows, t) {
  const lines = [
    `Materials (after trade discounts): ${money(t.totalMaterial, t.currency)}`,
    `Profit (${t.markupPercent}%): ${money(t.profit, t.currency)}`,
    `Final total: ${money(t.finalTotal, t.currency)}`,
    ``,
    `Breakdown:`,
    ...rows.map(
      (r) => `• ${r.name || "Material"} — Before: ${money(r.before, t.currency)}, Discount: ${money(r.discountAmount, t.currency)}, Subtotal: ${money(r.subtotal, t.currency)}`
    )
  ];
  return lines.join("\n");
}
function json(obj, init) {
  return new Response(JSON.stringify(obj), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...{}
  });
}
export {
  POST
};
