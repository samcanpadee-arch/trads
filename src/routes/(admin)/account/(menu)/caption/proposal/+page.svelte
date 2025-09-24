<script lang="ts">
  import { onMount } from 'svelte';

  // UI state
  let model: string = 'gpt-4o-mini'; // same selector style as chat; you can change defaults
  const models = ['gpt-4o-mini','gpt-4o','gpt-4.1-mini','gpt-3.5-turbo'];

  // Form fields
  let businessName = '';
  let clientName = '';
  let jobAddress = '';
  let projectTitle = '';
  let scope = '';
  let materialsNotes = '';
  let labourNotes = '';
  let timelineStart = '';
  let timelineDuration = '2–4 weeks';
  let warrantyMonths: number = 12;
  let paymentTerms = '50% deposit, balance on completion (net 7 days)';
  let validityDays = 14;
  let extras = '';

  // Output
  let streaming = false;
  let errorMsg: string | null = null;
  let proposal = '';

  async function generateProposal() {
    errorMsg = null;
    proposal = '';
    streaming = true;

    const systemPrompt = `You are an AI consultant for Aussie trades, tasked with producing a comprehensive project proposal template for tradies. 
The template must cover:
- Project overview & objectives
- Clear, achievable goals
- Timeline with key phases & milestones
- Detailed cost estimate structure (materials & labour), placeholders (not real prices)
- Warranties/guarantees
- Assumptions & exclusions
- Acceptance & next steps

Tone: professional, friendly, Australian English. Output in clean Markdown.`;

    // Build a single-turn "user" payload from the form
    const userPayload = `Please generate a proposal using the following inputs:

Business Name: ${businessName || '(your business)'}
Client Name: ${clientName || '(client)'}
Project Title: ${projectTitle || '(project)'}
Job Address: ${jobAddress || '(address)'} 

Scope / Description:
${scope || '(brief description of the job scope)'}

Materials Notes:
${materialsNotes || '(how materials will be sourced/quality/allowances)'}

Labour Notes:
${labourNotes || '(team, qualifications, approach, safety, site cleanliness)'}

Timeline:
- Start: ${timelineStart || '(TBA)'}
- Duration: ${timelineDuration}

Warranties / Guarantees: ${warrantyMonths} months on workmanship (customise as needed)

Payment Terms: ${paymentTerms}
Quote Validity: ${validityDays} days

Additional Info:
${extras || '(any special considerations)'}
`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPayload }
          ]
        })
      });

      if (!res.ok || !res.body) {
        errorMsg = `Server error: ${res.status}`;
        streaming = false;
        return;
        }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        proposal += decoder.decode(value, { stream: true });
      }
    } catch (err: any) {
      errorMsg = err?.message ?? 'Unexpected error';
    } finally {
      streaming = false;
    }
  }
</script>

<!-- Header -->
<div class="flex items-center justify-between mb-6">
  <h1 class="text-2xl font-bold">Proposal Builder</h1>

  <div class="ml-auto flex items-center gap-2">
    <label class="text-sm opacity-80">Model</label>
    <select class="select select-bordered select-sm" bind:value={model} disabled={streaming}>
      {#each models as m}
        <option value={m}>{m}</option>
      {/each}
    </select>
  </div>
</div>

<!-- Layout: form left, output right -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <!-- Form -->
  <div class="card bg-base-100 border">
    <div class="card-body">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="form-control">
          <span class="label-text">Business Name</span>
          <input class="input input-bordered" bind:value={businessName} placeholder="e.g. BrightSpark Electrical"/>
        </label>

        <label class="form-control">
          <span class="label-text">Client Name</span>
          <input class="input input-bordered" bind:value={clientName} placeholder="e.g. Jane Smith"/>
        </label>

        <label class="form-control md:col-span-2">
          <span class="label-text">Project Title</span>
          <input class="input input-bordered" bind:value={projectTitle} placeholder="e.g. Split System AC Install – Single Storey Home"/>
        </label>

        <label class="form-control md:col-span-2">
          <span class="label-text">Job Address</span>
          <input class="input input-bordered" bind:value={jobAddress} placeholder="e.g. 12 Sample St, Richmond VIC"/>
        </label>

        <label class="form-control md:col-span-2">
          <span class="label-text">Scope / Description</span>
          <textarea class="textarea textarea-bordered min-h-28" bind:value={scope} placeholder="Describe the job scope, inclusions, key deliverables"></textarea>
        </label>

        <label class="form-control md:col-span-2">
          <span class="label-text">Materials Notes</span>
          <textarea class="textarea textarea-bordered min-h-20" bind:value={materialsNotes} placeholder="e.g. supplier standards, quality, brand options, allowances"></textarea>
        </label>

        <label class="form-control md:col-span-2">
          <span class="label-text">Labour Notes</span>
          <textarea class="textarea textarea-bordered min-h-20" bind:value={labourNotes} placeholder="e.g. licenced trades, safety, site cleanliness, waste removal"></textarea>
        </label>

        <label class="form-control">
          <span class="label-text">Timeline Start</span>
          <input class="input input-bordered" bind:value={timelineStart} placeholder="e.g. Within 2 weeks of acceptance"/>
        </label>

        <label class="form-control">
          <span class="label-text">Timeline Duration</span>
          <input class="input input-bordered" bind:value={timelineDuration} placeholder="e.g. 2–4 weeks"/>
        </label>

        <label class="form-control">
          <span class="label-text">Warranty (months)</span>
          <input type="number" min="0" class="input input-bordered" bind:value={warrantyMonths}/>
        </label>

        <label class="form-control">
          <span class="label-text">Quote Validity (days)</span>
          <input type="number" min="1" class="input input-bordered" bind:value={validityDays}/>
        </label>

        <label class="form-control md:col-span-2">
          <span class="label-text">Payment Terms</span>
          <input class="input input-bordered" bind:value={paymentTerms} placeholder="e.g. 50% deposit, balance on completion"/>
        </label>

        <label class="form-control md:col-span-2">
          <span class="label-text">Extras / Notes</span>
          <textarea class="textarea textarea-bordered min-h-20" bind:value={extras} placeholder="Anything else to highlight (site access, permits, council, etc.)"></textarea>
        </label>
      </div>

      {#if errorMsg}
        <div class="alert alert-error mt-4">
          <span>{errorMsg}</span>
        </div>
      {/if}

      <div class="mt-4">
        <button class="btn btn-primary" on:click|preventDefault={generateProposal} disabled={streaming}>
          {streaming ? 'Generating…' : 'Generate Proposal'}
        </button>
      </div>
    </div>
  </div>

  <!-- Output -->
  <div class="card bg-base-100 border">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <h2 class="card-title">AI Proposal (Markdown)</h2>
        <button class="btn btn-ghost btn-sm" on:click={() => navigator.clipboard.writeText(proposal)} disabled={!proposal}>
          Copy
        </button>
      </div>

      <div class="mt-2">
        <!-- No typography plugin required; preserve formatting -->
        <pre class="text-sm whitespace-pre-wrap leading-relaxed">{proposal || 'Fill the form and click “Generate Proposal”.'}</pre>
      </div>
    </div>
  </div>
</div>
