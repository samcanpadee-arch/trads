<!-- /account/caption/proposal -->
<script lang="ts">
  // Minimal inputs, AI fills the rest
  let model = "gpt-4o-mini";
  let clientName = "";
  let siteAddress = "";
  let projectType: "Kitchen" | "Bathroom" | "Air-con" | "Other" = "Kitchen";
  let sizeEstimate = "";      // e.g. “20 m2” or “$15,000”
  let briefOverride = "";     // optional notes
  let startDate = "";

  let loading = false;
  let output = "";

  // IMPORTANT: System prompt tells AI to include a visible disclaimer and to clearly mark any estimates as needing review.
  const SYSTEM_PROMPT = `You are an AI consultant for Aussie trades. From the inputs given, generate a polished, client-ready proposal in Markdown.

Include sections:
- Short Cover Letter
- Project Overview
- Scope of Work (use standard items for the project type; adapt to notes)
- Materials & Inclusions (typical for the project type)
- Exclusions & Disclaimers (standard)
- Timeline & Milestones
- Pricing & Cost Breakdown (subtotal, GST, total) — if amounts are inferred, clearly label them as *estimated* and **flag that the client must review**.
- Warranty & Guarantees
- Payment Terms
- Acceptance & Next Steps

Rules:
- Write in Australian English.
- Fill gaps with professional assumptions suited to Australian tradies.
- If any price/quantity/timing is inferred, clearly mark it as "estimated — review/confirm before sending".
- Include a bold top-of-document disclaimer: "This proposal contains AI-generated estimates. Review and confirm all details before sending to the client."
- Use tables where helpful for costs. If GST applies, show Subtotal / GST / Total (AUD).
- Output only the final proposal in Markdown.`;

  function buildUserPrompt() {
    return [
      `Client: ${clientName || "_TBA_"}`,
      `Site address: ${siteAddress || "_TBA_"}`,
      `Project type: ${projectType}`,
      `Estimate (size or budget): ${sizeEstimate || "_TBA_"}`,
      `Notes: ${briefOverride || ""}`,
      `Desired start date: ${startDate || "_TBA_"}`
    ].join("\n");
  }

  async function onSubmit(e: Event) {
    e.preventDefault();
    output = "";
    loading = true;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt() }
          ]
        })
      });
      if (!res.ok || !res.body) {
        output = `Failed to generate. HTTP ${res.status}`;
        loading = false;
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        output += decoder.decode(chunk.value);
      }
    } catch (err) {
      output = "Error generating proposal. " + (err as Error).message;
    } finally {
      loading = false;
    }
  }

  async function copyOut() {
    try { await navigator.clipboard.writeText(output || ""); } catch {}
  }

  function downloadOut() {
    const blob = new Blob([output || ""], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proposal.md";
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>Proposal Builder</title>
</svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold">Proposal Builder</h1>
    <a href="/account/caption" class="btn btn-ghost">← Back</a>
  </header>

  <!-- Clear disclaimer for users -->
  <div class="alert alert-warning">
    <span><strong>Heads up:</strong> This tool may infer pricing and timelines. All inferred items are marked as <em>estimated</em> — please review and confirm before sending to your client.</span>
  </div>

  <form class="card bg-base-100 border border-base-300 p-4 space-y-4" on:submit={onSubmit}>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label class="form-control">
        <span class="label-text">Client Name</span>
        <input class="input input-bordered" bind:value={clientName} placeholder="e.g. Jordan Moore" />
      </label>

      <label class="form-control">
        <span class="label-text">Site Address</span>
        <input class="input input-bordered" bind:value={siteAddress} placeholder="e.g. 12 Rivergum Rd, VIC" />
      </label>

      <label class="form-control">
        <span class="label-text">Project Type</span>
        <select class="select select-bordered" bind:value={projectType} aria-label="Project Type">
          <option>Kitchen</option>
          <option>Bathroom</option>
          <option>Air-con</option>
          <option>Other</option>
        </select>
      </label>

      <label class="form-control">
        <span class="label-text">Estimate (size or budget)</span>
        <input class="input input-bordered" bind:value={sizeEstimate} placeholder="e.g. 20 m2 or $15,000" />
      </label>

      <label class="form-control md:col-span-2">
        <span class="label-text">Extra Notes (optional)</span>
        <textarea class="textarea textarea-bordered h-20" bind:value={briefOverride} placeholder="Any special requirements or constraints"></textarea>
      </label>

      <label class="form-control">
        <span class="label-text">Desired Start Date</span>
        <input type="date" class="input input-bordered" bind:value={startDate} />
      </label>
    </div>

    <div class="flex items-center gap-4">
      <button class="btn btn-primary" type="submit" disabled={loading}>
        {#if loading}<span class="loading loading-dots"></span>{/if}
        <span>Generate</span>
      </button>
      <button class="btn btn-outline" type="button" on:click={() => { clientName=""; siteAddress=""; sizeEstimate=""; briefOverride=""; startDate=""; }}>
        Clear
      </button>
    </div>
  </form>

  {#if output}
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <h2 class="card-title text-base">Output</h2>
          <div class="flex gap-2">
            <button class="btn btn-sm" type="button" on:click={copyOut} disabled={!output}>Copy</button>
            <button class="btn btn-sm btn-outline" type="button" on:click={downloadOut} disabled={!output}>Download .md</button>
          </div>
        </div>
        <pre class="whitespace-pre-wrap text-sm">{output}</pre>
      </div>
    </div>
  {/if}
</section>
