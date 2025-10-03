<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";

  // form state
  let trade = "";
  let brandModel = "";         // single combined field (e.g., "Panasonic CS-Z50VKR" or "AS/NZS 3000")
  let focus = "general";       // optional hint (kept for compatibility)
  let files: File[] = [];
  let share = false;
  let message = "";

  // ui state
  let loading = false;
  let errorMsg = "";
  let answer = "";

  function handleFileChange(e: Event) {
    const el = e.target as HTMLInputElement;
    const list = Array.from(el.files ?? []);
    files = list;
  }

  async function onAsk(e?: Event) {
    e?.preventDefault?.();

    try {
      loading = true;
      errorMsg = "";
      answer = ""; // clear once at start

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
</script>

<!-- Header -->
<header class="mb-4">
  <h1 class="text-xl font-semibold">Assistant</h1>
  <p class="opacity-70 text-sm">Attach manuals or ask general questions. We’ll cite pages when using documents.</p>
</header>

<form class="card bg-base-100 border" on:submit|preventDefault={onAsk}>
  <div class="card-body space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Trade -->
      <div class="form-control">
        <label for="trade" class="label">
          <span class="label-text">Trade (optional)</span>
        </label>
        <select id="trade" class="select select-bordered w-full" bind:value={trade}>
          <option value="">— Select trade (optional) —</option>
          <option value="Electrical">Electrical</option>
          <option value="HVAC">HVAC</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Carpentry">Carpentry</option>
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
          class="input input-bordered w-full"
          placeholder='e.g., "Panasonic CS-Z50VKR" or "AS/NZS 3000"'
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
    <div class="form-control">
      <label for="focus" class="label">
        <span class="label-text">Focus (optional)</span>
      </label>
      <select id="focus" class="select select-bordered w-full max-w-md" bind:value={focus}>
        <option value="general">General</option>
        <option value="safety">Safety</option>
        <option value="specs">Specifications</option>
        <option value="compliance">Compliance</option>
      </select>
    </div>

    <!-- Files -->
    <div class="form-control">
      <label for="files" class="label">
        <span class="label-text">Attach manuals or notes (PDF/TXT)</span>
      </label>

      <!-- Share with community consent -->
      <div class="form-control mt-2">
        <label class="label cursor-pointer gap-2">
          <input type="checkbox" name="share" value="yes" class="checkbox checkbox-sm" bind:checked={share} />
          <span class="label-text text-sm">Share this upload to help other tradies (no personal data).</span>
        </label>
        <p class="text-xs opacity-70 mt-1">
          If unticked, the file is used for this answer only and not added to the shared library.
        </p>
      </div>

      <input
        id="files"
        class="file-input file-input-bordered w-full max-w-xl"
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
        class="textarea textarea-bordered w-full"
        rows="4"
        placeholder="Describe the issue or question. Include context like symptoms, environment, regulations, constraints, etc."
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
      <RichAnswer text={answer} />
      <details class="mt-2 opacity-70 text-xs">
        <summary>debug</summary>
        <pre class="whitespace-pre-wrap break-words">{answer.slice(0, 800)}</pre>
      </details>
    {/if}
    <!-- /Answer -->
  </div>
</form>
