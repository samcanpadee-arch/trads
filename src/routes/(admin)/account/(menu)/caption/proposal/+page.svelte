<script lang="ts">
  import { onMount } from "svelte";
  import { createSignal } from "@sveltejs/kit/signals";
  import { streamChat } from "$lib/client";

  let trade = "General Construction";
  let projectBrief = "";
  let clientName = "";
  let businessName = "";
  let output = "";
  let isLoading = false;

  async function generateProposal() {
    isLoading = true;
    output = "";

    const SYSTEM_PROMPT = `You are a Proposal Generator AI for Australian tradies. 
You produce long-form persuasive proposals for clients. 
Your structure must include:
1. Executive Summary (2–3 paragraphs, plain English, persuasive).
2. Detailed Scope Narrative (3–5 paragraphs, explain tasks as a journey).
3. Why Choose Us (2–3 paragraphs, experience, guarantees, professionalism).
4. Timeline & Milestones (1–2 paragraphs, narrate job phases).
5. Pricing Summary (short paragraph: details in estimate doc).
6. Closing & Call to Action (1 paragraph, warm + professional).
7. Signature Block (Business name, contact, ABN if provided).
Tone: approachable, professional, Aussie-friendly. No bullets — use full sentences and paragraphs.`;

    const user = `Trade: ${trade}
Business: ${businessName || "TBA"}
Client: ${clientName || "TBA"}
Project Brief: ${projectBrief}`;

    const stream = streamChat([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: user }
    ]);

    for await (const delta of stream) {
      output += delta;
    }
    isLoading = false;
  }
</script>

<div class="space-y-6">
  <a href="/account/caption" class="btn btn-ghost">← Back</a>

  <h1 class="text-2xl font-bold">Proposal Generator</h1>
  <p class="text-sm opacity-70">
    Create persuasive, long-form client proposals with minimal input. AI expands your brief into a polished document ready for editing or sending.
  </p>

  <div class="card bg-base-100 border">
    <div class="card-body space-y-4">
      <div>
        <label class="block text-sm font-medium">Trade</label>
        <select bind:value={trade} class="select select-bordered w-full">
          <option>General Construction</option>
          <option>Electrical</option>
          <option>Plumbing</option>
          <option>HVAC</option>
          <option>Carpentry</option>
          <option>Tiling</option>
          <option>Painting</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium">Project Brief</label>
        <textarea
          bind:value={projectBrief}
          rows="3"
          class="textarea textarea-bordered w-full"
          placeholder="e.g. Upgrade switchboard for compliance and safety"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium">Client Name (optional)</label>
          <input type="text" bind:value={clientName} class="input input-bordered w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium">Business Name (optional)</label>
          <input type="text" bind:value={businessName} class="input input-bordered w-full" />
        </div>
      </div>

      <button
        class="btn btn-primary w-full"
        on:click={generateProposal}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Proposal"}
      </button>
    </div>
  </div>

  {#if output}
    <div class="card bg-base-100 border">
      <div class="card-body prose max-w-none">
        {@html output}
      </div>
    </div>
  {/if}
</div>
