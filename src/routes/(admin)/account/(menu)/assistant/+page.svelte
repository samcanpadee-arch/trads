<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";

  // --- selectable lists (restored & expanded) ---
  const trades = [
  "Electrical","Plumbing","HVAC","General Construction","Carpentry",
  "Roofing","Tiling","Painting","Landscaping","Other"
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
    message = "What clearances and breaker size are required for a wall-mount split AC? Include page references.";
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
<header class="mb-6 space-y-2 max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold tracking-tight">Smart Assistant</h1>
  <p class="text-base opacity-80">
    Ask the tradie-trained AI anything about installs, servicing, wiring rules or product quirks and get clear answers fast. Toss in manuals, notes or site details and we’ll point you to the right page when we can.
  </p>
</header>

<form class="card bg-base-100 border w-full max-w-4xl mx-auto" on:submit|preventDefault={onAsk}>
  <div class="card-body space-y-6">
    <div class="rounded-lg bg-base-200/70 p-4 text-sm text-base-content/80">
      <p class="font-medium text-base-content">Add colour for sharper answers</p>
      <p>
        Fill in the optional fields if you can&mdash;things like the trade, brand or standards help the Assistant zoom in quicker. If you just drop the details in your question, that still works a treat.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <!-- Trade -->
      <div class="form-control">
        <label for="trade" class="label">
          <span class="label-text">Trade (optional)</span>
        </label>
        <select
          id="trade"
          name="trade"
          class="select select-bordered w-full text-base"
          bind:value={trade}
        >
          <option value="">— Select trade (optional) —</option>
          {#each trades as t}
            <option value={t}>{t}</option>
          {/each}
        </select>
      </div>

      <!-- Brand / Model (single field) -->
      <div class="form-control">
        <label for="brandModel" class="label">
          <span class="label-text">Brand / Model or Standard (optional)</span>
        </label>
        <input
          id="brandModel"
          type="text"
          class="input input-bordered w-full text-base"
          placeholder='e.g., "Mitsubishi Heavy SRK63" or "AS/NZS 3000"'
          bind:value={brandModel}
        />
        <label class="label">
          <span class="label-text-alt opacity-70">
            Useful when your question is appliance-specific or cites a standard/code.
          </span>
        </label>
      </div>
    </div>

    <!-- Focus (optional hint) -->
    <div class="form-control max-w-md">
      <label for="focus" class="label">
        <span class="label-text">Focus (optional)</span>
      </label>
      <select
        id="focus"
        name="focus"
        class="select select-bordered w-full text-base"
        bind:value={focus}
      >
        {#each focuses as f}
          <option value={f.value}>{f.label}</option>
        {/each}
      </select>
    </div>

    <!-- Files -->
    <div class="form-control">
      <label for="files" class="label">
        <span class="label-text">Attach manuals or notes (PDF)</span>
      </label>

      <!-- Share with community consent -->
      <div class="form-control mt-2">
        <label class="label cursor-pointer gap-2">
          <input type="checkbox" name="share" value="yes" class="checkbox checkbox-sm" bind:checked={share} />
          <span class="label-text text-sm">Share this upload to help other tradies (no files with personal data).</span>
        </label>
        <p class="text-xs opacity-70 mt-1">
          If unticked, the file is used for this answer only and not added to the shared library.
        </p>
      </div>

      <input
        id="files"
        class="file-input file-input-bordered w-full max-w-2xl text-base"
        type="file"
        multiple
        accept=".pdf,.txt,.md"
        on:change={handleFileChange}
      />
      <label class="label">
        <span class="label-text-alt opacity-70">
          Max 4 MB per file. We’ll reference your files and cite them where relevant.
        </span>
      </label>
    </div>

    <!-- Question -->
    <div class="form-control">
      <label for="message" class="label">
        <span class="label-text">Question</span>
      </label>
      <textarea
        id="message"
        class="textarea textarea-bordered w-full text-base"
        rows="4"
        placeholder="Explain the job or fault. Include the symptoms, site setup, standards you’re following and anything you’ve already tried."
        bind:value={message}
      ></textarea>
    </div>

    <div class="flex items-center justify-end gap-2">
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
