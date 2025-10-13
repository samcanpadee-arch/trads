<!-- /account/tools/proposal — Long-form Sales Proposal Generator (no client name input) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";

  let __mdProposal: HTMLDivElement | null = null;
  let __previewProposal = "";
  $: __previewProposal = __mdProposal ? __mdProposal.innerText : "";

  let __md: HTMLDivElement | null = null;
  let __preview = "";
  $: __preview = __md ? __md.innerText : "";

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

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          output += decoder.decode(value);
        }
      } else {
        output = "Could not generate a proposal right now. Please try again.";
      }
    } catch {
      output = "Network error while generating. Please try again.";
    } finally {
      loading = false;
    }
  }

  function copyOut() {
    try { navigator.clipboard.writeText(output || ""); } catch {}
  }

  function downloadOut() {
    const blob = new Blob([output || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "proposal.txt"; a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head><title>Sales Proposal Generator</title></svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-semibold">Sales Proposal Generator</h1>
      <p class="text-sm opacity-70">Generate a detailed, long-form proposal document that sells your value. Pair this with the Job Estimation Wizard for pricing.</p>
    </div>
    <a href="/account/tools" class="btn btn-ghost">← Back</a>
  </header>

  <form class="card bg-base-100 border border-base-300 p-6 space-y-6" on:submit={generate}>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: brief -->
      <div class="lg:col-span-2 space-y-4">
        <label class="form-control" for="trade">
          <span class="label-text">Trade</span>
          <select id="trade" class="select select-bordered" bind:value={trade} aria-label="Trade">
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

        <label class="form-control" for="brief">
          <span class="label-text">Project brief (1–2 lines)</span>
          <textarea id="brief" class="textarea textarea-bordered h-28" bind:value={projectBrief} placeholder="e.g. Kitchen renovation with custom cabinetry and engineered stone benchtops."></textarea>
        </label>
      </div>

      <!-- Right: business meta -->
      <div class="space-y-4">
        <label class="form-control" for="biz">
          <span class="label-text">Business name (optional)</span>
          <input id="biz" class="input input-bordered" bind:value={businessName} placeholder="e.g. BrightSpark Electrical" />
        </label>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button type="submit" class="btn btn-primary" disabled={loading}>
        {#if loading}<span class="loading loading-dots"></span>{/if}
        <span>Generate Proposal</span>
      </button>
      <button type="button" class="btn" on:click={useExample}>Use example</button>
      <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}>Copy</button>
      <button type="button" class="btn btn-outline" on:click={downloadOut} disabled={!output}>Download .txt</button>
    </div>

    <div class="alert alert-info">
      <span>Draft only — review technical details before sending to a client.</span>
    </div>
  </form>

  {#if output && output.trim().length}
    <!-- Rich preview first (desktop). Fallback to plain text on small screens -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <h2 class="card-title text-base">Generated Proposal</h2>

        <!-- Rich formatting on md+ screens -->
        <div class="hidden md:block">
          <RichAnswer text={output} />
          <div class="mt-3 flex gap-2">
            <button type="button" class="btn btn-outline btn-sm" on:click={copyOut}>Copy</button>
            <button type="button" class="btn btn-outline btn-sm" on:click={downloadOut}>Download .txt</button>
          </div>
        </div>

        <!-- Plain text fallback on small screens -->
        <pre class="md:hidden whitespace-pre-wrap text-sm">{output}</pre>
      </div>
    </div>
  {/if}
</section>
