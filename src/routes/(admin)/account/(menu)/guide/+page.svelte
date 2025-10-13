<script lang="ts">
  // --- NAV PILLS ---
  const sections = [
    { id: "quick-wins", label: "Quick Wins" },
    { id: "troubleshoot", label: "Troubleshoot" },
    { id: "safety-codes", label: "Safety & Codes" },
    { id: "comms", label: "Client Comms" },
    { id: "team", label: "Team & Training" },
    { id: "quote-support", label: "Quote Support (Words Only)" },
    { id: "tips", label: "Tips" }
  ];

  // --- PROMPT CHIP STATE ---
  let copiedKey: string | null = null;
  let copyTimer: any = null;
  function copyPrompt(key: string, text: string) {
    navigator.clipboard?.writeText(text);
    copiedKey = key;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copiedKey = null), 1500);
  }

  // helper for on:change nav on mobile
  function jumpTo(id: string) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Simple chip renderer data
  type Chip = { key: string; text: string };
  const quickWins = {
    calmCustomer: [
      { key: "calm-1", text: "Customer cranky about dust in hallway. Keep it calm, say we’ll clean today, offer small discount. Short text." },
      { key: "calm-2", text: "They say we were late. Apologise once, no excuses. Offer new time window. Keep it friendly." }
    ] as Chip[],
    safetyOnePager: [
      { key: "saf-1", text: "New labourer tomorrow. Simple safety checklist: PPE, ladders, lifting, site sign-in. One page." },
      { key: "saf-2", text: "Toolbox talk for Monday: wet weather hazards. Dot points only." }
    ] as Chip[],
    explainTech: [
      { key: "tech-1", text: "Explain 'provisional sum' in plain English for a quote email. Two lines max." },
      { key: "tech-2", text: "Why we’re using low-VOC paint. Two lines. Friendly tone." }
    ] as Chip[],
    ruleFast: [
      { key: "rule-1", text: "AS/NZS 3000 — what’s the rule for RCDs in a kitchen reno? Keep it short." },
      { key: "rule-2", text: "What clearance do I need in front of a domestic switchboard?" }
    ] as Chip[]
  };

  const hvacChips: Chip[] = [
    { key: "hvac-1", text: "Daikin split throwing F97. What do I check first? Keep it safe." },
    { key: "hvac-2", text: "Panasonic CS-Z50VKR wall bracket — what torque for M8 bolts?" },
    { key: "hvac-3", text: "Explain to a client why coil clean is needed. Two lines, plain English." }
  ];
  const plumbingChips: Chip[] = [
    { key: "plum-1", text: "Hot water unit tripping. Give me a safe order to test. Quick list." },
    { key: "plum-2", text: "Toilet fills slowly after flush. Likely causes? Give two first." },
    { key: "plum-3", text: "Text to customer: we need to replace isolating valve, small extra cost. Keep it polite." }
  ];
  const electricalChips: Chip[] = [
    { key: "elec-1", text: "3-phase continuity test — safe steps in order. Short." },
    { key: "elec-2", text: "Downlights with insulation — what does the standard say? Keep it simple." },
    { key: "elec-3", text: "How to tell client we need an extra RCD — plain English, two lines." }
  ];
  const paintingChips: Chip[] = [
    { key: "paint-1", text: "Wall is chalky. How do I prep so paint sticks? Steps only." },
    { key: "paint-2", text: "Exterior, windy day — spray or roll? Quick pros/cons." },
    { key: "paint-3", text: "Message to strata: we need scaffold for 2 days, why + access times." }
  ];

  const safetyChips: Chip[] = [
    { key: "sc-1", text: "AS/NZS 3000 — quick summary of the rule for switchboard clearances in a house." },
    { key: "sc-2", text: "From an SDS: what PPE for Sika 11FC? Short list." },
    { key: "sc-3", text: "I’m in VIC — what’s the basic rule on smoke alarms for a reno? Keep it simple." },
    { key: "sc-4", text: "Using the Rinnai B26 manual I uploaded, what’s the gas pressure range?" }
  ];

  const commsChips: Chip[] = [
    { key: "cc-1", text: "Running 20 mins late. Send a quick text that’s polite and honest." },
    { key: "cc-2", text: "We found rotten frame behind the shower — explain scope change, extra day, new cost, get OK." },
    { key: "cc-3", text: "Payment reminder for Invoice 1043, overdue a week. Friendly but firm." },
    { key: "cc-4", text: "Booking confirm for Friday 8–12 window. Ask about parking." },
    { key: "cc-5", text: "Leave-behind message after job: thanks + care tips + call us if issues." }
  ];

  const teamChips: Chip[] = [
    { key: "t-1", text: "Apprentice starts Monday. Simple checklist: PPE, sign-in, lifting, ladders, tidy site. One page." },
    { key: "t-2", text: "Write a short SMS to remind them: steel caps, hi-vis, water bottle." },
    { key: "t-3", text: "Pressure test a line — steps + pass/fail numbers. One page." },
    { key: "t-4", text: "Lock-out/tag-out basics for a small site. Short bullet list." }
  ];

  const quoteSupportChips: Chip[] = [
    { key: "qs-1", text: "Explain the difference between a quote and an estimate in plain English." },
    { key: "qs-2", text: "Two-line warranty note for a paint job (workmanship + manufacturer)." },
    { key: "qs-3", text: "Short list of assumptions I should include for a bathroom repaint." },
    { key: "qs-4", text: "Email to send with the attached quote: friendly tone, clear next steps." }
  ];
</script>

<div class="max-w-5xl mx-auto p-4 md:p-6">
  <!-- HERO -->
  <div class="mb-6 md:mb-8">
    <h1 class="text-2xl md:text-3xl font-semibold">Get Results Faster</h1>
    <p class="text-base-content/70 mt-2">
      Ask in normal words. Get a tight answer. Use <strong>Smart Chat</strong> for messages and how-tos, and <strong>Smart Assistant</strong> for standards, manuals, and technical checks.
      Smart Tools for pricing live at <a class="link" href="/account/caption">/account/caption</a>.
    </p>
    <div class="flex flex-wrap gap-2 mt-4">
      <a href="/account/chat" class="btn btn-primary">Open Smart Chat</a>
      <a href="/account/assistant" class="btn btn-secondary">Open Smart Assistant</a>
      <a href="/account/caption" class="btn btn-outline">Open Smart Tools</a>
    </div>
  </div>

  <!-- NAV PILLS -->
  <div class="flex flex-wrap gap-2 mb-4">
    {#each sections as s}
      <span
        class="badge badge-ghost cursor-pointer text-sm px-3 py-3 whitespace-nowrap"
        role="button"
        on:click={() => jumpTo(s.id)}
      >{s.label}</span>
    {/each}
  </div>

  <!-- QUICK WINS -->
  <section id="quick-wins" class="scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Quick Wins</h2>
        <p class="text-base-content/70">Copy a chip, paste it in the right tool, and go.</p>

        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <!-- Calm a cranky customer (Chat) -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <span class="badge badge-primary">Smart Chat</span>
                <h3 class="font-semibold">Calm a cranky customer</h3>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                {#each quickWins.calmCustomer as c}
                  <button
                    class="btn btn-xs normal-case rounded-full btn-outline"
                    on:click={() => copyPrompt(c.key, c.text)}
                  >
                    {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
                  </button>
                {/each}
              </div>
              <div class="grid md:grid-cols-2 gap-3 mt-4">
                <div class="card bg-base-200">
                  <div class="card-body p-3">
                    <div class="text-xs opacity-70 mb-1">Before</div>
                    <p class="text-sm">“We were late cause traffic. Sorry.”</p>
                  </div>
                </div>
                <div class="card bg-base-200">
                  <div class="card-body p-3">
                    <div class="text-xs opacity-70 mb-1">After</div>
                    <p class="text-sm">“Hey {`{name}`}, sorry we ran late earlier. We’ll clean up today and knock a bit off the bill to make it right.”</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Safety one-pager (Chat) -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <span class="badge badge-primary">Smart Chat</span>
                <h3 class="font-semibold">Safety one-pager for the boys</h3>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                {#each quickWins.safetyOnePager as c}
                  <button
                    class="btn btn-xs normal-case rounded-full btn-outline"
                    on:click={() => copyPrompt(c.key, c.text)}
                  >
                    {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <!-- Explain the tech (Chat) -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <span class="badge badge-primary">Smart Chat</span>
                <h3 class="font-semibold">Explain the tech to a client</h3>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                {#each quickWins.explainTech as c}
                  <button
                    class="btn btn-xs normal-case rounded-full btn-outline"
                    on:click={() => copyPrompt(c.key, c.text)}
                  >
                    {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <!-- Find the rule fast (Assistant) -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="flex items-center gap-2">
                <span class="badge badge-secondary">Smart Assistant</span>
                <h3 class="font-semibold">Find the rule fast</h3>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                {#each quickWins.ruleFast as c}
                  <button
                    class="btn btn-xs normal-case rounded-full btn-outline"
                    on:click={() => copyPrompt(c.key, c.text)}
                  >
                    {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
                  </button>
                {/each}
              </div>
              <p class="text-xs opacity-70 mt-2">Assistant uses a shared AU/NZ library. Uploads are optional.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TROUBLESHOOT -->
  <section id="troubleshoot" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Troubleshoot</h2>
        <p class="text-base-content/70">Ask like you talk. Assistant can answer without uploads; attach a PDF if you want it tied to your exact manual.</p>

        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <!-- HVAC -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="flex items-center gap-2 mb-1">
                <span class="badge badge-secondary">Smart Assistant</span>
                <h3 class="font-semibold">HVAC</h3>
              </div>
              <div class="flex flex-wrap gap-2">
                {#each hvacChips as c}
                  <button
                    class="btn btn-xs normal-case rounded-full btn-ghost"
                    on:click={() => copyPrompt(c.key, c.text)}
                  >
                    {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
                  </button>
                {/each}
              </div>
              <div class="card bg-base-200 mt-3">
                <div class="card-body p-3 text-sm">
                  <span class="opacity-70 text-xs">Example output</span>
                  <ul class="list-disc ml-5">
                    <li>Isolate power. Check filters/coil blockage.</li>
                    <li>Confirm fan spins freely; listen for bearing noise.</li>
                    <li>Check outdoor airflow + clearances.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Plumbing -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="flex items-center gap-2 mb-1">
                <span class="badge badge-secondary">Smart Assistant</span>
                <h3 class="font-semibold">Plumbing</h3>
              </div>
              <div class="flex flex-wrap gap-2">
                {#each plumbingChips as c}
                  <button
                    class="btn btn-xs normal-case rounded-full btn-ghost"
                    on:click={() => copyPrompt(c.key, c.text)}
                  >
                    {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
                  </button>
                {/each}
              </div>
              <div class="card bg-base-200 mt-3">
                <div class="card-body p-3 text-sm">
                  <span class="opacity-70 text-xs">Example output</span>
                  <ul class="list-disc ml-5">
                    <li>Turn off power/gas. Check PRV + valve operation.</li>
                    <li>Test element/thermostat with a meter.</li>
                    <li>Document readings before replacing parts.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Electrical -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="flex items-center gap-2 mb-1">
                <span class="badge badge-secondary">Smart Assistant</span>
                <h3 class="font-semibold">Electrical</h3>
              </div>
              <div class="flex flex-wrap gap-2">
                {#each electricalChips as c}
                  <button
                    class="btn btn-xs normal-case rounded-full btn-ghost"
                    on:click={() => copyPrompt(c.key, c.text)}
                  >
                    {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
                  </button>
                {/each}
              </div>
              <div class="card bg-base-200 mt-3">
                <div class="card-body p-3 text-sm">
                  <span class="opacity-70 text-xs">Example output</span>
                  <ul class="list-disc ml-5">
                    <li>Isolate. Lock out. Verify no power.</li>
                    <li>Test continuity phase-to-phase, then to earth.</li>
                    <li>Record values; re-energise only after pass.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Painting -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="flex items-center gap-2 mb-1">
                <span class="badge badge-secondary">Smart Assistant</span>
                <h3 class="font-semibold">Painting</h3>
              </div>
              <div class="flex flex-wrap gap-2">
                {#each paintingChips as c}
                  <button
                    class="btn btn-xs normal-case rounded-full btn-ghost"
                    on:click={() => copyPrompt(c.key, c.text)}
                  >
                    {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
                  </button>
                {/each}
              </div>
              <div class="card bg-base-200 mt-3">
                <div class="card-body p-3 text-sm">
                  <span class="opacity-70 text-xs">Example output</span>
                  <ul class="list-disc ml-5">
                    <li>Scrub, rinse, allow to dry; apply sealer for chalky surfaces.</li>
                    <li>Mask properly; avoid spray in high wind.</li>
                    <li>Explain scaffold need to strata for safety/compliance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  <!-- SAFETY & CODES -->
  <section id="safety-codes" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Safety & Codes</h2>
        <p class="text-base-content/70">
          Use <strong>Smart Assistant</strong> for standards, manuals, SDS and install guides. It can answer from our shared AU/NZ library. Uploads are optional—use them if you want answers tied to your exact document.
        </p>

        <div class="flex flex-wrap gap-2 mt-3">
          {#each safetyChips as c}
            <button
              class="btn btn-xs normal-case rounded-full btn-outline"
              on:click={() => copyPrompt(c.key, c.text)}
            >
              {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
            </button>
          {/each}
        </div>

        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="card bg-base-200">
            <div class="card-body p-3">
              <div class="text-xs opacity-70 mb-1">When to upload</div>
              <ul class="list-disc ml-5 text-sm">
                <li>Exact model or brand requirements.</li>
                <li>Site-specific instructions you want referenced.</li>
                <li>Older manuals that differ from current ones.</li>
              </ul>
            </div>
          </div>
          <div class="card bg-base-200">
            <div class="card-body p-3">
              <div class="text-xs opacity-70 mb-1">What to expect</div>
              <ul class="list-disc ml-5 text-sm">
                <li>Referenced sources where possible (page numbers may not always show).</li>
                <li>Short summary first; ask for more detail if you need it.</li>
                <li>Confirm critical safety steps before starting work.</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <a href="/account/assistant" class="btn btn-secondary">Open Smart Assistant</a>
        </div>
      </div>
    </div>
  </section>

  <!-- CLIENT COMMS -->
  <section id="comms" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Client Comms (everyday words)</h2>
        <p class="text-base-content/70">Use <strong>Smart Chat</strong> for quick, clear messages, checklists, and explainers.</p>

        <div class="flex flex-wrap gap-2 mt-3">
          {#each commsChips as c}
            <button
              class="btn btn-xs normal-case rounded-full btn-outline"
              on:click={() => copyPrompt(c.key, c.text)}
            >
              {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
            </button>
          {/each}
        </div>

        <div class="grid md:grid-cols-2 gap-3 mt-4">
          <div class="card bg-base-200"><div class="card-body p-3">
            <div class="text-xs opacity-70 mb-1">Before</div>
            <p class="text-sm">“Invoice overdue. Pay now.”</p>
          </div></div>
          <div class="card bg-base-200"><div class="card-body p-3">
            <div class="text-xs opacity-70 mb-1">After</div>
            <p class="text-sm">“Hi {`{name}`}, quick reminder about Invoice #1043 from last week. Can you sort it today? Sing out if you need anything.”</p>
          </div></div>
        </div>

        <div class="mt-4">
          <a href="/account/chat" class="btn btn-primary">Open Smart Chat</a>
        </div>
      </div>
    </div>
  </section>

  <!-- TEAM & TRAINING -->
  <section id="team" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Team & Training</h2>
        <p class="text-base-content/70">Keep it simple and printable. Smart Chat can generate one-pagers and SMS reminders.</p>

        <div class="flex flex-wrap gap-2 mt-3">
          {#each teamChips as c}
            <button
              class="btn btn-xs normal-case rounded-full btn-outline"
              on:click={() => copyPrompt(c.key, c.text)}
            >
              {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- QUOTE SUPPORT (WORDS ONLY) -->
  <section id="quote-support" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Quote Support (words only)</h2>
        <p class="text-base-content/70">
          This is wording help only — <strong>no pricing</strong>. For numbers, use Smart Tools at <a class="link" href="/account/caption">/account/caption</a>.
        </p>

        <div class="flex flex-wrap gap-2 mt-3">
          {#each quoteSupportChips as c}
            <button
              class="btn btn-xs normal-case rounded-full btn-outline"
              on:click={() => copyPrompt(c.key, c.text)}
            >
              {#if copiedKey === c.key}✓ Copied{:else}Copy prompt{/if}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- TIPS -->
  <section id="tips" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Tips that actually help</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <ul class="list-disc ml-5 text-sm">
              <li>Say the format you want: “text message,” “two lines,” “bullet list.”</li>
              <li>Add details that matter: suburb, size, model/standard, time window.</li>
              <li>One job per prompt. Ask again for a different thing.</li>
            </ul>
          </div>
          <div>
            <ul class="list-disc ml-5 text-sm">
              <li><strong>Chat</strong> = messages, lists, advice.</li>
              <li><strong>Assistant</strong> = standards, manuals, SDS, install guides.</li>
              <li>If it’s too long: say “shorter.” If too formal: say “more casual.”</li>
            </ul>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-4">
          <a href="/account/chat" class="btn btn-primary">Open Smart Chat</a>
          <a href="/account/assistant" class="btn btn-secondary">Open Smart Assistant</a>
          <a href="/account/caption" class="btn btn-outline">Open Smart Tools</a>
        </div>
      </div>
    </div>
  </section>

  <!-- MOBILE NAV SELECT -->
  <div class="md:hidden mt-8">
    <label class="form-control w-full">
      <div class="label"><span class="label-text">Jump to section</span></div>
      <select class="select select-bordered" on:change={(e: any) => jumpTo(e.target.value)}>
        <option value="">Choose…</option>
        {#each sections as s}<option value={s.id}>{s.label}</option>{/each}
      </select>
    </label>
  </div>
</div>
