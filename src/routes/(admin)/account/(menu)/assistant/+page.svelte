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

  type FileStatus = {
    id: string;
    name: string;
    size: number;
    status: "ready" | "uploading" | "uploaded" | "error";
  };

  let fileInput: HTMLInputElement | null = null;
  let files: File[] = [];
  let fileStatuses: FileStatus[] = [];
  let share = false;
  let message = "";

  type ShareFeedback = {
    name: string;
    status: "attached" | "already" | "failed";
    message?: string;
  };

  let shareActivity: ShareFeedback[] = [];

  // --- ui state ---
  let loading = false;
  let isUploadingFiles = false;
  let totalUploadProgress = 0;
  let errorMsg = "";
  let answer = "";
  let copied = false;

  const statusMessages: Record<FileStatus["status"], string> = {
    ready: "Ready to upload",
    uploading: "Uploading…",
    uploaded: "Uploaded",
    error: "Upload failed"
  };

  function statusBadgeClass(status: FileStatus["status"]) {
    switch (status) {
      case "uploaded":
        return "badge-success";
      case "uploading":
        return "badge-primary";
      case "error":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  }

  const shareStatusCopy: Record<ShareFeedback["status"], string> = {
    attached: "Shared to the community library",
    already: "Already available in the shared library",
    failed: "Could not share this upload"
  };

  function shareStatusBadgeClass(status: ShareFeedback["status"]) {
    switch (status) {
      case "attached":
        return "badge-success";
      case "already":
        return "badge-info";
      case "failed":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  }

  function formatFileSize(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    const fixed = value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1);
    return `${fixed} ${units[unitIndex]}`;
  }

  function toPercent(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value * 100)));
  }

  function handleFileChange(e: Event) {
    const el = e.target as HTMLInputElement;
    const selected = Array.from(el.files ?? []);
    files = selected;

    if (!selected.length) {
      fileStatuses = [];
      totalUploadProgress = 0;
      isUploadingFiles = false;
      return;
    }

    fileStatuses = selected.map((file, idx) => ({
      id: `${file.name}-${file.size}-${file.lastModified ?? idx}-${idx}`,
      name: file.name,
      size: file.size,
      status: "ready"
    }));
    totalUploadProgress = 0;
    isUploadingFiles = false;
  }

  async function onAsk(e?: Event) {
    e?.preventDefault?.();

    try {
      loading = true;
      errorMsg = "";
      answer = "";
      shareActivity = [];

      const fd = new FormData();
      fd.set("message", (typeof message === "string" ? message : "").trim());
      if (trade) fd.set("trade", trade);
      if (brandModel) fd.set("brand", brandModel);
      if (share) fd.set("share", "yes");
      for (const f of files) fd.append("files", f);

      const activeFiles = files.slice();
      if (fileStatuses.length) {
        isUploadingFiles = true;
        totalUploadProgress = 0;
        fileStatuses = fileStatuses.map((fs) => ({ ...fs, status: "uploading" }));
      }

      const text = await new Promise<{ raw: any; text: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/assistant");
        xhr.responseType = "json";

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            if (xhr.response && typeof xhr.response === "object") {
              resolve({ raw: xhr.response, text: "" });
            } else {
              resolve({ raw: xhr.responseText ?? "", text: String(xhr.responseText ?? "") });
            }
          } else {
            const body =
              typeof xhr.response === "object" && xhr.response !== null
                ? xhr.response
                : xhr.responseText;
            if (body && typeof body === "object" && "error" in body) {
              reject(new Error(String((body as { error: string }).error)));
            } else {
              reject(new Error(typeof body === "string" && body.length ? body : `HTTP ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));

        if (activeFiles.length) {
          const totalBytes = activeFiles.reduce((sum, file) => sum + file.size, 0);
          xhr.upload.onprogress = (event) => {
            const denom = event.lengthComputable && event.total > 0 ? event.total : totalBytes;
            if (denom > 0) {
              totalUploadProgress = Math.min(1, event.loaded / denom);
            }
          };
        }

        xhr.send(fd);
      });

      if (fileStatuses.length) {
        totalUploadProgress = 1;
        fileStatuses = fileStatuses.map((fs) => ({ ...fs, status: "uploaded" }));
      }

      let payload = text.raw;
      if (!payload || typeof payload !== "object") {
        try {
          payload = JSON.parse(typeof text.raw === "string" ? text.raw : text.text ?? "");
        } catch {
          payload = null;
        }
      }

      const derivedAnswer =
        payload && typeof payload === "object" && typeof payload.answer === "string"
          ? payload.answer
          : typeof text.text === "string"
            ? text.text
            : "";

      answer = (derivedAnswer || "").trim();

      if (payload && typeof payload === "object" && Array.isArray(payload.shareActivity)) {
        shareActivity = payload.shareActivity
          .map((item: any) => ({
            name: typeof item?.name === "string" ? item.name : "Unknown upload",
            status:
              item?.status === "attached" || item?.status === "already" || item?.status === "failed"
                ? item.status
                : "failed",
            message: typeof item?.message === "string" ? item.message : undefined
          }))
          .filter((entry) => entry.name);
      }

      console.log("[assistant] answer len=", answer.length, "snippet:", answer.slice(0, 120));
    } catch (err) {
      console.error("[assistant] fetch error", err);
      errorMsg = (err as Error)?.message || String(err);
      if (fileStatuses.length) {
        fileStatuses = fileStatuses.map((fs) =>
          fs.status === "uploading" ? { ...fs, status: "error" } : fs
        );
      }
    } finally {
      loading = false;
      isUploadingFiles = false;
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
            <input
              type="checkbox"
              name="share"
              value="yes"
              class="checkbox mt-1 sm:checkbox-sm"
              bind:checked={share}
            />
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
          bind:this={fileInput}
          on:change={handleFileChange}
          disabled={loading}
        />
        {#if fileStatuses.length}
          <div class="space-y-3">
            {#if isUploadingFiles}
              <div class="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <progress
                  class="progress progress-primary flex-1 min-w-[8rem]"
                  value={toPercent(totalUploadProgress)}
                  max="100"
                  aria-label="Upload progress"
                ></progress>
                <span class="tabular-nums text-xs sm:text-sm">{toPercent(totalUploadProgress)}%</span>
              </div>
            {:else if fileStatuses.some((fs) => fs.status === "error")}
              <div class="text-xs font-medium text-error">Some files failed to upload.</div>
            {/if}
            <ul class="space-y-2">
              {#each fileStatuses as fileStatus (fileStatus.id)}
                <li class="rounded-md border border-base-200 bg-base-200/30 p-3 space-y-2">
                  <div class="flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
                    <span class="break-words">{fileStatus.name}</span>
                    <span class="opacity-70">{formatFileSize(fileStatus.size)}</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 text-xs sm:text-[0.8rem]">
                    <span class={`badge badge-sm ${statusBadgeClass(fileStatus.status)}`}>
                      {statusMessages[fileStatus.status]}
                    </span>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
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
        class="btn btn-outline w-full sm:w-auto sm:btn-sm"
        on:click={fillExample}
        disabled={loading}
        aria-label="Fill with an example question"
      >
        Example
      </button>
      <button type="submit" class="btn btn-primary w-full sm:w-auto" disabled={loading || !message.trim()}>
        {#if loading}
          <span class="loading loading-spinner loading-sm"></span>
          <span>Thinking…</span>
        {:else}
          Ask
        {/if}
      </button>
      <button
        type="button"
        class="btn btn-ghost w-full sm:w-auto"
        on:click={() => {
          message = "";
          brandModel = "";
          trade = "";
          focus = "general";
          if (fileInput) {
            fileInput.value = "";
          }
          files = [];
          fileStatuses = [];
          totalUploadProgress = 0;
          isUploadingFiles = false;
          answer = "";
          errorMsg = "";
          share = false;
          shareActivity = [];
        }}
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
      {#if shareActivity.length}
        <div class="alert alert-info flex flex-col gap-2 whitespace-pre-wrap break-words text-sm">
          <span class="font-semibold">Library sharing summary</span>
          <ul class="space-y-1">
            {#each shareActivity as activity, idx (activity.name + idx)}
              <li class="flex flex-wrap items-start gap-2">
                <span class={`badge badge-sm ${shareStatusBadgeClass(activity.status)}`}>
                  {shareStatusCopy[activity.status]}
                </span>
                <span class="font-medium">{activity.name}</span>
                {#if activity.status === "failed" && activity.message}
                  <span class="opacity-70">({activity.message})</span>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      <div class="flex flex-wrap items-center justify-end gap-2 mb-2">
        <button
          type="button"
          class="btn btn-outline w-full sm:w-auto sm:btn-xs"
          on:click={copyAnswer}
          aria-label="Copy answer"
        >
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
