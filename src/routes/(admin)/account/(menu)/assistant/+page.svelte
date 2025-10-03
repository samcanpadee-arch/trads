<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  let trade = ""
  let brandModel = "" // single combined field (e.g., "Panasonic CS-Z50VKR" or "AS/NZS 3000")
  let focus = "general" // optional hint only (we'll inject into message text)
  let message = ""
  let files: File[] = []

  let answer = ""
  let loading = false
  let errorMsg = ""

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
    "Other",
  ]

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement | null;
  const maxSize = 4 * 1024 * 1024; // 4 MB
  const allFiles = Array.from(input?.files ?? []);
  const oversized = allFiles.find((f) => f.size > maxSize);

  if (oversized) {
    alert(`File "${oversized.name}" is too large. Max size is 4 MB.`);
  }

  // `files` is your existing component state array
  files = allFiles.filter((f) => f.size <= maxSize);
}


  const focuses = [
    { value: "general", label: "General help" },
    { value: "diagnosis", label: "Diagnosis & fault codes" },
    { value: "install", label: "Installation & commissioning" },
    { value: "compliance", label: "Compliance, standards & codes" },
    { value: "maintenance", label: "Maintenance & servicing" },
    { value: "specs", label: "Parts & specifications" },
  ]

  function fillExample() {
    trade = "HVAC"
    brandModel = "Panasonic CS-Z50VKR"
    focus = "diagnosis"
    message = `Indoor unit shows blinking POWER/TIMER LEDs intermittently during heating.
Explain what each indicator means on VKR series and when blinking is normal (e.g., defrost, preheat).
Include how to retrieve error codes from the remote and any safety notes.`
    files = [] // leave file uploads empty; user can still attach a manual if they want
    answer = ""
    errorMsg = ""
  }

  async function onAsk(e: SubmitEvent) {
    e.preventDefault()
    const formEl = e.currentTarget as HTMLFormElement
    // Build FormData **from the form** so all inputs (incl. checkbox) are captured
    const fd = new FormData(formEl)

    // If you’re tracking files in a `files` array (not relying on the <input>’s name),
    // ensure they’re appended too:
    if (files && files.length && !fd.has("files")) {
      for (const f of files) fd.append("files", f)
    }

    // Extra safety: if the checkbox is checked but (for any reason) didn’t serialize,
    // add it explicitly:
    const shareEl = formEl.querySelector(
      'input[name="share"]',
    ) as HTMLInputElement | null
    if (shareEl && shareEl.checked && !fd.has("share")) {
      fd.append("share", "yes")
    }

    try {
      loading = true
      errorMsg = ""
      answer = ""

      const res = await fetch("/api/assistant", { method: "POST", body: fd })
      const text = await res.text()

      if (!res.ok) {
        errorMsg = text || "Something went wrong"
        return
      }

      answer = text
    } catch (err: any) {
      errorMsg = err?.message ?? String(err)
    } finally {
      loading = false
    }
  }
  $: if (typeof answer !== "undefined") console.log("[assistant] answer len=", (answer||"").length, "snippet:", (answer||"").slice(0,200));
  $: if (typeof errorMsg !== "undefined" && errorMsg) console.warn("[assistant] error:", errorMsg);
  $: if (typeof answer !== "undefined") console.log("[assistant] answer len=", (answer||"").length, "snippet:", (answer||"").slice(0,200));
  $: if (typeof errorMsg !== "undefined" && errorMsg) console.warn("[assistant] error:", errorMsg);
</script>

<header class="mb-6 flex items-start justify-between gap-4">
  <div class="flex-1">
    <h1 class="text-2xl font-semibold">AI Assistant</h1>
    <p class="text-sm opacity-70 mt-1">
      Ask technical, trade-level questions. We tap into a growing library of
      manuals, guides, standards and codes — and you can also attach your own
      PDFs or notes. We’ll combine that with AI to give you precise, cited
      answers, so you don’t have to dig through documents yourself.
    </p>
  </div>
  <a href="/account/caption" class="btn btn-ghost">← Back</a>
</header>

<form class="card bg-base-100 border" on:submit|preventDefault={onAsk}>
  <div class="card-body space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Trade -->
      <div class="form-control">
        <label for="trade" class="label">
          <span class="label-text">Trade (optional)</span>
        </label>
        <select
          id="trade" name="trade"
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
      <div class="form-control">
        <label for="brandModel" class="label">
          <span class="label-text">Brand / Model or Standard (optional)</span>
        </label>
        <input
          id="brandModel" name="brand"
          type="text"
          class="input input-bordered w-full"
          placeholder='e.g., "Panasonic CS-Z50VKR" or "AS/NZS 3000"'
          bind:value={brandModel}
        />
        <label class="label">
          <span class="label-text-alt opacity-70">
            Useful when your question is appliance-specific or cites a
            standard/code.
          </span>
        </label>
      </div>
    </div>

    <!-- Focus (optional hint) -->
    <div class="form-control">
      <label for="focus" class="label">
        <span class="label-text">Focus (optional)</span>
      </label>
      <select
        id="focus" name="focus"
        class="select select-bordered w-full max-w-md"
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
        <span class="label-text">Attach manuals or notes (PDF/TXT)</span>
      </label>

      <input
        id="files" name="files"
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

      <!-- Share with community consent -->
      <div class="form-control mt-2">
        <label class="label cursor-pointer gap-2">
          <input
            type="checkbox"
            name="share"
            value="yes"
            class="checkbox checkbox-sm"
          />
          <span class="label-text text-sm"
            >Share this upload to help other tradies (no personal data).</span
          >
        </label>
        <p class="text-xs opacity-70 mt-1">
          If unticked, the file is used for this answer only and not added to
          the shared library.
        </p>
      </div>
    </div>

    <!-- Question -->
    <div class="form-control">
      <label for="message" class="label">
        <span class="label-text">Question</span>
      </label>
      <textarea
        id="message" name="message"
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
      <button
        type="submit"
        class="btn btn-primary"
        disabled={loading || !message.trim()}
      >
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
        on:click={() => {
          message = ""
          brandModel = ""
          trade = ""
          focus = "general"
          files = []
          answer = ""
          errorMsg = ""
        }}
        disabled={loading}
      >
        Reset
      </button>
    </div>
  </div>
</form>

{#if errorMsg}
  <div class="alert alert-error mt-4">
    <span>{errorMsg}</span>
  </div>
{/if}

{#if answer}
  <div class="card bg-base-100 border mt-4">
    <div class="card-body">
      <h2 class="card-title text-base">Answer</h2>
      <pre class="whitespace-pre-wrap text-sm leading-relaxed"><RichAnswer content={answer} /></pre>
    </div>
  </div>
{/if}
