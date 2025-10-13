<script lang="ts">
  // minimal JS: anchor jump only
  const sections = [
    { id: "quick-jobs", label: "Quick Jobs" },
    { id: "client-comms", label: "Client Comms" },
    { id: "safety-codes", label: "Safety & Codes" },
    { id: "troubleshoot", label: "Troubleshoot" },
    { id: "team-training", label: "Team & Training" },
    { id: "quote-pipeline", label: "Quote Pipeline" },
    { id: "smart-tools", label: "Smart Tools" },
    { id: "how-to-ask", label: "How to Ask (Chat)" }
  ];
  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
</script>

<div class="max-w-6xl mx-auto p-4 md:p-6">
  <!-- HERO -->
  <header class="mb-6 md:mb-8">
    <h1 class="text-2xl md:text-3xl font-semibold">How to Get Stuff Done (Fast)</h1>
    <p class="text-base-content/70 mt-2">
      Price jobs, talk to clients, and find answers — fast.
    </p>

    <!-- Product tiles -->
    <div class="grid md:grid-cols-3 gap-4 mt-4">
      <!-- Chat -->
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h2 class="card-title">Smart Chat</h2>
          <p class="text-sm text-base-content/70">Texts & emails · Checklists · Explain to clients</p>
          <div class="mt-3">
            <a href="/account/chat" class="btn btn-primary w-full">Open Smart Chat</a>
          </div>
        </div>
      </div>
      <!-- Assistant -->
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h2 class="card-title">Smart Assistant</h2>
          <p class="text-sm text-base-content/70">Standards · Manuals · SDS / Specs</p>
          <div class="mt-3">
            <a href="/account/assistant" class="btn btn-secondary w-full">Open Smart Assistant</a>
          </div>
        </div>
      </div>
      <!-- Tools -->
      <div class="card bg-base-100 border">
        <div class="card-body">
          <h2 class="card-title">Smart Tools</h2>
          <p class="text-sm text-base-content/70">Costing · Quotes · Proposals · Reviews · Social · Email</p>
          <div class="mt-3">
            <a href="/account/caption" class="btn btn-outline w-full">Open Smart Tools</a>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Sticky pill nav -->
  <nav class="sticky top-2 z-10 bg-base-100/80 backdrop-blur border rounded-xl p-2 mb-4 overflow-x-auto">
    <div class="flex gap-2">
      {#each sections as s}
        <button class="badge badge-ghost px-3 py-3 whitespace-nowrap" on:click={() => jumpTo(s.id)}>
          {s.label}
        </button>
      {/each}
    </div>
  </nav>

  <!-- QUICK JOBS -->
  <section id="quick-jobs" class="scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <h2 class="card-title">Quick Jobs</h2>
          <span class="badge">Pick one and go</span>
        </div>
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <!-- Calm a customer -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="text-xs opacity-70">Best with Chat</div>
              <h3 class="font-semibold">Calm a customer</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“We’re running 20 minutes late—can you draft a quick text?”</li>
                <li>“Customer upset about dust—write a message to fix it.”</li>
              </ul>
              <a href="/account/chat" class="link mt-2">Open Chat</a>
            </div>
          </div>
          <!-- Explain a quote bit -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="text-xs opacity-70">Best with Chat</div>
              <h3 class="font-semibold">Explain a quote bit</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“How do I explain provisional sum to the client?”</li>
                <li>“Write a note for the email about using low-VOC paint.”</li>
              </ul>
              <a href="/account/chat" class="link mt-2">Open Chat</a>
            </div>
          </div>
          <!-- Find the rule -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="text-xs opacity-70">Best with Assistant</div>
              <h3 class="font-semibold">Find the rule</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“What clearance is needed in front of a domestic switchboard?”</li>
                <li>“Do I need RCDs in a kitchen renovation?”</li>
              </ul>
              <a href="/account/assistant" class="link mt-2">Open Assistant</a>
            </div>
          </div>
          <!-- Book & confirm -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="text-xs opacity-70">Best with Chat</div>
              <h3 class="font-semibold">Book & confirm</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“Write a booking confirmation for Friday 8–12 and ask about parking.”</li>
              </ul>
              <a href="/account/chat" class="link mt-2">Open Chat</a>
            </div>
          </div>
          <!-- Scope change -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="text-xs opacity-70">Best with Chat</div>
              <h3 class="font-semibold">Scope change</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“We found rotten framing behind the shower—write a clear scope change message.”</li>
              </ul>
              <a href="/account/chat" class="link mt-2">Open Chat</a>
            </div>
          </div>
          <!-- Troubleshoot now -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <div class="text-xs opacity-70">Best with Assistant</div>
              <h3 class="font-semibold">Troubleshoot now</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“Daikin split shows F97—what should I check first?”</li>
              </ul>
              <a href="/account/assistant" class="link mt-2">Open Assistant</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CLIENT COMMS -->
  <section id="client-comms" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Client Comms (Chat)</h2>
        <div class="grid md:grid-cols-2 gap-4 mt-2">
          <!-- Mini SMS-style cards -->
          <div class="card bg-base-200">
            <div class="card-body p-4">
              <div class="text-xs opacity-70 mb-1">Question</div>
              <div class="text-sm">“We’re running 20 minutes late—can you draft a quick text?”</div>
              <div class="divider my-3"></div>
              <div class="text-xs opacity-70 mb-1">Sample message</div>
              <div class="text-sm">Hi {`{name}`}, sorry for the delay earlier. We’re on our way and should arrive around {`{time}`}. Thanks for your patience.</div>
            </div>
          </div>

          <div class="card bg-base-200">
            <div class="card-body p-4">
              <div class="text-xs opacity-70 mb-1">Question</div>
              <div class="text-sm">“Can you write a booking confirmation for Friday 8–12 and ask about parking?”</div>
              <div class="divider my-3"></div>
              <div class="text-xs opacity-70 mb-1">Sample message</div>
              <div class="text-sm">Hi {`{name}`}, we’ve booked you for Friday between 8–12. Is there parking or a driveway we can use? We’ll call when we’re close.</div>
            </div>
          </div>

          <div class="card bg-base-200">
            <div class="card-body p-4">
              <div class="text-xs opacity-70 mb-1">Question</div>
              <div class="text-sm">“Can you write a payment reminder for Invoice 1043?”</div>
              <div class="divider my-3"></div>
              <div class="text-xs opacity-70 mb-1">Sample message</div>
              <div class="text-sm">Hi {`{name}`}, a quick reminder about Invoice #1043. Could you settle it today? Let me know if you need any details.</div>
            </div>
          </div>

          <div class="card bg-base-200">
            <div class="card-body p-4">
              <div class="text-xs opacity-70 mb-1">Question</div>
              <div class="text-sm">“We found rotten framing behind the shower—can you write a clear scope change message?”</div>
              <div class="divider my-3"></div>
              <div class="text-xs opacity-70 mb-1">Sample message</div>
              <div class="text-sm">Hi {`{name}`}, we’ve found rotten framing behind the shower. We’ll need an extra day to fix it and there’ll be an additional cost. Are you okay for us to proceed?</div>
            </div>
          </div>
        </div>
        <div class="mt-4"><a href="/account/chat" class="btn btn-primary">Open Smart Chat</a></div>
      </div>
    </div>
  </section>

  <!-- SAFETY & CODES -->
  <section id="safety-codes" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Safety & Codes (Assistant)</h2>
        <div class="grid md:grid-cols-3 gap-4 mt-2">
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Standards quick checks</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“What does AS/NZS 3000 say about downlights with insulation?”</li>
                <li>“What are the switchboard clearance rules for a house?”</li>
              </ul>
              <p class="text-xs opacity-70 mt-2">You get a short summary with references where possible.</p>
            </div>
          </div>
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">SDS / PPE lookups</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“What PPE do I need for Sika 11FC?”</li>
              </ul>
            </div>
          </div>
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Install / spec questions</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“What’s the gas pressure range for Rinnai B26?”</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="alert mt-4">
          <span>Assistant can answer without uploads. Upload PDF/TXT (≤4MB) only if you want your exact manual used. We reference sources where possible.</span>
        </div>
        <div class="mt-4"><a href="/account/assistant" class="btn btn-secondary">Open Smart Assistant</a></div>
      </div>
    </div>
  </section>

  <!-- TROUBLESHOOT -->
  <section id="troubleshoot" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Troubleshoot (Assistant)</h2>
        <div class="grid md:grid-cols-2 gap-4 mt-2">
          <!-- HVAC -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">HVAC</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“Daikin F97—what should I check first?”</li>
                <li>“Panasonic CS-Z50VKR bracket torque for M8?”</li>
              </ul>
              <div class="text-xs opacity-70 mt-2">Good looks like: isolate power · airflow checks · fan/bearing check</div>
            </div>
          </div>
          <!-- Plumbing -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Plumbing</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“Hot water unit tripping—safe order of tests?”</li>
                <li>“Toilet refills slowly—likely causes?”</li>
              </ul>
              <div class="text-xs opacity-70 mt-2">Good looks like: PRV/valve checks · element/thermostat tests · document readings</div>
            </div>
          </div>
          <!-- Electrical -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Electrical</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“How do I do a safe continuity test on a 3-phase circuit?”</li>
                <li>“Do I need an extra RCD for this job?”</li>
              </ul>
              <div class="text-xs opacity-70 mt-2">Good looks like: isolate/lock-out · test sequence · re-energise after pass</div>
            </div>
          </div>
          <!-- Painting -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Painting</h3>
              <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
                <li>“Wall is chalky—how do I prep so paint sticks?”</li>
                <li>“Windy day—spray or roll?”</li>
              </ul>
              <div class="text-xs opacity-70 mt-2">Good looks like: clean/seal · masking/wind considerations · safe access</div>
            </div>
          </div>
        </div>
        <div class="mt-4"><a href="/account/assistant" class="btn btn-secondary">Open Smart Assistant</a></div>
      </div>
    </div>
  </section>

  <!-- TEAM & TRAINING -->
  <section id="team-training" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Team & Training (Chat)</h2>
        <div class="grid md:grid-cols-2 gap-4 mt-2">
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Apprentice start checklist</h3>
              <p class="text-sm">“Can you make a simple safety checklist for a new apprentice?”</p>
            </div>
          </div>
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">SOP: pressure test one-pager</h3>
              <p class="text-sm">“Can you write steps and pass/fail numbers for a pressure test?”</p>
            </div>
          </div>
        </div>
        <div class="mt-4"><a href="/account/chat" class="btn btn-primary">Open Smart Chat</a></div>
      </div>
    </div>
  </section>

  <!-- QUOTE PIPELINE -->
  <section id="quote-pipeline" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Quote Pipeline</h2>
        <p class="text-base-content/70">Numbers belong to Smart Tools. Chat helps with wording.</p>
        <ul class="steps steps-vertical md:steps-horizontal mt-3">
          <li class="step step-primary">
            Costing — use Material & Cost Calculator (<a href="/account/caption" class="link">/account/caption</a>)
          </li>
          <li class="step step-primary">
            Quote wording — “Can you turn this costing into a clear quote with assumptions and exclusions?”
          </li>
          <li class="step step-primary">
            Proposal — use Sales Proposal (Smart Tools)
          </li>
          <li class="step step-primary">
            Send email — Email Template (Smart Tools) or ask Chat
          </li>
          <li class="step step-primary">
            Follow-up — “Can you write a friendly follow-up for a quote sent three days ago?”
          </li>
        </ul>
        <div class="mt-4"><a href="/account/caption" class="btn btn-outline">Open Smart Tools</a></div>
      </div>
    </div>
  </section>

  <!-- SMART TOOLS GRID -->
  <section id="smart-tools" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Smart Tools (6 helpers)</h2>
        <div class="grid md:grid-cols-3 gap-4 mt-2">
          <!-- Each card points to /account/caption -->
          <div class="card bg-base-100 border"><div class="card-body">
            <h3 class="font-semibold">Material & Cost Calculator</h3>
            <p class="text-sm text-base-content/70">Price jobs fast; materials, labour, markup sorted.</p>
            <ul class="list-disc ml-5 text-sm mt-2">
              <li>Enter quantities & unit costs</li>
              <li>Set labour rate & time</li>
            </ul>
            <a href="/account/caption" class="link mt-2">Open</a>
          </div></div>

          <div class="card bg-base-100 border"><div class="card-body">
            <h3 class="font-semibold">Job Estimation Wizard</h3>
            <p class="text-sm text-base-content/70">Turns a brief (+ costs) into a tidy quote.</p>
            <ul class="list-disc ml-5 text-sm mt-2">
              <li>Describe the job</li>
              <li>Paste Costing Summary (optional)</li>
            </ul>
            <a href="/account/caption" class="link mt-2">Open</a>
          </div></div>

          <div class="card bg-base-100 border"><div class="card-body">
            <h3 class="font-semibold">Sales Proposal Generator</h3>
            <p class="text-sm text-base-content/70">Polish your quote into a persuasive proposal.</p>
            <ul class="list-disc ml-5 text-sm mt-2">
              <li>Benefits & timeline</li>
              <li>Why choose us</li>
            </ul>
            <a href="/account/caption" class="link mt-2">Open</a>
          </div></div>

          <div class="card bg-base-100 border"><div class="card-body">
            <h3 class="font-semibold">Review Responder</h3>
            <p class="text-sm text-base-content/70">Reply to good/bad reviews — on brand.</p>
            <ul class="list-disc ml-5 text-sm mt-2">
              <li>Paste the review</li>
              <li>Pick a tone</li>
            </ul>
            <a href="/account/caption" class="link mt-2">Open</a>
          </div></div>

          <div class="card bg-base-100 border"><div class="card-body">
            <h3 class="font-semibold">Social Post Generator</h3>
            <p class="text-sm text-base-content/70">Short posts for FB/IG; Aussie voice, soft CTA.</p>
            <ul class="list-disc ml-5 text-sm mt-2">
              <li>Job type & suburb</li>
              <li>Tip or seasonal angle</li>
            </ul>
            <a href="/account/caption" class="link mt-2">Open</a>
          </div></div>

          <div class="card bg-base-100 border"><div class="card-body">
            <h3 class="font-semibold">Email Template Generator</h3>
            <p class="text-sm text-base-content/70">Turn a summary into a tidy client email.</p>
            <ul class="list-disc ml-5 text-sm mt-2">
              <li>What happened</li>
              <li>What you need them to do</li>
            </ul>
            <a href="/account/caption" class="link mt-2">Open</a>
          </div></div>
        </div>
        <div class="mt-4"><a href="/account/caption" class="btn btn-outline">Open Smart Tools</a></div>
      </div>
    </div>
  </section>

  <!-- HOW TO ASK -->
  <section id="how-to-ask" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">How to Ask (Chat)</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold mb-2">Patterns</h3>
            <ul class="list-disc ml-5 text-sm space-y-1">
              <li>Say the job and the goal.</li>
              <li>Add the key details (who, where, when, model/standard).</li>
              <li>Ask for the format (text message, email, checklist).</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-2">Examples</h3>
            <ul class="list-disc ml-5 text-sm space-y-1">
              <li>“Can you write a text to confirm Friday 8–12 and ask if there’s parking?”</li>
              <li>“Can you make a simple checklist for a plumbing apprentice starting Monday?”</li>
              <li>“Can you help explain a provisional sum for the quote email?”</li>
            </ul>
          </div>
        </div>
        <div class="mt-4"><a href="/account/chat" class="btn btn-primary">Open Smart Chat</a></div>
      </div>
    </div>
  </section>
</div>
