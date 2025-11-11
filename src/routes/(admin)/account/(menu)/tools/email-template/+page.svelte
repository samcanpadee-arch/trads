<!-- /account/tools/email-template (v1.4 — simplified UI: single required brief, clean spacing) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { getChatErrorMessage } from "$lib/utils/chat-errors";

  // Required
  let brief = "";             // The only required field

  // Optional inputs
  let clientName = "";
  let purpose = "Job summary (after completion)";
  let businessName = "";
  let contact = "";           // phone / url / email
  type Tone = "Professional" | "Friendly" | "Casual Aussie";
  let tone: Tone = "Friendly";
  let keepItShort = true;

  // UX state
  let output = "";
  let loading = false;
  let briefTouched = false;

  function useExample() {
    brief =
      "Completed a switchboard upgrade with compliant RCBOs, added 2x kitchen GPOs, replaced 6x downlights with warm white LEDs, cleaned up. Next step: fit-off for the island pendant (awaiting delivery).";
    clientName = "Jordan";
    purpose = "Job summary (after completion)";
    businessName = "BrightSpark Electrical";
    contact = "0400 123 456 · brightspark.au";
    tone = "Friendly";
    keepItShort = true;
  }

  function cleanPointsFromBrief(raw: string): string[] {
    // If user typed multiple short lines, turn those into a clean list for the model.
    return raw
      .split(/\r?\n/)
      .map((l) => l.replace(/^[•\-\*\s]+/, "").trim())
      .filter(Boolean);
  }

  async function generate(e: Event) {
    e.preventDefault();
    briefTouched = true;
    if (!brief.trim()) return;

    output = "";
    loading = true;

    const SYSTEM = `You are an advanced Email Template Generator AI for Australian tradies.
Write in Australian English; personable yet professional.

Always:
- Identify the email purpose and keep the copy aligned to it.
- Start with a personalised greeting using the client's name if provided (e.g., "Hi Jordan,").
- Integrate the brief clearly and concisely. If the brief looks like multiple short lines, you may render key tasks as bullet points.
- Maintain a professional but friendly tradie tone (no fluff, no hard sell).
- End with a clear call to action aligned to the purpose.
- Close with a professional signature that includes business name and contact if provided.
If purpose is "Job summary (after completion)":
- Start with a one-sentence job context.
- If helpful, show key tasks as a short list in plain English.
- Mention provided effort/hours only if included (do not invent).
If keepItShort=true: target ~150–220 words.
Return only the email body text (no preface, no quotes, no markdown).`;

    const points = cleanPointsFromBrief(brief);
    const user =
      `Brief:\n${brief.trim()}\n\n` +
      (points.length ? `Brief (clean list):\n- ${points.join("\n- ")}\n\n` : "") +
      `Client: ${clientName || "TBA"}\n` +
      `Purpose: ${purpose}\n` +
      `Tone: ${tone}\n` +
      `KeepItShort: ${keepItShort ? "Yes" : "No"}\n` +
      `Business: ${businessName || "TBA"}\n` +
      `Contact: ${contact || "TBA"}`;

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
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        output += decoder.decode(value);
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

  $: __rich = (output || "").trim();
  $: __briefInvalid = briefTouched && !brief.trim();
</script>

<svelte:head><title>Email Template Generator</title></svelte:head>

<section class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10">
  <header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold">Email Template Generator</h1>
      <p class="max-w-2xl text-sm leading-relaxed text-base-content/80">
        Drop in the guts of the job and we’ll craft a clear, confident email that
        sounds like your crew — perfect for progress updates, payment nudges, and
        post-job wrap ups.
      </p>
    </div>
    <a href="/account/tools" class="btn btn-ghost self-start sm:self-auto">← Back</a>
  </header>

  <form class="card w-full border border-base-300 bg-base-100 p-5 sm:p-6 space-y-6" on:submit={generate}>
    <!-- Brief (the only required field) -->
    <div class="form-control gap-3">
      <label for="brief" class="label">
        <span class="label-text">Quick brief <span class="text-error">*</span></span>
      </label>
      <textarea
        id="brief"
        class="textarea textarea-bordered h-32 w-full"
        bind:value={brief}
        on:blur={() => (briefTouched = true)}
        placeholder="In one or two sentences, what did you do / what’s the purpose? (e.g., Completed switchboard upgrade, added kitchen GPOs, replaced 6x downlights; now ready to send a completion email.)"
      ></textarea>
      {#if __briefInvalid}
        <span class="mt-1 text-xs text-error">Please enter a quick brief.</span>
      {/if}
      <p class="break-words text-xs leading-relaxed text-base-content/70 sm:text-sm">
        Tip: If you prefer bullet points, put each point on a new line — we’ll format it nicely.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left column: core meta -->
      <div class="space-y-6 lg:col-span-2">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <label class="form-control block gap-3">
            <span class="label-text">Client name (optional)</span>
            <input class="input input-bordered w-full" bind:value={clientName} placeholder="e.g. Jordan" />
          </label>
          <label class="form-control block gap-3">
            <span class="label-text">Purpose</span>
            <select class="select select-bordered w-full" bind:value={purpose} aria-label="Purpose">
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
      </div>

      <!-- Right column: brand & tone -->
      <div class="space-y-6">
        <label class="form-control gap-3">
          <span class="label-text">Email signature / contact details (optional)</span>
          <input
            class="input input-bordered w-full"
            bind:value={contact}
            placeholder="e.g. 0400 123 456 · hello@bright.au · bright.au/book"
          />
        </label>

        <label class="form-control gap-3">
          <span class="label-text">Business name (optional)</span>
          <input
            class="input input-bordered w-full"
            bind:value={businessName}
            placeholder="e.g. BrightSpark Electrical"
          />
        </label>

        <label class="form-control gap-3">
          <span class="label-text">Tone</span>
          <select class="select select-bordered w-full" bind:value={tone} aria-label="Tone">
            <option>Professional</option>
            <option>Friendly</option>
            <option>Casual Aussie</option>
          </select>
        </label>

        <label class="label cursor-pointer justify-start gap-3">
          <input type="checkbox" class="checkbox" bind:checked={keepItShort} />
          <span class="label-text text-xs leading-relaxed text-base-content/70 sm:text-sm"
            >Keep it concise (~150–220 words)</span
          >
        </label>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button class="btn btn-primary" type="submit" disabled={loading || !brief.trim()}>
        {#if loading}<span class="loading loading-dots"></span>{/if}
        <span>Generate Email</span>
      </button>
      <button type="button" class="btn" on:click={useExample}>Use example</button>
      <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}>Copy</button>
    </div>
  </form>

  <!-- Rich preview -->
  {#if __rich.length}
    <div class="card mt-4 border border-base-300 bg-base-100">
      <div class="card-body">
        <h3 class="card-title text-base">Generated Email</h3>
        <RichAnswer text={__rich} />
      </div>
    </div>
  {/if}
</section>
