<!-- /account/tools/social-post (v1.2 single rich preview + collapsible extras) -->
<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";

  // Minimal inputs
  let brief = ""; // required
  let category = "Project completion / Before–after"; // required
  let platforms: string[] = ["Instagram"]; // multi
  type Tone =
    | "Casual"
    | "Warm"
    | "Professional-lite"
    | "Upbeat"
    | "Aussie friendly";
  let tone: Tone = "Aussie friendly";

  // Options
  let keepUnderPlatformLimits = true;
  let includeEmojis = true;
  let includeHashtags = true;
  let prettyLineBreaks = true;

  // Optional brand bits
  let businessName = "";
  let serviceArea = "";
  let contact = ""; // phone or URL

  // Output
  let outputText = ""; // fallback if JSON parsing fails
  let caption = "";
  let variants = { short: "", standard: "", promo: "" };
  let hashtags: string[] = [];
  let mediaIdeas: string[] = [];
  let loading = false;

  function togglePlatform(p: string, checked: boolean) {
    if (checked) {
      if (!platforms.includes(p)) platforms = [...platforms, p];
    } else {
      platforms = platforms.filter((x) => x !== p);
    }
  }

  function useExample() {
    brief =
      "Wrapped a full bathroom reno in Preston - waterproofing, tiling, and a walk-in shower with matte black fittings. Include a tip about grout care and an invite to book pre-Christmas spots.";
    category = "Project completion / Before–after";
    platforms = ["Instagram", "Google Business Profile"];
    tone = "Aussie friendly";
    keepUnderPlatformLimits = true;
    includeEmojis = true;
    includeHashtags = true;
    prettyLineBreaks = true;
    businessName = "BrightBuild Renovations";
    serviceArea = "Northern Suburbs, Melbourne";
    contact = "brightbuild.au/book";
  }

  async function generate(e: Event) {
    e.preventDefault();
    loading = true;
    outputText = "";
    caption = "";
    variants = { short: "", standard: "", promo: "" };
    hashtags = [];
    mediaIdeas = [];

    const SYSTEM = `Independent Social Media Post Generator AI for Australian tradies.
- Write in Australian English with a balanced casual-professional tone (personable, not salesy).
- Identify the category from user selection and match style.
- Integrate ONLY provided context (no invented specifics).
- Platform-aware length/format; if keepUnderPlatformLimits, respect typical limits (IG~2200, LinkedIn~3000, TikTok~150-220, GBP concise).
- If includeEmojis=false, avoid emojis entirely; if true, max 2 light emojis.
- Always end with a friendly, non-pushy CTA.
Return ONLY strict JSON:
{
"caption": string,
"variants": { "short": string, "standard": string, "promo": string },
"hashtags": string[],
"mediaIdeas": string[]
}`;

    const user = {
      category,
      brief,
      platforms,
      tone,
      options: {
        keepUnderPlatformLimits,
        includeEmojis,
        includeHashtags,
        prettyLineBreaks,
      },
      brand: {
        businessName,
        serviceArea,
        contact,
      },
    };

    const body = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: JSON.stringify(user) },
      ],
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let text = "";
      if (res.ok && res.body) {
        const r = res.body.getReader();
        const d = new TextDecoder();
        while (true) {
          const { done, value } = await r.read();
          if (done) break;
          text += d.decode(value);
        }
      }
      outputText = text || "";

      // Parse JSON; if fails, show raw text in the rich box (fallback below)
      try {
        const j = JSON.parse(outputText);
        caption = String(j.caption || "");
        variants = {
          short: String(j?.variants?.short || ""),
          standard: String(j?.variants?.standard || ""),
          promo: String(j?.variants?.promo || ""),
        };
        hashtags = Array.isArray(j.hashtags) ? j.hashtags.map(String) : [];
        mediaIdeas = Array.isArray(j.mediaIdeas)
          ? j.mediaIdeas.map(String)
          : [];
      } catch {
        // leave caption empty to use raw fallback in preview
      }
    } catch {
      outputText = "Network or server error. Please try again.";
    } finally {
      loading = false;
    }
  }

  function copy(text: string) {
    if (text)
      try {
        navigator.clipboard.writeText(text);
      } catch {}
  }

  // ---------- Rich preview content (Main caption only; extras shown in collapsible) ----------
  $: __richMain = (() => {
    if (caption.trim().length) {
      // No heading, as requested—just the caption itself
      return caption;
    }
    // Fallback to whatever text streamed back (often JSON or partial text)
    return outputText || "";
  })();
</script>

<svelte:head><title>Social Media Post Generator</title></svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-semibold">Social Media Post Generator</h1>
      <p class="text-sm opacity-70">
        Generate a ready-to-post caption from a short brief. Category-aware,
        platform-savvy, Aussie-friendly tone — ends with a soft CTA.
      </p>
    </div>
    <a href="/account/tools" class="btn btn-ghost">← Back</a>
  </header>

  <form
    class="card bg-base-100 border border-base-300 p-4 space-y-4"
    on:submit={generate}
  >
    <!-- Brief -->
    <label class="form-control">
      <span class="label-text">Quick brief (1–3 sentences)</span>
      <textarea
        class="textarea textarea-bordered h-28"
        bind:value={brief}
        placeholder="What’s the post about? e.g., Finished a kitchen reno in Coburg; before/after; promo for winter heater servicing; safety tip about RCDs…"
      ></textarea>
    </label>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Category -->
      <label class="form-control">
        <span class="label-text">Category</span>
        <select
          class="select select-bordered"
          bind:value={category}
          aria-label="Category"
        >
          <option>Project completion / Before–after</option>
          <option>Maintenance tip / Safety advice</option>
          <option>Promo / Offer / Seasonal</option>
          <option>Community / Team spotlight</option>
          <option>Emergency call-out / Availability</option>
          <option>Other</option>
        </select>
      </label>

      <!-- Tone -->
      <label class="form-control">
        <span class="label-text">Tone</span>
        <select
          class="select select-bordered"
          bind:value={tone}
          aria-label="Tone"
        >
          <option>Casual</option>
          <option>Warm</option>
          <option>Professional-lite</option>
          <option>Upbeat</option>
          <option>Aussie friendly</option>
        </select>
      </label>

      <!-- Brand (optional) -->
      <div class="grid grid-cols-1 gap-3">
        <label class="form-control">
          <span class="label-text">Business name (optional)</span>
          <input
            class="input input-bordered"
            bind:value={businessName}
            placeholder="e.g. BrightBuild"
          />
        </label>
        <label class="form-control">
          <span class="label-text">Service area (optional)</span>
          <input
            class="input input-bordered"
            bind:value={serviceArea}
            placeholder="e.g. Sydney Inner West"
          />
        </label>
        <label class="form-control">
          <span class="label-text">Phone/URL (optional)</span>
          <input
            class="input input-bordered"
            bind:value={contact}
            placeholder="e.g. (02) 1234 5678 or brightbuild.au/book"
          />
        </label>
      </div>
    </div>

    <!-- Platforms -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body gap-3">
        <h2 class="card-title text-base">Platforms</h2>
        <div class="flex flex-wrap gap-3">
          {#each ["Instagram", "Facebook", "LinkedIn", "Google Business Profile", "TikTok"] as p}
            <label class="label cursor-pointer gap-2">
              <input
                type="checkbox"
                class="checkbox"
                checked={platforms.includes(p)}
                on:change={(e: any) =>
                  togglePlatform(p, e.currentTarget.checked)}
              />
              <span class="label-text">{p}</span>
            </label>
          {/each}
        </div>
      </div>
    </div>

    <!-- Options -->
    <div class="flex flex-wrap items-center gap-4">
      <label class="label cursor-pointer gap-2">
        <input
          type="checkbox"
          class="checkbox"
          bind:checked={keepUnderPlatformLimits}
        />
        <span class="label-text">Keep under platform limits</span>
      </label>
      <label class="label cursor-pointer gap-2">
        <input type="checkbox" class="checkbox" bind:checked={includeEmojis} />
        <span class="label-text">Include up to 2 emojis</span>
      </label>
      <label class="label cursor-pointer gap-2">
        <input
          type="checkbox"
          class="checkbox"
          bind:checked={includeHashtags}
        />
        <span class="label-text">Include hashtags</span>
      </label>
      <label class="label cursor-pointer gap-2">
        <input
          type="checkbox"
          class="checkbox"
          bind:checked={prettyLineBreaks}
        />
        <span class="label-text">Readable line breaks</span>
      </label>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        class="btn btn-primary"
        type="submit"
        disabled={loading || !brief.trim()}
      >
        {#if loading}<span class="loading loading-dots"></span>{/if}
        <span>Generate Post</span>
      </button>
      <button type="button" class="btn" on:click={useExample}
        >Use example</button
      >
      <button
        type="button"
        class="btn btn-ghost"
        on:click={() => copy(caption || outputText)}
        disabled={!caption && !outputText}>Copy</button
      >
    </div>

    <div class="alert alert-info">
      <span
        >Draft only - review names, details and tone before posting.</span
      >
    </div>
  </form>

  <!-- Single Rich preview card -->
  {#if (__richMain && __richMain.trim().length)}
    <div class="card bg-base-100 border mt-2">
      <div class="card-body gap-3">
        <!-- No heading (per request) -->
        <RichAnswer text={__richMain} />

        <!-- Collapsible Variants & Extras (only when we parsed JSON) -->
        {#if caption}
          <details class="collapse collapse-arrow border border-base-300 rounded-box mt-2">
            <summary class="collapse-title text-sm font-medium">
              Variants & Extras
            </summary>
            <div class="collapse-content space-y-3">
              {#if variants.short}
  <div>
    <h3 class="font-semibold text-sm">Short</h3>
    <RichAnswer text={variants.short} />
  </div>
{/if}
{#if variants.standard}
  <div>
    <h3 class="font-semibold text-sm">Standard</h3>
    <RichAnswer text={variants.standard} />
  </div>
{/if}
{#if variants.promo}
  <div>
    <h3 class="font-semibold text-sm">Promo</h3>
    <RichAnswer text={variants.promo} />
  </div>
{/if}
              {#if includeHashtags && hashtags.length}
                <div>
                  <h3 class="font-semibold text-sm">Hashtags</h3>
                  <div class="flex flex-wrap gap-2">
                    {#each hashtags as h}<span class="badge">{h}</span>{/each}
                  </div>
                </div>
              {/if}
              {#if mediaIdeas.length}
                <div>
                  <h3 class="font-semibold text-sm">Media ideas</h3>
                  <ul class="list-disc pl-5 text-sm">
                    {#each mediaIdeas as m}<li>{m}</li>{/each}
                  </ul>
                </div>
              {/if}
            </div>
          </details>
        {/if}
      </div>
    </div>
  {/if}
</section>
