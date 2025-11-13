<!-- /account/tools/proposal — Long-form Sales Proposal Generator (no client name input) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { getChatErrorMessage } from "$lib/utils/chat-errors";

  let trade = "Electrical";
  let projectBrief = "";
  let businessName = "";

  let output = "";
  let loading = false;

  function useExample() {
    trade = "Electrical";
    businessName = "BrightSpark Electrical";
    projectBrief = "Switchboard upgrade to modern RCBOs with clear labelling and compliance documentation.";
  }

  async function generate(e: Event) {
    e.preventDefault();
    output = "";
    loading = true;

    const SYSTEM = `You are a Proposal Generator AI for Australian tradies.
Produce a long-form, persuasive proposal document (NOT an email) in Australian English.
Structure (headings optional, paragraphs required):
1) Executive Summary — 2–3 paragraphs explaining the client outcome/benefit.
2) Detailed Scope — 3–5 paragraphs describing how the work will be delivered, why steps matter, and any relevant standards.
3) Why Choose Us — 2–3 paragraphs (experience, reliability, safety/compliance, warranties, tidy workmanship, communication).
4) Timeline & Milestones — 1–2 paragraphs narrating phases; avoid specific dates unless provided.
5) Pricing Summary — single paragraph noting that itemised pricing is provided separately (e.g., estimate/quote); do not invent numbers.
6) Closing & Next Steps — invite approval or a site visit.
7) Signature — include business name/contact if provided.
Rules: No invented specifics. No bullet lists. Write cohesive paragraphs in a warm, professional Aussie tone.`;

    const userPayload = {
      trade,
      projectBrief,
      businessName: businessName || null
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: JSON.stringify(userPayload) }
          ]
        })
      });

      if (!res.ok) {
        output = await getChatErrorMessage(res);
        return;
      }

      if (!res.body) {
        output = "The assistant returned an empty response. Please try again.";
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let finished = false;
      while (!finished) {
        const { done, value } = await reader.read();
        finished = Boolean(done);
        if (value) {
          output += decoder.decode(value);
        }
      }
    } catch {
      output = "Network error while generating. Please try again.";
    } finally {
      loading = false;
    }
  }

  function copyOut() {
    try {
      navigator.clipboard.writeText(output || "");
    } catch (error) {
      console.error("copy failed", error);
    }
  }
</script>

<svelte:head><title>Sales Proposal Generator</title></svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Docs</p>
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Sales Proposal Generator</h1>
        <p class="max-w-3xl text-base text-gray-700">
          Turn a scrappy project brief into a polished, big-wow proposal that proves why your crew is the safe pair of hands.
          Pair it with the Job Estimation Wizard to lock in the numbers and send both together.
        </p>
      </div>
      <a href="/account/tools" class="btn btn-ghost self-start text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <form class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6 space-y-6" on:submit={generate}>
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left: brief -->
      <div class="flex flex-col gap-6 lg:col-span-2">
        <label class="form-control gap-3" for="trade">
          <span class="label-text">Trade</span>
          <select id="trade" class="select select-bordered w-full" bind:value={trade} aria-label="Trade">
            <option>Electrical</option>
            <option>Plumbing</option>
            <option>HVAC</option>
            <option>General Construction</option>
            <option>Carpentry</option>
            <option>Roofing</option>
            <option>Tiling</option>
            <option>Painting</option>
            <option>Landscaping</option>
            <option>Other</option>
          </select>
        </label>

        <label class="form-control gap-3" for="brief">
          <span class="label-text">Project brief (1–2 lines)</span>
          <textarea id="brief" class="textarea textarea-bordered h-28 w-full" bind:value={projectBrief} placeholder="e.g. Kitchen renovation with custom cabinetry and engineered stone benchtops."></textarea>
        </label>
      </div>

      <!-- Right: business meta -->
      <div class="space-y-6">
        <label class="form-control gap-3" for="biz">
          <span class="label-text">Business name (optional)</span>
          <input id="biz" class="input input-bordered w-full" bind:value={businessName} placeholder="e.g. BrightSpark Electrical" />
        </label>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button type="submit" class="btn btn-primary" disabled={loading}>
        {#if loading}<span class="loading loading-dots"></span>{/if}
        <span>Generate Proposal</span>
      </button>
      <button type="button" class="btn" on:click={useExample}>Use example</button>
      <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}>Copy</button>
    </div>
  </form>

  {#if output && output.trim().length}
    <div class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm">
      <div class="space-y-4 p-5 sm:p-6">
        <h2 class="text-lg font-semibold">Generated Proposal</h2>

        <!-- Rich formatting on md+ screens -->
        <div class="hidden md:block">
          <RichAnswer text={output} />
          <div class="mt-3 flex gap-2">
            <button type="button" class="btn btn-outline btn-sm" on:click={copyOut}>Copy</button>
          </div>
        </div>

        <!-- Plain text fallback on small screens -->
        <pre class="md:hidden whitespace-pre-wrap text-sm">{output}</pre>
      </div>
    </div>
  {/if}
</section>
