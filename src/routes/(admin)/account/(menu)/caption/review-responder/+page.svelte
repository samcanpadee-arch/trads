<!-- /account/caption/review-responder -->
<script lang="ts">
  let businessName = "";
  let customerName = "";
  let platform = "Google";
  let reviewText = "";

  // Optional context to personalise
  let trade = "General";
  let jobType = "";
  let suburb = "";
  let teamMember = "";

  // Tone & options
  type Tone = "Casual" | "Warm" | "Professional-lite" | "Apologetic" | "Upbeat" | "Aussie mateship";
  let tone: Tone = "Casual";
  let keepItShort = true;   // keep under ~700 characters if true
  let includeEmojis = false;

  let output = "";
  let loading = false;

  function useExample() {
    businessName = "BrightBuild Renovations";
    customerName = "Jordan";
    platform = "Google";
    trade = "Electrical";
    jobType = "Switchboard upgrade + safety check";
    suburb = "Brunswick VIC";
    teamMember = "Ava";
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
`You are a Customer Review Response Generator for Australian tradies. Write in Australian English with a natural, personable vibe. 
Always:
- Start with genuine thanks (use the customer's name if provided).
- Address specifics from the pasted review (paraphrase, don't quote).
- Match the requested tone: Casual | Warm | Professional-lite | Apologetic | Upbeat | Aussie mateship.
- Reinforce quality, reliability and customer care without sounding stiff.
- Invite them to reach out again, casually.
- If review mentions issues, acknowledge and explain what was/will be done.
- Keep it respectful, never defensive. 
- If keepItShort=true, keep it under ~700 characters.
Return ONLY the response text (no preface, no quotes).`;

    const details = [
      businessName ? `Business: ${businessName}` : "",
      customerName ? `Customer: ${customerName}` : "",
      platform ? `Platform: ${platform}` : "",
      trade ? `Trade: ${trade}` : "",
      jobType ? `Job type: ${jobType}` : "",
      suburb ? `Suburb: ${suburb}` : "",
      teamMember ? `Team member: ${teamMember}` : "",
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

If IncludeEmojis=Yes, you may add 1–2 light emojis max (no spam). Sign off with the business name if provided.`;

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
    } catch (err) {
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
  <header class="flex justify-end">
    <a href="/account/caption" class="btn btn-ghost">← Back</a>
  </header>

  <form class="card bg-base-100 border border-base-300 p-4 space-y-4" on:submit={generate}>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Left column: review -->
      <div class="lg:col-span-2 space-y-3">
        <label class="form-control">
          <span class="label-text">Paste the customer review</span>
          <textarea class="textarea textarea-bordered h-40" bind:value={reviewText} placeholder="Paste the review exactly as written…"></textarea>
        </label>
      </div>

      <!-- Right column: controls -->
      <div class="space-y-3">
        <label class="form-control">
          <span class="label-text">Business name</span>
          <input class="input input-bordered" bind:value={businessName} placeholder="e.g. BrightBuild Renovations" />
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="form-control"><span class="label-text">Customer</span><input class="input input-bordered" bind:value={customerName} placeholder="Optional" /></label>
          <label class="form-control"><span class="label-text">Platform</span>
            <select class="select select-bordered" bind:value={platform} aria-label="Platform">
              <option>Google</option><option>Facebook</option><option>Instagram</option><option>ProductReview</option><option>Other</option>
            </select>
          </label>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <label class="form-control"><span class="label-text">Trade</span>
            <select class="select select-bordered" bind:value={trade} aria-label="Trade">
              <option>General</option><option>HVAC</option><option>Electrical</option><option>Plumbing</option><option>Carpentry</option><option>Tiling</option><option>Construction</option><option>Landscaping</option><option>Painting</option><option>Other</option>
            </select>
          </label>
          <label class="form-control"><span class="label-text">Suburb</span><input class="input input-bordered" bind:value={suburb} placeholder="Optional" /></label>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <label class="form-control"><span class="label-text">Job type</span><input class="input input-bordered" bind:value={jobType} placeholder="Optional" /></label>
          <label class="form-control"><span class="label-text">Team member</span><input class="input input-bordered" bind:value={teamMember} placeholder="Optional" /></label>
        </div>

        <label class="form-control">
          <span class="label-text">Tone</span>
          <select class="select select-bordered" bind:value={tone} aria-label="Tone">
            <option>Casual</option>
            <option>Warm</option>
            <option>Professional-lite</option>
            <option>Apologetic</option>
            <option>Upbeat</option>
            <option>Aussie mateship</option>
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
