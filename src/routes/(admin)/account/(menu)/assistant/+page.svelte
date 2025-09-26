<script lang="ts">
  let message = "";
  let trade = "";
  let brand = "";
  let model = "";
  let files: File[] = [];
  let answer = "";
  let loading = false;
  let errorMsg = "";

  function onFilesChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input?.files) {
      files = Array.from(input.files);
    }
  }

  async function ask(e: Event) {
    e.preventDefault();
    errorMsg = "";
    answer = "";
    loading = true;

    const fd = new FormData();
    fd.set("message", message);
    if (trade) fd.set("trade", trade);
    if (brand) fd.set("brand", brand);
    if (model) fd.set("model", model);
    for (const f of files) fd.append("files", f, f.name);

    try {
      const res = await fetch("/api/assistant", { method: "POST", body: fd });
      if (!res.ok) {
        errorMsg = await res.text();
      } else {
        answer = await res.text();
      }
    } catch (err: any) {
      errorMsg = err?.message || "Network error";
    } finally {
      loading = false;
    }
  }

  function useExample() {
    message = "Panasonic CS-Z50VKR showing U13. Diagnosis and fix?";
    trade = "HVAC";
    brand = "Panasonic";
    model = "CS-Z50VKR";
  }
</script>

<svelte:head><title>AI Assistant (Pro Preview)</title></svelte:head>

<section class="flex flex-col gap-6">
  <header class="flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-semibold">AI Assistant (Pro Preview)</h1>
      <p class="text-sm opacity-80">
        Ask technical, brand/model-specific questions and attach manuals or notes (PDF/TXT).
        We’ll answer **only** from the uploaded context and cite sources like [1], [2].
      </p>
    </div>
    <a href="/account" class="btn btn-ghost">← Back</a>
  </header>

  <form class="card bg-base-100 border border-base-300 p-6 space-y-6" on:submit={ask}>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <label class="form-control" for="q">
          <span class="label-text">Your question</span>
          <textarea id="q" class="textarea textarea-bordered h-32" bind:value={message} placeholder="Describe the issue or ask a technical question..."></textarea>
        </label>

        <label class="form-control" for="files">
          <span class="label-text">Attach manuals or notes (PDF/TXT)</span>
          <input id="files" type="file" class="file-input file-input-bordered w-full"
            multiple accept=".pdf,.txt,.md,text/plain,application/pdf" on:change={onFilesChange} />
          {#if files.length}
          <div class="mt-2 text-xs opacity-70">
            {files.length} file{files.length === 1 ? "" : "s"} selected
          </div>
          {/if}
        </label>
      </div>

      <div class="space-y-4">
        <label class="form-control" for="trade">
          <span class="label-text">Trade (optional)</span>
          <select id="trade" class="select select-bordered" bind:value={trade}>
            <option value="">—</option>
            <option>Electrical</option>
            <option>Plumbing</option>
            <option>HVAC</option>
            <option>Carpentry</option>
            <option>General Construction</option>
          </select>
        </label>

        <label class="form-control" for="brand">
          <span class="label-text">Brand (optional)</span>
          <input id="brand" class="input input-bordered" bind:value={brand} placeholder="e.g. Daikin, Panasonic" />
        </label>

        <label class="form-control" for="model">
          <span class="label-text">Model (optional)</span>
          <input id="model" class="input input-bordered" bind:value={model} placeholder="e.g. FTXS50L, CS-Z50VKR" />
        </label>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button type="submit" class="btn btn-primary" disabled={loading}>
        {#if loading}<span class="loading loading-dots"></span>{/if}
        <span>Ask</span>
      </button>
      <button type="button" class="btn" on:click={useExample}>Use example</button>
    </div>

    <div class="alert alert-info">
      <span>Prototype note:</span>
      <span class="ml-2">Files are processed only for this question and not stored. We’ll add persistent storage later.</span>
    </div>
  </form>

  {#if errorMsg}
  <div class="alert alert-error"><span>{errorMsg}</span></div>
  {/if}

  {#if answer}
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body prose max-w-none">
      <h2 class="card-title text-base">Answer</h2>
      <pre class="whitespace-pre-wrap text-sm">{answer}</pre>
    </div>
  </div>
  {/if}
</section>
