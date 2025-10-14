<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";

  // --- selectable lists (restored & expanded) ---
  const trades = [
    "Electrical",
    "Plumbing",
    "HVAC",
    "General Construction",
    "Carpentry",
    "Roofing",
    "Tiling",
    "Painting",
    "Landscaping",
    "Other"
  ];

  const focuses = [
    { value: "general", label: "General help" },
    { value: "diagnosis", label: "Diagnosis & fault codes" },
    { value: "install", label: "Installation & commissioning" },
    { value: "compliance", label: "Compliance, standards & codes" },
    { value: "maintenance", label: "Maintenance & servicing" },
    { value: "specs", label: "Parts & specifications" }
  ];

  // --- form state ---
  let trade = "";
  let brandModel = "";     // single combined field (e.g., "Panasonic CS-Z50VKR" or "AS/NZS 3000")
  let focus = "general";
  let files: File[] = [];
  let share = false;
  let message = "";

  // --- ui state ---
  let loading = false;
  let errorMsg = "";
  let answer = "";
  let copied = false;

  function handleFileChange(e: Event) {
    const el = e.target as HTMLInputElement;
    files = Array.from(el.files ?? []);
  }

  async function onAsk(e?: Event) {
    e?.preventDefault?.();

    try {
      loading = true;
      errorMsg = "";
      answer = "";

      const fd = new FormData();
      fd.set("message", (typeof message === "string" ? message : "").trim());
      if (trade) fd.set("trade", trade);
      if (brandModel) fd.set("brand", brandModel);
      if (share) fd.set("share", "yes");
      for (const f of files) fd.append("files", f);

      const res = await fetch("/api/assistant", { method: "POST", body: fd });
      const text = (await res.text()) ?? "";

      if (!res.ok) {
        errorMsg = text || `HTTP ${res.status}`;
        console.error("[assistant] http error", res.status, text.slice(0, 200));
        return;
      }

      answer = text.trim();
      console.log("[assistant] answer len=", answer.length, "snippet:", answer.slice(0, 120));
    } catch (err) {
      console.error("[assistant] fetch error", err);
      errorMsg = (err as Error)?.message || String(err);
    } finally {
      loading = false;
    }
  }

  function fillExample() {
    trade = "HVAC";
    brandModel = "Daikin FTXM50";
    focus = "install";
    share = false;
    message =
      "Need the install clearances and breaker size for a wall-mount split AC in a double brick home. Point me to the pages if you can.";
  }

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(answer || "");
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {
      errorMsg = "Couldn’t copy to clipboard.";
    }
  }
</script>

<!-- Header -->
<header class="mb-6 max-w-4xl mx-auto px-4 space-y-3">
  <h1 class="text-3xl font-bold tracking-tight">Smart Assistant</h1>
  <p class="text-base leading-relaxed opacity-80 break-words">
    Fire off the curly install, compliance or fault-finding questions and the Assistant will pull answers from our stacked manuals
    library plus the latest regs. Need to sanity-check a job? Feed it the setup and it’ll keep you moving without the run-around.
  </p>
</header>

<form
  class="assistant-form card bg-base-100 border w-full max-w-4xl mx-auto shadow-sm"
  on:submit|preventDefault={onAsk}
>
  <div class="card-body space-y-8 p-5 sm:p-8">
    <div class="rounded-lg bg-base-200/70 p-4 text-sm leading-relaxed text-base-content/80 break-words">
      <p class="font-medium text-base-content">Add colour for sharper answers</p>
      <p class="mt-1">
        The more you tell us up front, the tighter the response. Pick your trade, name the brand or drop the standards if you can
        so the Assistant locks onto the right manual faster, but no stress&mdash;you can always type the details straight into your
        question.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <!-- Trade -->
      <div class="form-control gap-2">
        <label for="trade" class="label">
          <span class="label-text">Trade (optional)</span>
        </label>
        <select
          id="trade"
          name="trade"
          class="select select-bordered w-full"
          bind:value={trade}
        >
          <option value="">— Select trade (optional) —</option>
          {#each trades as t}
            <option value={t}>{t}</option>
          {/each}
        </select>
      </div>

      <!-- Brand / Model (single field) -->
      <div class="form-control gap-2">
        <label for="brandModel" class="label">
          <span class="label-text">Brand / Model or Standard (optional)</span>
        </label>
        <input
          id="brandModel"
          type="text"
          class="input input-bordered w-full"
          placeholder='e.g., "Mitsubishi Heavy SRK63" or "AS/NZS 3000"'
          bind:value={brandModel}
        />
        <p class="block text-sm opacity-70 leading-snug break-words">
          Useful when your question is appliance-specific or cites a standard/code.
        </p>
      </div>
    </div>

    <!-- Focus (optional hint) -->
    <div class="form-control max-w-md gap-2">
      <label for="focus" class="label">
        <span class="label-text">Focus (optional)</span>
      </label>
      <select
        id="focus"
        name="focus"
        class="select select-bordered w-full"
        bind:value={focus}
      >
        {#each focuses as f}
          <option value={f.value}>{f.label}</option>
        {/each}
      </select>
    </div>

    <!-- Files -->
    <div class="form-control gap-4 break-words">
      <label for="files" class="label items-start">
        <span class="label-text leading-snug">Bring your own docs (PDF, optional)</span>
      </label>

      <!-- Share with community consent -->
      <div class="space-y-4 rounded-md border border-base-200/70 bg-base-200/40 p-3">
        <div class="form-control">
          <label class="label cursor-pointer flex-wrap items-start gap-3">
            <input type="checkbox" name="share" value="yes" class="checkbox checkbox-sm mt-1" bind:checked={share} />
            <span class="label-text flex-1 text-base sm:text-sm leading-snug text-pretty break-words">
              Share this upload to help other tradies (no files with personal data).
            </span>
          </label>
          <p class="text-sm sm:text-xs opacity-70 leading-snug text-pretty break-words">
            If unticked, the file is used for this answer only and not added to the shared library.
          </p>
        </div>

        <input
          id="files"
          class="file-input file-input-bordered w-full max-w-2xl"
          type="file"
          multiple
          accept=".pdf,.txt,.md"
          on:change={handleFileChange}
        />
        <div class="text-xs sm:text-sm opacity-80 leading-relaxed space-y-2 break-words">
          <p>
            Only upload when you need something outside our shared library of thousands of manuals—it’s still gold if you’re chasing a specific clause or project doc.
          </p>
          <p>Max 4 MB per file.</p>
        </div>
      </div>
    </div>

    <!-- Question -->
    <div class="form-control gap-2">
      <label for="message" class="label">
        <span class="label-text">Question</span>
      </label>
      <textarea
        id="message"
        class="textarea textarea-bordered w-full min-h-[10rem] leading-relaxed"
        rows="4"
        placeholder="Walk through the job like you would on site: trade, equipment, site conditions, Aussie standards in play, what you’ve tried and the answer you’re chasing."
        bind:value={message}
      ></textarea>
    </div>

    <div class="flex flex-wrap items-center gap-3 sm:justify-end">
      <button
        type="button"
        class="btn btn-outline btn-sm"
        on:click={fillExample}
        disabled={loading}
        aria-label="Fill with an example question"
      >
        Example
      </button>
      <button type="submit" class="btn btn-primary" disabled={loading || !message.trim()}>
        {#if loading}
          <span class="loading loading-spinner loading-sm"></span>
          <span>Thinking…</span>
        {:else}
          Ask
        {/if}
      </button>
      <button
        type="button"
        class="btn btn-ghost"
        on:click={() => { message = ""; brandModel = ""; trade = ""; focus = "general"; files = []; answer = ""; errorMsg = ""; share = false; }}
        disabled={loading}
      >
        Reset
      </button>
    </div>

    <!-- Answer -->
    {#if loading}
      <div class="flex items-center gap-2 opacity-80">
        <span class="loading loading-spinner loading-sm"></span>
        Thinking…
      </div>
    {:else if errorMsg}
      <div class="alert alert-error whitespace-pre-wrap break-words">{errorMsg}</div>
    {:else if answer && answer.length > 0}
      <div class="flex items-center justify-end gap-2 mb-2">
        <button type="button" class="btn btn-outline btn-xs" on:click={copyAnswer} aria-label="Copy answer">
          {#if copied}Copied!{:else}Copy{/if}
        </button>
      </div>
      <RichAnswer text={answer} />
    {/if}
    <!-- /Answer -->
  </div>
</form>

<style>
  :global(.assistant-form .card-body) {
    overflow-wrap: anywhere;
  }

  :global(.assistant-form .file-input::file-selector-button) {
    font-size: inherit;
  }

  :global(.assistant-form .label),
  :global(.assistant-form .label-text),
  :global(.assistant-form .label-text-alt) {
    width: 100%;
  }
</style>
