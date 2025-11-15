<script lang="ts">
  type Pillar = {
    name: string;
    eyebrow: string;
    summary: string;
    useFor: string[];
    proTips: string[];
  };

  type PromptRecipe = {
    title: string;
    formula: string;
    example: string;
  };

  type ToolHighlight = {
    eyebrow: string;
    name: string;
    description: string;
    extra: string;
  };

  const pillars: Pillar[] = [
    {
      name: 'Smart Tools',
      eyebrow: 'Documents & pricing',
      summary:
        'Six focused workflows for polished paperwork — Terms & Conditions, Proposal & Estimate Builder, Scope Guard Day Log, Review Responder, Social Post and Email Template.',
      useFor: [
        'Crunching materials, labour and markup into tidy client-ready numbers.',
        'Locking in the fine print before the job kicks off.',
        'Fast marketing touchpoints like socials, reviews and email kits.'
      ],
      proTips: [
        'Keep quantities, units and rates together so totals stay accurate.',
        'Reference a suburb or timeframe for more grounded copy.',
        'Use Tools for structure + wording. Ask the Assistant for rules or specs.'
      ]
    },
    {
      name: 'Smart Chat',
      eyebrow: 'Everyday comms',
      summary:
        'Your on-call copywriter. Texts, emails, checklists and quick explainers that sound like you with none of the blank-page time sink.',
      useFor: [
        'Friendly SMS nudges, booking confirmations and payment reminders.',
        'Explaining variations, delays or safety notes without sounding robotic.',
        'Turning dot points into staff instructions or job checklists.'
      ],
      proTips: [
        'Say the format first (SMS/email/checklist) then outline the situation.',
        'Add tone nudges like “keep it casual” or “needs to sound formal”.',
        'Stick to one scenario per message for sharper replies.'
      ]
    },
    {
      name: 'Smart Assistant',
      eyebrow: 'Tradie Library',
      summary:
        'Technical answers backed by AU/NZ standards, manufacturer manuals, spec sheets, SDS and anything you upload.',
      useFor: [
        'Citing clearances, wiring, gas pressures and compliance requirements.',
        'Troubleshooting error codes with references to the correct section.',
        'Summarising uploaded PDFs so you can brief clients or apprentices.'
      ],
      proTips: [
        'Mention the trade, model and standard if you know it.',
        'Upload the PDF before you ask so the Assistant can cite your exact doc.',
        'Ask one technical question at a time to keep the answer laser focused.'
      ]
    }
  ];

  const promptFormulas: PromptRecipe[] = [
    {
      title: 'Message formula',
      formula: 'Format + audience + job + tone + call-to-action',
      example: '“Text • client Sarah • switchboard upgrade on Friday • friendly, clear • confirm access + parking.”'
    },
    {
      title: 'Quote math',
      formula: 'Qty + material + labour rate + markup + timeline',
      example: '“42 m² spotted gum decking • $85/hr labour • 18% margin • finish by 12 July.”'
    },
    {
      title: 'Assistant brief',
      formula: 'Trade + model/standard + exact question + site detail',
      example: '“HVAC • Mitsubishi MSZ-AP50 • minimum outdoor clearances for balcony install in Cairns.”'
    }
  ];

  const toolHighlights: ToolHighlight[] = [
    {
      eyebrow: 'Compliance',
      name: 'Terms & Conditions Generator',
      description: 'Lock in deposits, payment stages and site responsibilities with clauses written for Aussie jobs.',
      extra: 'Copy straight into your quote or send as a PDF add-on.'
    },
    {
      eyebrow: 'Pricing',
      name: 'Proposal & Estimate Builder',
      description: 'Turn a rough scope into itemised materials, labour, markup and GST in minutes.',
      extra: 'Exports clean summaries for quotes or longer-form proposals.'
    },
    {
      eyebrow: 'Scope guard',
      name: 'Day Log',
      description: 'Capture progress, delays, weather and client chats each day to defend variations later.',
      extra: 'Keeps timestamps plus a running photo/notes feed.'
    },
    {
      eyebrow: 'Reputation',
      name: 'Review Responder',
      description: 'Reply to any 1–5 star review with warmth while addressing the real issue.',
      extra: 'Great for Google, Hipages and Facebook feedback.'
    },
    {
      eyebrow: 'Marketing',
      name: 'Social Media Post Generator',
      description: 'Feed it a job, suburb and vibe — get captions, hooks and hashtags ready for Insta, FB or LinkedIn.',
      extra: 'Saves variations so you can post across channels quickly.'
    },
    {
      eyebrow: 'Comms',
      name: 'Email Template Generator',
      description: 'Job updates, payment nudges, wrap-ups and onboarding kits that still sound like you.',
      extra: 'Pair with Smart Chat when you want an SMS + email combo.'
    }
  ];
</script>

<div class="mx-auto max-w-6xl space-y-8 px-4 py-8">
  <header class="rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-slate-50 px-6 py-8 shadow-sm">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Workflow guide</p>
    <h1 class="mt-3 text-3xl font-semibold text-slate-900">Make every request land the first time</h1>
    <p class="mt-3 text-base text-slate-600">
      Tradie Assistant is three parts working together: Smart Tools for paperwork and pricing, Smart Chat for
      on-the-fly comms, and Smart Assistant for technical answers. Use this playbook to give clearer briefs, get better
      citations, and show off our refreshed toolset to the team.
    </p>
    <div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-amber-800">
      <span class="inline-flex items-center rounded-full border border-amber-200 bg-white/70 px-3 py-1">Smart Tools</span>
      <span class="inline-flex items-center rounded-full border border-amber-200 bg-white/70 px-3 py-1">Smart Chat</span>
      <span class="inline-flex items-center rounded-full border border-amber-200 bg-white/70 px-3 py-1">Smart Assistant</span>
      <span class="inline-flex items-center rounded-full border border-amber-200 bg-white/70 px-3 py-1">Tradie Library</span>
    </div>
  </header>

  <section class="grid gap-5 md:grid-cols-3">
    {#each pillars as pillar}
      <article class="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-600">{pillar.eyebrow}</p>
        <h2 class="mt-1 text-xl font-semibold text-slate-900">{pillar.name}</h2>
        <p class="mt-2 text-sm text-slate-600">{pillar.summary}</p>
        <div class="mt-4 space-y-4 text-sm text-slate-700">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Use it for</p>
            <ul class="mt-2 list-disc space-y-1 pl-4">
              {#each pillar.useFor as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Pro tips</p>
            <ul class="mt-2 list-disc space-y-1 pl-4">
              {#each pillar.proTips as tip}
                <li>{tip}</li>
              {/each}
            </ul>
          </div>
        </div>
      </article>
    {/each}
  </section>

  <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
    <div class="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Prompt recipes</p>
      <h2 class="mt-2 text-2xl font-semibold text-slate-900">Give it the good stuff</h2>
      <p class="mt-2 text-sm text-slate-600">Use these shorthand formulas when you’re briefing the AI.</p>
      <div class="mt-5 space-y-4">
        {#each promptFormulas as recipe}
          <div class="rounded-2xl border border-amber-100/80 bg-amber-50/40 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">{recipe.title}</p>
            <p class="mt-1 text-base font-semibold text-slate-900">{recipe.formula}</p>
            <p class="mt-2 text-sm text-slate-700">Example: {recipe.example}</p>
          </div>
        {/each}
      </div>
    </div>
    <div class="rounded-3xl border border-slate-200 bg-slate-900 text-slate-50 p-6 shadow-md">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Keep context handy</p>
      <h2 class="mt-2 text-2xl font-semibold">Upload docs & cite sources</h2>
      <ul class="mt-4 space-y-3 text-sm">
        <li class="flex gap-3">
          <span class="text-amber-300">1</span>
          <p>Drop PDFs (≤4&nbsp;MB) into the Assistant before you ask your question.</p>
        </li>
        <li class="flex gap-3">
          <span class="text-amber-300">2</span>
          <p>Mention what you uploaded — “Use my switchboard spec PDF for this answer.”</p>
        </li>
        <li class="flex gap-3">
          <span class="text-amber-300">3</span>
          <p>Highlight the cite callouts in your reply when sending to inspectors or clients.</p>
        </li>
        <li class="flex gap-3">
          <span class="text-amber-300">4</span>
          <p>Save favourite prompts inside <strong>Assistant prompts</strong> so the team stays consistent.</p>
        </li>
      </ul>
      <div class="mt-6 rounded-2xl border border-white/40 bg-white/10 p-4 text-sm text-white/90">
        <p class="font-semibold">Need a reminder?</p>
        <p class="mt-1 text-white/80">Swipe over to <em>Account → Assistant</em> and pin the “What you get” card for quick links.</p>
      </div>
    </div>
  </section>

  <section class="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-start">
      <div class="md:w-1/3">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Toolbox refresh</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Everything that’s new</h2>
        <p class="mt-2 text-sm text-slate-600">
          We replaced the older beta tools with a tighter set tuned for real jobs. Pick the card that matches what you’re
          doing and let it walk you through the fields.
        </p>
      </div>
      <div class="md:w-2/3 grid gap-4 sm:grid-cols-2">
        {#each toolHighlights as tool}
          <article class="rounded-2xl border border-slate-100 bg-white/90 p-4">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-amber-600">{tool.eyebrow}</p>
            <h3 class="mt-1 text-lg font-semibold text-slate-900">{tool.name}</h3>
            <p class="mt-2 text-sm text-slate-600">{tool.description}</p>
            <p class="mt-2 text-xs text-slate-500">{tool.extra}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <footer class="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 text-center shadow-sm">
    <h2 class="text-2xl font-semibold text-slate-900">Ready to put it to work?</h2>
    <p class="mt-2 text-sm text-slate-700">
      Hop into the tool you need, keep this guide handy, and keep saving hours on quotes, comms and compliance.
    </p>
    <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
      <a class="btn btn-primary" href="/account/tools">Open Smart Tools</a>
      <a class="btn btn-outline border-slate-300 text-slate-900" href="/account/chat">Message in Smart Chat</a>
      <a class="btn btn-ghost" href="/account/assistant">Ask the Assistant</a>
    </div>
  </footer>
</div>
