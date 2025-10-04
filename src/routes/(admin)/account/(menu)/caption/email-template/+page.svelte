<!-- /account/caption/email-template (v1.2 rich preview) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";

  // Minimal inputs
  let clientName = "";
  let purpose = "Job summary (after completion)"; // default
  let keyPoints = ""; // multi-line; one point per line (or sentences)

  // Optional tradie/brand details
  let businessName = "";
  let contact = ""; // phone or URL or email

  // Tone & options
  type Tone = "Professional" | "Friendly" | "Casual Aussie";
  let tone: Tone = "Friendly";
  let keepItShort = true; // aim for concise, ~150-220 words if true

  // Output state
  let output = "";
  let loading = false;

  function useExample() {
    clientName = "Jordan";
    purpose = "Job summary (after completion)";
    keyPoints = `• Replaced old switchboard with compliant RCBOs
• Added two new GPOs in kitchen
• Swapped 6x downlights to LED warm white
• Left work area clean; tested and labelled
• Next step: fit-off for pendant above island (awaiting delivery)`;
    businessName = "BrightSpark Electrical";
    contact = "0400 123 456 | brightspark.au";
    tone = "Friendly";
    keepItShort = true;
  }

  async function generate(e: Event) {
    e.preventDefault();
    output = "";
    loading = true;

    const SYSTEM = `You are an advanced Email Template Generator AI for Australian tradies. Each request is independent.
Write in Australian English; personable yet professional.
Always:
- Identify the email purpose and keep the copy aligned to it.
- Start with a personalised greeting using the client's name if provided (e.g., "Hi Jordan,").
- Integrate all key points clearly and concisely (bullet points if suitable).
- Maintain a professional but friendly tradie tone (no fluff, no hard sell).
- End with a clear call to action aligned to the purpose.
- Close with a professional signature that includes business name and contact if provided.
If the purpose is a job summary (after completion):
- Start with a one-sentence job type/context.
- Present key tasks as bullet points in plain English.
- Mention total effort/hours if provided in key points (don't fabricate values).
- Thank the client for their trust and reinforce quality.
If keepItShort=true: target ~150–220 words. No markdown, no quotes. Return only the email body text.`;

    // Make a clean list from keyPoints (but pass raw too so model can decide layout)
    const points = keyPoints
      .split(/\r?\n/)
      .map((l) => l.replace(/^[•\-\*\s]+/, "").trim())
      .filter(Boolean);

    const user =
      `Client: ${clientName || "TBA"}\n` +
      `Purpose: ${purpose}\n` +
      `Tone: ${tone}\n` +
      `KeepItShort: ${keepItShort ? "Yes" : "No"}\n` +
      `Business: ${businessName || "TBA"}\n` +
      `Contact: ${contact || "TBA"}\n` +
      `KeyPoints (raw):\n${keyPoints.trim()}\n` +
      (points.length ? `KeyPoints (clean list):\n- ${points.join("\n- ")}\n` : "");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: user }
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
        output = "Could not generate an email right now. Please try again.";
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
    } catch {}
  }
  function downloadOut() {
    const blob = new Blob([output || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-template.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Rich preview content comes straight from the generated output
  $: __rich = (output || "").trim();
</script>

<svelte:head><title>Email Template Generator</title></svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-semibold">Email Template Generator</h1>
      <p class="text-sm opacity-70">
        Generate a polished, client-ready email from a few key points — with friendly, professional Aussie tone.
        Includes a purpose for job summaries.
      </p>
    </div>
    <a href="/account/caption" class="btn btn-ghost">← Back</a>
  </header>

  <form class="card bg-base-100 border border-base-300 p-6 space-y-6" on:submit={generate}>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: key content -->
      <div class="lg:col-span-2 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label class="form-control">
            <span class="label-text">Client name</span>
            <input class="input input-bordered" bind:value={clientName} placeholder="e.g. Jordan" />
          </label>
          <label class="form-control">
            <span class="label-text">Purpose</span>
            <select class="select select-bordered" bind:value={purpose} aria-label="Purpose">
              <option>Job summary (after completion)</option>
              <option>Progress update</option>
              <option>Payment reminder</option>
              <option>Quote follow-up</option>
              <option>General update</option>
              <option>Thank you</option>
              <option>Custom</option>
            </select>
          </label>
        </div>

        <label class="form-control">
          <span class="label-text">Key points (one per line)</span>
          <textarea
            class="textarea textarea-bordered h-40"
            bind:value={keyPoints}
            placeholder="List the essentials. Example:
• Install 2x GPOs in kitchen
• Replace switchboard with RCBOs
• Fit-off scheduled Tuesday
• Final invoice due in 7 days"></textarea>
        </label>
      </div>

      <!-- Right: brand + tone -->
      <div class="space-y-4">
        <label class="form-control">
          <span class="label-text">Business name (optional)</span>
          <input
            class="input input-bordered"
            bind:value={businessName}
            placeholder="e.g. BrightSpark Electrical"
          />
        </label>
        <label class="form-control">
          <span class="label-text">Email signature / contact details (optional)</span>
          <input
            class="input input-bordered"
            bind:value={contact}
            placeholder="e.g. 0400 123 456 | hello@bright.au | bright.au/book"
          />
        </label>

        <label class="form-control">
          <span class="label-text">Tone</span>
          <select class="select select-bordered" bind:value={tone} aria-label="Tone">
            <option>Professional</option>
            <option>Friendly</option>
            <option>Casual Aussie</option>
          </select>
        </label>

        <label class="label cursor-pointer justify-start gap-3">
          <input type="checkbox" class="checkbox" bind:checked={keepItShort} />
          <span class="label-text">Keep it concise (~150–220 words)</span>
        </label>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button class="btn btn-primary" type="submit" disabled={loading}>
        {#if loading}<span class="loading loading-dots"></span>{/if}
        <span>Generate Email</span>
      </button>
      <button type="button" class="btn" on:click={useExample}>Use example</button>
      <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}>Copy</button>
      <button type="button" class="btn btn-outline" on:click={downloadOut} disabled={!output}>Download .txt</button>
    </div>

    <div class="alert alert-info">
      <span>Draft only — please review names, dates, and amounts before sending.</span>
    </div>
  </form>

  <!-- Plain text fallback (keep it for safety) -->
  {#if output}
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <h2 class="card-title text-base">Generated Email</h2>
        <pre class="whitespace-pre-wrap text-sm">{output}</pre>
      </div>
    </div>
  {/if}

  <!-- Rich preview (single reliable block) -->
  {#if __rich.length}
    <div class="card bg-base-100 border mt-4">
      <div class="card-body">
        <h3 class="card-title text-base">Formatted preview</h3>
        <RichAnswer text={__rich} />
        <div class="mt-2">
          <button
            type="button"
            class="btn btn-outline btn-sm"
            on:click={() => navigator.clipboard.writeText(__rich)}
          >
            Copy answer
          </button>
        </div>
      </div>
    </div>
  {/if}
</section>
