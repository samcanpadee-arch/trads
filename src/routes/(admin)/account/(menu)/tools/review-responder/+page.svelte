<!-- /account/tools/review-responder (v1.3 — rich-only, no download, no markdown) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { getChatErrorMessage } from "$lib/utils/chat-errors";
  import { profileBrandContext, type ProfileBasics } from "$lib/utils/profile-brand";

  export let data: { profile?: ProfileBasics | null };
  const profile = data?.profile ?? null;
  const brandContext = profileBrandContext(profile);

  // Minimal inputs
  let businessName = "";
  let customerName = "";
  let platform = "Google";
  let reviewText = "";

  // Tone & options
  type Tone =
    | "Casual"
    | "Warm"
    | "Professional-lite"
    | "Apologetic"
    | "Upbeat"
    | "Aussie friendly";
  let tone: Tone = "Casual";
  let keepItShort = true; // keep under ~700 chars if true
  let includeEmojis = false;

  let output = "";
  let loading = false;

  let businessPrefilled = false;
  $: if (!businessPrefilled) {
    const fallback = (profile?.company_name ?? "").trim();
    if (fallback) {
      businessName = fallback;
      businessPrefilled = true;
    }
  }

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

    const SYSTEM = `You are a Customer Review Response Generator for Australian tradies. Write in Australian English with a personable, natural vibe.
Always:
- Start with genuine thanks (use the customer's name if provided).
- Address specifics from the pasted review (paraphrase, don't quote).
- Match the requested tone: Casual | Warm | Professional-lite | Apologetic | Upbeat | Aussie friendly.
- Reinforce quality, reliability and customer care without sounding stiff.
- Invite them to reach out again, casually.
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
    ]
      .filter(Boolean)
      .join("\n");

    const user = `Here is the customer review (triple backticks):

\`\`\`
${reviewText.trim()}
\`\`\`

Context:
${details}

If IncludeEmojis=Yes, you may add 1–2 light emojis max (no spam). If Business is provided, you may sign off with it.
${brandContext ? `Brand context:\n${brandContext}` : ""}`;

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
      let fullyRead = false;
      while (!fullyRead) {
        const { done, value } = await reader.read();
        fullyRead = Boolean(done);
        if (value) {
          output += decoder.decode(value);
        }
      }
    } catch (error) {
      console.error("review responder failed", error);
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

  // Rich preview source: use the generated output directly.
  $: __rich = (output || "").trim();
</script>

<svelte:head><title>Review Responder</title></svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Reputation</p>
        <h1 class="text-3xl font-bold leading-tight text-gray-900">Review Responder</h1>
        <p class="max-w-3xl text-base text-gray-700">
          Drop in any customer feedback and we’ll spin up a personable, Aussie-toned reply that backs your workmanship and keeps the convo rolling across Google, socials, ProductReview, Hipages, and more.
        </p>
      </div>
      <a href="/account/tools" class="btn btn-ghost self-start text-sm">← Back to Smart Tools</a>
    </div>
  </header>

  <form class="rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-sm sm:p-6 space-y-6" on:submit={generate}>
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left: review -->
      <div class="space-y-5 lg:col-span-2">
        <label class="form-control gap-3">
          <span class="label-text">Paste the customer review</span>
          <textarea
            class="textarea textarea-bordered h-40 w-full"
            bind:value={reviewText}
            placeholder="Paste the review exactly as written…"
          ></textarea>
        </label>
      </div>

      <!-- Right: minimal controls -->
      <div class="flex flex-col gap-4">
        <label class="form-control gap-3">
          <span class="label-text">Business name</span>
          <input
            class="input input-bordered w-full"
            bind:value={businessName}
            placeholder="e.g. BrightBuild Renovations"
          />
        </label>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
          <label class="form-control gap-3 sm:self-start">
            <span class="label-text">Customer (optional)</span>
            <input
              class="input input-bordered w-full"
              bind:value={customerName}
              placeholder="e.g. Jordan"
            />
          </label>
          <label class="form-control gap-3 sm:self-start">
            <span class="label-text">Platform</span>
            <select
              class="select select-bordered w-full"
              bind:value={platform}
              aria-label="Platform"
            >
              <option>Google</option>
              <option>Facebook</option>
              <option>Instagram</option>
              <option>ProductReview</option>
              <option>Hipages</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        <label class="form-control gap-3">
          <span class="label-text">Tone</span>
          <select
            class="select select-bordered w-full"
            bind:value={tone}
            aria-label="Tone"
          >
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
          <span class="label-text text-sm">Keep it short (about a paragraph)</span>
        </label>
        <label class="label cursor-pointer justify-start gap-3">
          <input type="checkbox" class="checkbox" bind:checked={includeEmojis} />
          <span class="label-text text-sm">Include 1–2 light emojis</span>
        </label>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button class="btn btn-primary" type="submit" disabled={loading}>
        {#if loading}<span class="loading loading-dots"></span>{/if}
        <span>Generate Response</span>
      </button>
      <button type="button" class="btn" on:click={useExample}>Use example</button>
      <button type="button" class="btn btn-ghost" on:click={copyOut} disabled={!output}
        >Copy</button
      >
    </div>
  </form>

  <!-- Rich preview only -->
  {#if __rich.length}
    <div class="rounded-3xl border border-gray-200 bg-white/95 shadow-sm mt-4">
      <div class="space-y-4 p-5 sm:p-6">
        <h3 class="text-lg font-semibold">Suggested Response</h3>
        <RichAnswer text={__rich} />
      </div>
    </div>
  {/if}
</section>
