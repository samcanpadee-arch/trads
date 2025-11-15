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

  type TradePlaybook = {
    trade: string;
    title: string;
    summary: string;
    prompt: string;
    ctas?: Array<{ label: string; href: string }>;
  };

  const tradePlaybooks: TradePlaybook[] = [
    {
      trade: "Electrical",
      title: "Quote follow-up that wins the work",
      summary:
        "Polish the technical guts of a switchboard upgrade quote, then turn it into a friendly SMS + email follow-up.",
      prompt:
        "I’m an electrician quoting a switchboard upgrade with RCBOs in an older brick home. Draft the quote summary, list the safety upgrades in bullet points, and give me a follow-up SMS that nudges the client to approve it this week.",
      ctas: [{ label: "Open proposal tool", href: "/account/tools/proposal" }]
    },
    {
      trade: "Plumbing",
      title: "Maintenance contract play",
      summary:
        "Frame recurring drain maintenance as a value-add with ROI talking points and a tidy attachment for strata.",
      prompt:
        "I’m a plumber pitching a quarterly drain maintenance plan for a 12-unit block. Outline the inclusions, pricing options, and a short paragraph I can paste into a proposal explaining why preventative jetting saves money.",
      ctas: [{ label: "Material & cost calc", href: "/account/tools/material-cost" }]
    },
    {
      trade: "HVAC",
      title: "Commissioning checklist & client summary",
      summary:
        "Use the library to double-check clearances, then send the client a commissioning note with warranty reminders.",
      prompt:
        "I’ve just installed a Daikin multi split (4 heads) in a two-storey townhouse. Give me the commissioning checklist with AS/NZS references plus a client-facing summary that covers maintenance and warranty steps.",
      ctas: [{ label: "Email templates", href: "/account/tools/email-template" }]
    },
    {
      trade: "Landscaping",
      title: "Variation & upsell helper",
      summary:
        "Capture the extra scope (decks, lighting, planting) and translate it into a variation email with clear next steps.",
      prompt:
        "I’m mid-way through a landscaping project and the client wants to add a spotted-gum deck extension plus garden lighting. Draft the variation summary with new costs, a timeline adjustment, and an upsell paragraph for maintenance visits.",
      ctas: [{ label: "Job estimation", href: "/account/tools/job-estimation" }]
    }
  ];

  type LibraryShortcut = {
    title: string;
    description: string;
    prompt: string;
    link: { label: string; href: string };
  };

  const libraryShortcuts: LibraryShortcut[] = [
    {
      title: "Win more maintenance contracts",
      description: "Bundle Smart Assistant briefs with proposal + email templates.",
      prompt:
        "Create a short plan that shows the ROI of quarterly HVAC maintenance for a medical clinic. Include key checks, pricing ranges, and a paragraph I can drop into a proposal.",
      link: { label: "Proposal workflow", href: "/account/tools/proposal" }
    },
    {
      title: "Upsell EV chargers",
      description: "Answer safety questions, then jump straight into Smart Tools.",
      prompt:
        "Give me the key standards and homeowner talking points when upselling a single-phase EV charger install in Victoria. Include clearance reminders and inspection steps.",
      link: { label: "Quote builder", href: "/account/tools/material-cost" }
    },
    {
      title: "Close variations without fuss",
      description: "Summaries + email copy ready to paste.",
      prompt:
        "Summarise a variation for a bathroom reno where the client added underfloor heating and premium tapware. Include bulletproof reasons for the price increase and a polite approval request.",
      link: { label: "Email helper", href: "/account/tools/email-template" }
    },
    {
      title: "Prep insurance-ready job notes",
      description: "Use manual citations, then export to Smart Tools.",
      prompt:
        "I’m documenting storm damage to a colorbond roof for an insurance report. Draft the job notes with photos to capture, temporary works completed, and references to QBCC guidance.",
      link: { label: "Job estimation", href: "/account/tools/job-estimation" }
    }
  ];

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

      const text = await new Promise<{ raw: unknown; text: string }>((resolve, reject) => {
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
          .map((item: { name?: unknown; status?: unknown; message?: unknown }) => ({
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

  function usePromptText(text: string) {
    message = text;
  }
</script>

<svelte:head>
  <title>Smart Assistant</title>
</svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Manuals & knowledge</p>
    <h1 class="mt-2 text-3xl font-bold leading-tight text-gray-900">Smart Assistant</h1>
    <p class="mt-3 max-w-3xl text-base text-gray-700">
      Ask the curly install, compliance, or troubleshooting questions and the Assistant will cite the Tradie Library’s manuals,
      standards, and guides so you can make the call on site. Add files only when you need something outside the shared library.
    </p>
  </header>

  <div class="grid gap-4 lg:grid-cols-2">
    <div class="rounded-3xl border border-amber-100 bg-white/90 p-5 shadow-sm">
      <div class="flex flex-wrap items-center gap-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Trade playbooks</p>
        <p class="text-sm text-gray-600">Drop in a proven brief to keep the convo moving.</p>
      </div>
      <div class="mt-4 space-y-3">
        {#each tradePlaybooks as playbook}
          <article class="rounded-2xl border border-white/60 bg-gradient-to-br from-white via-amber-50/60 to-white p-4">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-amber-600">{playbook.trade}</p>
            <h3 class="text-base font-semibold text-gray-900">{playbook.title}</h3>
            <p class="mt-1 text-sm text-gray-600">{playbook.summary}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                class="btn btn-primary btn-xs"
                on:click={() => usePromptText(playbook.prompt)}
              >
                Use playbook
              </button>
              {#if playbook.ctas?.length}
                {#each playbook.ctas as cta}
                  <a class="btn btn-ghost btn-xs" href={cta.href}>{cta.label}</a>
                {/each}
              {/if}
            </div>
          </article>
        {/each}
      </div>
    </div>

    <div class="rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-sm">
      <div class="flex flex-wrap items-center gap-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-700">Outcome shortcuts</p>
        <p class="text-sm text-gray-600">Start with the goal, then open the right tool.</p>
      </div>
      <div class="mt-4 space-y-3">
        {#each libraryShortcuts as shortcut}
          <article class="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
            <h3 class="text-base font-semibold text-gray-900">{shortcut.title}</h3>
            <p class="mt-1 text-sm text-gray-600">{shortcut.description}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                class="btn btn-outline btn-xs"
                on:click={() => usePromptText(shortcut.prompt)}
              >
                Ask this
              </button>
              <a class="btn btn-ghost btn-xs" href={shortcut.link.href}>{shortcut.link.label}</a>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
    <form
      class="assistant-form rounded-3xl border border-gray-200 bg-white/95 shadow-sm"
      on:submit|preventDefault={onAsk}
    >
      <div class="space-y-8 p-5 sm:p-8">
        <div class="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-sm leading-relaxed text-amber-900/90">
          <p class="font-semibold text-amber-900">Dial in the context</p>
          <p class="mt-1">
            Trade, brand, model, or relevant standard help the Assistant zero in on the right section of the library. Keep it in
            your own words&mdash;we’ll still pull the regs behind the scenes.
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
    <div class="form-control gap-3 break-words">
      <details class="collapse collapse-arrow rounded-2xl border border-gray-200 bg-gray-50/70">
        <summary class="collapse-title cursor-pointer space-y-1 text-base font-medium leading-tight">
          <span>Bring your own docs (PDF, optional)</span>
          <span class="text-sm font-normal opacity-70">
            Add a supporting PDF only when you're chasing a clause or project doc outside the shared library.
          </span>
        </summary>
        <div class="collapse-content space-y-4">
          <label for="files" class="label items-start gap-2">
            <div>
              <span class="label-text leading-snug">Attach supporting PDFs (optional)</span>
              <p class="mt-1 text-sm sm:text-xs opacity-70 leading-snug">
                Skip this unless you're referencing a doc outside the Tradie Library. Max 4&nbsp;MB each.
              </p>
            </div>
          </label>

          <div class="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
            <div class="form-control">
            <label class="label cursor-pointer flex-wrap items-start gap-3 text-sm sm:text-xs">
              <input
                type="checkbox"
                name="share"
                value="yes"
                class="checkbox mt-1 sm:checkbox-sm"
                bind:checked={share}
              />
              <span class="label-text flex-1 leading-snug text-pretty">
                Share this upload to help other tradies (no files with personal data).
              </span>
            </label>
            <p class="text-xs opacity-70 leading-snug text-pretty">
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
        </div>
      </details>
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

    <!-- Answer -->
        {#if loading}
          <div class="flex items-center gap-2 opacity-80">
        <span class="loading loading-spinner loading-sm"></span>
        Thinking…
      </div>
        {:else if errorMsg}
          <div class="alert alert-error whitespace-pre-wrap break-words">{errorMsg}</div>
        {:else if answer && answer.length > 0}
          <div class="mb-2 flex flex-wrap items-center justify-end gap-2">
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

    <aside class="space-y-4">
      <div class="rounded-3xl border border-white/60 bg-gradient-to-br from-white/90 via-amber-50/60 to-rose-50/60 p-5 shadow-sm backdrop-blur">
        <p class="text-sm font-semibold text-gray-900">What you get</p>
        <ul class="mt-2 space-y-2 text-sm text-gray-700">
          <li>• Answers quote manuals, standards, or job guides so you can cite the source.</li>
          <li>• Perfect for “show me the clause” or “what’s the clearance” moments on site.</li>
          <li>• Summaries stay in the thread so you can copy and drop into notes later.</li>
        </ul>
      </div>
      <div class="rounded-3xl border border-gray-200 bg-white/80 p-5 shadow-sm">
        <p class="text-sm font-semibold text-gray-900">Need inspo?</p>
        <p class="mt-1 text-sm text-gray-600">Try:
          <em>“Show me the AS/NZS clause for bonding a pool pump enclosure and what to check before inspection.”</em>
        </p>
        <button type="button" class="btn btn-outline btn-sm mt-4" on:click={fillExample}>Fill with an example</button>
      </div>
    </aside>
  </div>
</section>

<style>
  :global(.assistant-form) {
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
