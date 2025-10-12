<script lang="ts">
  // Simple section index for mobile jump menu
  const sections = [
    { id: "smart-tools", label: "Smart Tools" },
    { id: "smart-chat", label: "Smart Chat" },
    { id: "smart-assistant", label: "Smart Assistant" },
    { id: "tips", label: "Tips & Prompts" },
    { id: "faq", label: "Troubleshooting & FAQ" },
  ];
</script>

<div class="max-w-5xl mx-auto p-4 md:p-6">
  <!-- Hero -->
  <div class="mb-6 md:mb-8">
    <h1 class="text-2xl md:text-3xl font-semibold">Getting the Most Out of Trads</h1>
    <p class="text-base-content/70 mt-2">
      Three smart helpers built for Aussie tradies — price jobs, talk to clients, and find answers faster.
      This guide shows what each one does and how to get the best results.
    </p>
    <div class="flex flex-wrap gap-2 mt-4">
      <a href="/account/chat" class="btn btn-primary">Open Smart Chat</a>
      <a href="/account/assistant" class="btn btn-secondary">Open Smart Assistant</a>
      <a href="/account/tools" class="btn">Open Smart Tools</a>
    </div>
  </div>

  <!-- Mobile TOC -->
  <div class="md:hidden mb-4">
    <label class="form-control w-full">
      <div class="label"><span class="label-text">Jump to section</span></div>
      <select class="select select-bordered"
        on:change={(e:any)=>{ const id = e.target.value; id && document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); }}>
        <option value="">Choose…</option>
        {#each sections as s}<option value={s.id}>{s.label}</option>{/each}
      </select>
    </label>
  </div>

  <!-- Desktop TOC -->
  <div class="hidden md:flex gap-2 flex-wrap mb-4">
    {#each sections as s}
      <a href={"#"+s.id} class="btn btn-sm">{s.label}</a>
    {/each}
  </div>

  <!-- Smart Tools (free) -->
  <section id="smart-tools" class="scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Smart Tools (Free)</h2>
        <p class="text-base-content/70">
          Six handy tools to help you price jobs, polish quotes, and handle client comms — no fancy setup needed.
          Quick wins to save time on paperwork.
        </p>

        <div class="grid md:grid-cols-3 gap-4 mt-4">
          <!-- Material & Cost Calculator -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Material &amp; Cost Calculator</h3>
              <p class="text-sm text-base-content/70">
                Price jobs in minutes — materials, labour &amp; markup sorted.
              </p>
              <ul class="list-disc ml-5 text-sm mt-2">
                <li>Enter quantities, rates, and markup.</li>
                <li>Generate a clean <em>Costing Summary</em> to paste into quotes.</li>
              </ul>
              <p class="text-sm mt-2"><span class="opacity-70">Example:</span> “10m² plasterboard, 4L paint, 2 days labour @ $80/h.”</p>
            </div>
          </div>

          <!-- Job Estimation Wizard -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Job Estimation Wizard</h3>
              <p class="text-sm text-base-content/70">
                Turn a short brief (and optional Costing Summary) into a client-ready quote.
              </p>
              <ul class="list-disc ml-5 text-sm mt-2">
                <li>Outputs: Overview, Scope, Assumptions, Exclusions, Cost Summary.</li>
              </ul>
            </div>
          </div>

          <!-- Comms Generators -->
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Communication Helpers</h3>
              <p class="text-sm text-base-content/70">
                Proposals, Review replies, Emails, and Social posts — tidy and on-brand.
              </p>
              <ul class="list-disc ml-5 text-sm mt-2">
                <li><strong>Sales Proposal</strong> — persuasive proposals from your quote.</li>
                <li><strong>Review Responder</strong> — reply to Google/Facebook reviews.</li>
                <li><strong>Email &amp; Social</strong> — short, clear client comms.</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <a href="/account/tools" class="btn">Open Smart Tools</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Smart Chat -->
  <section id="smart-chat" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Smart Chat</h2>
        <p class="text-base-content/70">
          Ask anything, anytime. Advice, checklists, tips — all in your Aussie voice. No file uploads here.
        </p>

        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">How it works</h3>
              <ul class="list-disc ml-5 text-sm">
                <li>Open <strong>Smart Chat</strong> and type your question.</li>
                <li>Choose a <strong>Model</strong>:
                  <ul class="list-disc ml-5 mt-1">
                    <li><strong>Fast</strong> — quickest replies for short answers.</li>
                    <li><strong>Better</strong> — slower, more detailed and complete.</li>
                  </ul>
                </li>
                <li>Press <kbd>Enter</kbd> or <kbd>Ctrl/Cmd</kbd>+<kbd>Enter</kbd> to send.</li>
              </ul>
            </div>
          </div>

          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">What to ask</h3>
              <ul class="list-disc ml-5 text-sm">
                <li>“Safety induction checklist for a new apprentice.”</li>
                <li>“Client says wall is damp behind vanity — likely causes?”</li>
                <li>“Polite wording for an invoice follow-up.”</li>
                <li>“Marketing ideas for winter gutter cleaning in Melbourne.”</li>
                <li>“How to explain prep &amp; patching to a client in plain English.”</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Pro tips</h3>
              <ul class="list-disc ml-5 text-sm">
                <li>Be specific: job type, suburb, materials, timeframes.</li>
                <li>Add your tone: “friendly but professional”, “short and clear”.</li>
                <li>One goal per message (e.g., a checklist <em>or</em> a client SMS).</li>
                <li>Use follow-ups — it remembers the chat context.</li>
              </ul>
            </div>
          </div>

          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Good to know</h3>
              <ul class="list-disc ml-5 text-sm">
                <li>No file uploads here — use <strong>Smart Assistant</strong> for manuals/codes.</li>
                <li>It won’t quote exact prices — use <strong>Smart Tools</strong> for costing.</li>
                <li>For anything technical or standards-based, jump to Assistant.</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <a href="/account/chat" class="btn btn-primary">Open Smart Chat</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Smart Assistant -->
  <section id="smart-assistant" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Smart Assistant</h2>
        <p class="text-base-content/70">
          Your on-site brain — thousands of AU/NZ codes, manufacturer manuals, spec sheets, install guides, SDS, textbooks — plus your PDFs.
          Upload a manual, ask a question, and we’ll cite the page we used.
        </p>

        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Fields &amp; options</h3>
              <ul class="list-disc ml-5 text-sm">
                <li><strong>Trade (optional)</strong> — pick your trade for better context.</li>
                <li><strong>Brand / Model or Standard</strong> — e.g., “Panasonic CS-Z50VKR” or “AS/NZS 3000”.</li>
                <li><strong>Focus</strong> — <em>General help</em> or <em>Attach manuals/notes</em>.</li>
                <li><strong>Upload PDF/TXT</strong> — up to 4&nbsp;MB per file.</li>
                <li><strong>Share this upload</strong> — help other tradies (no personal data).</li>
                <li><strong>Question</strong> — describe the issue clearly (symptoms, environment, constraints).</li>
              </ul>
            </div>
          </div>

          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Example questions</h3>
              <ul class="list-disc ml-5 text-sm">
                <li>“AS/NZS 3000: clearance needed for domestic switchboards?”</li>
                <li>“Torque setting for M8 bolts on this Daikin bracket?”</li>
                <li>“From this SDS, what PPE is required for the adhesive?”</li>
                <li>“Compare Rinnai B26 vs B20 flow rates.”</li>
                <li>“In my uploaded manual, what does error code F97 mean?”</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Example workflow</h3>
              <ol class="list-decimal ml-5 text-sm">
                <li>Upload the <em>Rinnai B26 manual (PDF)</em>.</li>
                <li>Ask: “What’s the required gas pressure range?”</li>
                <li>Assistant replies with a cited answer, e.g. “See page 12 of Rinnai_B26_Manual.pdf”.</li>
              </ol>
            </div>
          </div>

          <div class="card bg-base-100 border">
            <div class="card-body">
              <h3 class="font-semibold">Pro tips</h3>
              <ul class="list-disc ml-5 text-sm">
                <li>Use exact model numbers for best results.</li>
                <li>Attach manuals first, then ask the question.</li>
                <li>Tick “Share” only if you want to contribute to the shared library.</li>
                <li>We cite page numbers so you can verify info yourself.</li>
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

  <!-- Tips & Prompts -->
  <section id="tips" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Quick Tips &amp; Prompts</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold mb-2">Best practices</h3>
            <ul class="list-disc ml-5 text-sm">
              <li>Be specific — job, brand/model, sizes, constraints.</li>
              <li>Ask one clear question at a time.</li>
              <li>Mention tone if you want a style (“friendly, short”).</li>
              <li>Review AI answers and confirm when safety’s involved.</li>
              <li>Save good prompts so you can reuse them.</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-2">Cheat sheet prompts</h3>
            <ul class="list-disc ml-5 text-sm">
              <li>“Write a safety induction checklist for a plumbing apprentice.”</li>
              <li>“Daikin F97 error — likely cause and fix?”</li>
              <li>“Text client to confirm Friday job time, polite and friendly.”</li>
              <li>“Summarise this costing for a bathroom reno, client-friendly.”</li>
              <li>“What does clause 3.9.3 in AS/NZS 3000 refer to?”</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section id="faq" class="mt-8 scroll-mt-24">
    <div class="card bg-base-100 border">
      <div class="card-body">
        <h2 class="card-title">Troubleshooting &amp; FAQ</h2>

        <div class="join join-vertical w-full mt-2">
          <div class="collapse collapse-arrow join-item border">
            <input type="checkbox" />
            <div class="collapse-title text-base font-medium">Nothing shows in the preview?</div>
            <div class="collapse-content text-sm">
              <p>Check your internet and click Generate again. If it persists, reload the page.</p>
            </div>
          </div>

          <div class="collapse collapse-arrow join-item border">
            <input type="checkbox" />
            <div class="collapse-title text-base font-medium">Output too long or too short?</div>
            <div class="collapse-content text-sm">
              <p>Ask: “Summarise in 5 bullet points” or “Expand the scope section with 3 more items.”</p>
            </div>
          </div>

          <div class="collapse collapse-arrow join-item border">
            <input type="checkbox" />
            <div class="collapse-title text-base font-medium">Wrong manual/model in the answer?</div>
            <div class="collapse-content text-sm">
              <p>Re-enter the exact model or upload the specific manual first, then ask again.</p>
            </div>
          </div>

          <div class="collapse collapse-arrow join-item border">
            <input type="checkbox" />
            <div class="collapse-title text-base font-medium">PDF won’t upload?</div>
            <div class="collapse-content text-sm">
              <p>Supported types are PDF/TXT. Max 4&nbsp;MB per file — split or compress large files.</p>
            </div>
          </div>

          <div class="collapse collapse-arrow join-item border">
            <input type="checkbox" />
            <div class="collapse-title text-base font-medium">Do you include GST in totals?</div>
            <div class="collapse-content text-sm">
              <p>The calculator can include/exclude GST. Confirm on each quote and note it clearly.</p>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <div class="flex flex-wrap gap-2">
            <a href="/account/chat" class="btn btn-primary">Open Smart Chat</a>
            <a href="/account/assistant" class="btn btn-secondary">Open Smart Assistant</a>
            <a href="/account/tools" class="btn">Open Smart Tools</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
