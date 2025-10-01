<script lang="ts">
  import { askWithAllSources } from "./_three_source";
  let trade = "";
  let brandModel = ""; // single combined field (e.g., "Panasonic CS-Z50VKR" or "AS/NZS 3000")
  let focus = "general"; // optional hint only (we'll inject into message text)
  let message = "";
  let files: File[] = [];

  let answer = "";
  let loading = false;
  let errorMsg = "";

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

  function fillExample() {
    trade = "HVAC";
    brandModel = "Panasonic CS-Z50VKR";
    focus = "diagnosis";
    message =
`Indoor unit shows blinking POWER/TIMER LEDs intermittently during heating.
Explain what each indicator means on VKR series and when blinking is normal (e.g., defrost, preheat).
Include how to retrieve error codes from the remote and any safety notes.`;
    files = []; // leave file uploads empty; user can still attach a manual if they want
    answer = "";
    errorMsg = "";
  }

  async function onAsk(e: Event) {
    e.preventDefault();
    answer = "";
    errorMsg = "";
    loading = true;

    try {
      // Build the outgoing question, optionally prefix with focus for better retrieval.
      const msgParts = [];
      if (focus && focus !== "general") {
        msgParts.push(`Focus: ${focus}`);
      }
      msgParts.push(message.trim());
      const outgoing = msgParts.join("\n");

      const fd = new FormData();
      fd.append("message", outgoing);
      fd.append("trade", trade || "");
      // Backend expects 'brand' and 'model'. We'll send the combined text as 'brand' and leave 'model' blank.
      fd.append("brand", brandModel || "");
      fd.append("model", "");

      for (const f of files) fd.append("files", f, f.name);

      const resp = await fetch("/api/assistant", {
        method: "POST",
        body: fd
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Assistant error");
      }

      const text = await resp.text();
      answer = text;
    } catch (err: any) {
      errorMsg = err?.message ?? String(err);
    } finally {
      loading = false;
    }
  }
</script>

<header class="mb-6 flex items-start justify-between gap-4">
  <div class="flex-1">
    <h1 class="text-2xl font-semibold">AI Assistant</h1>
    <p class="text-sm opacity-70 mt-1">
      Ask technical, trade-level questions. We tap into a growing library of
      manuals, guides, standards and codes — and you can also attach your own PDFs or notes.
      We’ll combine that with AI to give you precise, cited answers, so you don’t have to
      dig through documents yourself.
    </p>
  </div>
  <a href="/account/caption" class="btn btn-ghost">← Back</a>
</header>

<form class="card bg-base-100 border" onsubmit={onAsk}>
  <div class="card-body space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Trade -->
      <div class="form-control">
        <label for="trade" class="label">
          <span class="label-text">Trade (optional)</span>
        </label>
        <select id="trade" class="select select-bordered w-full" bind:value={trade}>
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
        id="files"
        class="file-input file-input-bordered w-full max-w-xl"
        type="file"
        multiple
        accept=".pdf,.txt,.md"
        onchange={(e) => (files = Array.from((e.target as HTMLInputElement).files ?? []))}
      />
      <label class="label">
        <span class="label-text-alt opacity-70">
          We’ll reference your files and cite them inline where relevant.
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
        onclick={fillExample}
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
        onclick={() => { message = ""; brandModel = ""; trade = ""; focus = "general"; files = []; answer = ""; errorMsg = ""; }}
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
      <pre class="whitespace-pre-wrap text-sm leading-relaxed">{answer}</pre>
    </div>
  </div>
{/if}

<!-- === Added: secondary ask button that uses uploaded + library + general === -->
<div class="mt-4 flex flex-wrap gap-2">
  <button
    class="btn btn-secondary"
    onclick={async () => {
      try {
        // Map these to your existing variables.
        // If your page uses different names, adjust below:
        const _prompt = typeof prompt !== 'undefined' ? prompt : '';
        const _trade  = typeof trade  !== 'undefined' ? trade  : '';
        const _brand  = typeof brand  !== 'undefined' ? brand  : '';
        const _files  = typeof files  !== 'undefined' ? files  : [];
        const _share  = typeof allowShare !== 'undefined' ? allowShare : false;

        const { text } = await askWithAllSources({
          prompt: _prompt,
          trade: _trade,
          brand: _brand,
          files: _files,
          allowShare: _share
        });

        // Write into your existing answer binding if present
        if (typeof answer !== 'undefined') {
          answer = text || '(no text output)';
        } else {
          // fallback: simple alert (shouldn’t be needed)
          alert(text || '(no text output)');
        }
      } catch (err) {
        console.error(err);
        alert((err as Error)?.message || 'Query failed');
      }
    }}
  >
    Ask — use uploaded + library
  </button>
</div>
<!-- === /Added === -->
