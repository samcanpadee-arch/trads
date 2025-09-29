<!-- /account/caption/review-responder (v1.1) -->
<script lang="ts">
  // Minimal inputs
  let businessName = "";
  let customerName = "";
  let platform = "Google";
  let reviewText = "";

  // Tone & options
  type Tone = "Casual" | "Warm" | "Professional-lite" | "Apologetic" | "Upbeat" | "Aussie friendly";
  let tone: Tone = "Casual";
  let keepItShort = true;   // keep under ~700 chars if true
  let includeEmojis = false;

  let output = "";
  let loading = false;

  function useExample() {
    businessName = "BrightBuild Renovations";
    customerName = "Jordan";
    platform = "Google";
    reviewText = `Had the BrightBuild team upgrade our old switchboard and add a few new power points. They were on time and cleaned up after themselves. Price was fair and they explained everything. Would recommend.`;
    tone = "Warm";
    keepItShort = true;
    includeEmojis = false;
  }

  async function generate(e: Event) {
    e.preventDefault();
    output = "";
    loading = true;

    const SYSTEM =
`You are a Customer Review Response Generator for Australian tradies. Write in Australian English with a personable, natural vibe.
Always:
- Start with genuine thanks (use the customer's name if provided).
- Address specifics from the pasted review (paraphrase, don't quote).
- Match the requested tone: Casual | Warm | Professional-lite | Apologetic | Upbeat | Aussie friendly.
- Reinforce quality, reliability and customer care without sounding stiff.
- Invite them to reach out again, casually.
- If issues are mentioned, acknowledge and say what was/will be done.
- If keepItShort=true, keep it under ~700 characters.
Infer context (e.g., trade, location, team actions) from the review itself. Don't invent names not provided.
Return ONLY the response text (no preface, no quotes).`;

    const details = [
      businessName ? `Business: ${businessName}` : "",
      customerName ? `Customer: ${customerName}` : "",
      platform ? `Platform: ${platform}` : "",
      `Tone: ${tone}`,
      `KeepItShort: ${keepItShort ? "Yes" : "No"}`,
      `IncludeEmojis: ${includeEmojis ? "Yes" : "No"}`
    ].filter(Boolean).join("\n");

    const user =
`Here is the customer review (triple backticks):

\`\`\`
${reviewText.trim()}
\`\`\`

Context:
${details}

If IncludeEmojis=Yes, you may add 1–2 light emojis max (no spam). If Business is provided, you may sign off with it.`;

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
        output = "Could not generate a response. Please try again.";
      }
    } catch {
      output = "Network error while generating. Please try again.";
    } finally {
      loading = false;
    }
  }

  function copyOut() { try { navigator.clipboard.writeText(output || ""); } catch {} }
  function downloadOut() {
    const blob = new Blob([output || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "review-response.txt"; a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head><title>Review Responder</title></svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-semibold">Review Responder</h1>
      <p class="text-sm opacity-70">Paste a customer review and generate a friendly, on-brand reply with tone control — perfect for Google, Facebook, Instagram, ProductReview, Hipages and more.</p>
    </div>
    <a href="/account/caption" class="btn btn-ghost">← Back</a>
  </header>

  <form class="card bg-base-100 border border-base-300 p-4 space-y-4" on:submit={generate}>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Left: review -->
      <div class="lg:col-span-2 space-y-3">
        <label class="form-control">
          <span class="label-text">Paste the customer review</span>
          <textarea class="textarea textarea-bordered h-40" bind:value={reviewText} placeholder="Paste the review exactly as written…"></textarea>
        </label>
      </div>

      <!-- Right: minimal controls -->
      <div class="space-y-3">
        <label class="form-control">
          <span class="label-text">Business name</span>
          <input class="input input-bordered" bind:value={businessName} placeholder="e.g. BrightBuild Renovations" />
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="form-control"><span class="label-text">Customer (optional)</span><input class="input input-bordered" bind:value={customerName} placeholder="e.g. Jordan" /></label>
          <label class="form-control"><span class="label-text">Platform</span>
            <select class="select select-bordered" bind:value={platform} aria-label="Platform">
              <option>Google</option>
              <option>Facebook</option>
              <option>Instagram</option>
              <option>ProductReview</option>
              <option>Hipages</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        <label class="form-control">
          <span class="label-text">Tone</span>
          <select class="select select-bordered" bind:value={tone} aria-label="Tone">
            <option>Casual</option>
            <option>Warm</option>
            <option>Professional-lite</option>
            <option>Apologetic</option>
            <option>Upbeat</option>
            <option>Aussie friendly</option>
          </select>
        </label>

        <label class="label cursor-pointer justify-start gap-3">
          <input type="checkbox" class="checkbox" bind:checked={keepItShort} />
          <span class="label-text">Keep it short (about a paragraph)</span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input type="checkbox" class="checkbox" bind:checked={includeEmojis} />
          <span class="label-text">Include 1–2 light emojis</span>
        </label>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button class="btn btn-primary" type="submit" disabled={loading}>
        {#if loading}<span class="loading loading-dots"></span>{/if}
        <span>Generate Response</span>
      </button>
      <button type="button" class="btn" on:click={useExample}>Use example</button>
      <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}>Copy</button>
      <button type="button" class="btn btn-outline" on:click={downloadOut} disabled={!output}>Download .txt</button>
    </div>

    <div class="alert alert-info">
      <span>Note: This is a generated draft. Please review names, job details and tone before posting publicly.</span>
    </div>
  </form>

  {#if output}
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-base">Suggested Response</h2>
      <pre class="whitespace-pre-wrap text-sm">{output}</pre>
    </div>
  </div>
  {/if}
</section>
