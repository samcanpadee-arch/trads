<script lang="ts">
  let files: File[] = [];
  let uploading = false;
  let results: Array<{ name: string; file_id: string; action: string; attached_to: string[] }> = [];
  let errorMsg = "";

  function onPick(e: Event) {
    const input = e.target as HTMLInputElement;
    files = Array.from(input.files ?? []);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) {
      files = Array.from(e.dataTransfer.files);
    }
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  async function uploadAll(e: Event) {
    e.preventDefault();
    errorMsg = "";
    results = [];
    if (!files.length) return;
    uploading = true;
    try {
      const fd = new FormData();
      for (const f of files) fd.append("files", f);
      const r = await fetch("/api/library/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Upload failed");
      results = j.results || [];
    } catch (err: any) {
      errorMsg = err?.message || String(err);
    } finally {
      uploading = false;
    }
  }
</script>

<section class="flex flex-col gap-6">
  <header class="flex flex-col gap-1">
    <h1 class="text-2xl font-semibold">Library Uploader</h1>
    <p class="text-sm opacity-70">
      Add manuals, standards, and guides to your master library (deduplicated by content hash).
      Supported: PDF, TXT, MD.
    </p>
  </header>

  <form class="card bg-base-100 border" on:submit|preventDefault={uploadAll}>
    <div class="card-body space-y-4">
      <div class="form-control">
        <label class="label" for="lib-files"><span class="label-text font-medium">Select files</span></label>
        <input
          id="lib-files"
          class="file-input file-input-bordered w-full"
          type="file"
          multiple
          accept=".pdf,.txt,.md"
          on:change={onPick}
        >
      </div>

      <div
        class="rounded-lg border border-dashed p-6 text-center"
        on:drop={onDrop}
        on:dragover={onDragOver}
        aria-label="Drag and drop files here"
      >
        <p class="text-sm">Drag &amp; drop files here, or use the picker above.</p>
        {#if files.length}
          <p class="text-xs mt-2 opacity-70">{files.length} file{files.length > 1 ? 's' : ''} ready</p>
        {/if}
      </div>

      <div class="flex items-center gap-2">
        <button class="btn btn-primary" disabled={uploading || !files.length}>
          {#if uploading}Uploading…{/if}
          {#if !uploading}Upload to Library{/if}
        </button>
        <a href="/account/assistant" class="btn btn-ghost ml-auto">← Back</a>
      </div>

      {#if errorMsg}
        <div class="alert alert-error text-sm"><span>{errorMsg}</span></div>
      {/if}

      {#if results.length}
        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>File</th>
                <th>File ID</th>
                <th>Action</th>
                <th>Attached to Stores</th>
              </tr>
            </thead>
            <tbody>
              {#each results as r}
                <tr>
                  <td class="break-all">{r.name}</td>
                  <td class="break-all">{r.file_id}</td>
                  <td>{r.action}</td>
                  <td class="break-all">{r.attached_to?.join(", ")}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </form>
</section>
