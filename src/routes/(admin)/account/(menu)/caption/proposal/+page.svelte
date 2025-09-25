<!-- /account/caption/proposal -->
<script lang="ts">
  let brief = "";
  let output = "";
  let loading = false;
  let model = "gpt-4o-mini";

  const SYSTEM_PROMPT = `You are an AI consultant for Aussie trades, tasked with producing a comprehensive project proposal template for tradies. This template needs to cover project objectives, setting clear and achievable goals, timelines that outline key project phases, detailed cost estimates including breakdowns for materials and labor, and sections dedicated to warranties or guarantees. Focus on creating a template that enables tradies to showcase their expertise, reliability, and value proposition, enhancing their chances of winning projects.`;

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
            { role: "user", content: brief || "Generate a reusable project proposal template." }
          ]
        })
      });
      if (!res.ok || !res.body) { output = `Failed to generate. HTTP ${res.status}`; loading = false; return; }
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
</script>

<svelte:head><title>Proposal Builder</title></svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex flex-col gap-1">
    <h1 class="text-2xl font-semibold">Proposal Builder</h1>
    <p class="text-sm opacity-70">Single-shot generator using your AI chat streamer.</p>
  </header>

  <form class="card bg-base-100 border border-base-300" on:submit={onSubmit}>
    <div class="card-body gap-4">
      <div class="form-control">
        <label class="label" for="model"><span class="label-text">Model</span></label>
        <select id="model" class="select select-bordered w-full max-w-xs" bind:value={model} aria-label="Model">
          <option value="gpt-4o-mini">gpt-4o-mini</option>
          <option value="gpt-4o">gpt-4o</option>
          <option value="gpt-4.1-mini">gpt-4.1-mini</option>
        </select>
      </div>

      <div class="form-control">
        <label class="label" for="brief"><span class="label-text">Brief / Project details (optional)</span></label>
        <textarea id="brief" class="textarea textarea-bordered h-32" bind:value={brief} placeholder="E.g., Kitchen renovation for 5x4m area; include demo & disposal; target start 15 Nov; include 2-year workmanship warranty."></textarea>
      </div>

      <div class="flex items-center gap-3">
        <button class="btn btn-primary" disabled={loading} type="submit"><span>Generate</span></button>
        {#if loading}<span class="loading loading-dots"></span>{/if}
        <a href="/account/caption" class="btn btn-ghost">Back to AI Tools</a>
      </div>
    </div>
  </form>

  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <h2 class="card-title text-base">Output</h2>
        <button class="btn btn-xs btn-outline" type="button" on:click={() => (output = "")}>Clear</button>
      </div>
      <pre class="whitespace-pre-wrap text-sm">{output}</pre>
    </div>
  </div>
</section>
