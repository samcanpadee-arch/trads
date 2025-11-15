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

type ChatHabit = {
  step: string;
  title: string;
  detail: string;
};

type GuidePlay = {
  eyebrow: string;
  title: string;
  description: string;
  steps: string[];
};

  const pillars: Pillar[] = [
    {
      name: 'Smart Tools',
      eyebrow: 'Paperwork without pain',
      summary:
        'Fill-in-the-blanks builders for quotes, Ts & Cs, day logs, reviews, socials and email packs. No spreadsheets or copy/paste gymnastics.',
      useFor: [
        'Plugging materials, labour and markup into tidy proposals and estimates.',
        'Locking in scope, site rules and variations before anyone is on the ladder.',
        'Packaging socials, testimonials and email kits when you need a fast win.'
      ],
      proTips: [
        'Write numbers exactly how you’d scribble them down so totals stay true.',
        'Drop in the suburb or little job story so the copy sounds local.',
        'Let Tools handle the structure, then use Smart Chat for the final polish.'
      ]
    },
    {
      name: 'Smart Chat',
      eyebrow: 'Back-and-forth answers',
      summary:
        'Like a switched-on apprentice you can talk to all day. Keep the convo rolling until the reply sounds right, then ask it to remix the final version.',
      useFor: [
        'Working through a tricky client reply by asking for rewrites until it feels right.',
        'Brainstorming instructions, toolbox talks, handover notes or meeting recaps.',
        'Pressure-testing an idea by asking “what am I missing?” and “what could go wrong?”.'
      ],
      proTips: [
        'Keep chatting: say “nah, more casual” or “make it shorter” and it will try again.',
        'Paste the latest message back in so it knows what you liked or hated.',
        'Use follow-ups like “now turn that into a checklist/SMS/email” at the end.'
      ]
    },
    {
      name: 'Smart Assistant',
      eyebrow: 'Manuals & standards on tap',
      summary:
        'Technical answers that point to AU/NZ rules, manufacturer manuals and the Tradie Library. Ask it for the clause, section or table you need.',
      useFor: [
        'Pulling clearances, wiring sizes, gas pressures and compliance must-haves.',
        'Answering site questions with references to the manual or standard you name.',
        'Explaining the “why” behind a requirement so clients and apprentices trust it.'
      ],
      proTips: [
        'Name the trade, model or standard even if it’s a rough guess.',
        'Mention what part of the job you’re on and the condition on site.',
        'Ask for cites or “show me the paragraph” whenever you need proof.'
      ]
    }
  ];

  const promptFormulas: PromptRecipe[] = [
    {
      title: 'Set the scene',
      formula: 'Who you are + job + snag + what you need back',
      example: '“I’m a chippy fixing a pergola for client Kat. Need a calm update about a 2-day delay because of rain.”'
    },
    {
      title: 'Money maths',
      formula: 'Task + qty + materials + labour + extras + deadline',
      example: '“Bathroom reno: waterproofing + tiling 18m² • tiles at $45/m² • labour $90/hr • add 12% margin • done before 5 Aug.”'
    },
    {
      title: 'Manual lookup',
      formula: 'Trade + model/standard + question + why you need it',
      example: '“Sparky • AS/NZS 3000 • explain minimum switchboard clearance for a laundry cupboard so I can include it in an email.”'
    }
  ];
  const chatHabits: ChatHabit[] = [
    {
      step: '1',
      title: 'Talk like you text',
      detail: 'Skip the jargon. Say what’s happening in plain words and the AI will match your vibe.'
    },
    {
      step: '2',
      title: 'Reply to the reply',
      detail: 'If it’s close, answer back with “shorter”, “add more detail about the bathroom” or “sound more confident”.'
    },
    {
      step: '3',
      title: 'Ask for the proof',
      detail: 'Need backup? Say “show me the clause” or “cite the manual section” before you send it on.'
    },
    {
      step: '4',
      title: 'Save the gold',
      detail: 'Star the prompts you love inside Assistant prompts so the crew can reuse them next time.'
    }
  ];

  const guidePlays: GuidePlay[] = [
    {
      eyebrow: 'Quotes & paperwork',
      title: 'Spin up a job pack',
      description: 'Use Smart Tools to build the paperwork, then bounce to Chat for the client wording.',
      steps: [
        'Start with Proposal & Estimate to get the numbers locked in.',
        'Copy the summary into Smart Chat and ask for a client-friendly breakdown.',
        'Finish with Ts & Cs or a Day Log entry so you’ve covered scope and records.'
      ]
    },
    {
      eyebrow: 'On-site answers',
      title: 'Settle a technical question',
      description: 'When someone challenges a decision, make the Assistant find the reference.',
      steps: [
        'Tell it the trade, model and what you’re trying to prove.',
        'Mention any weird site conditions (tight balcony, coastal, ceiling height).',
        'Ask it to quote the manual or standard so you can copy/paste the proof.'
      ]
    },
    {
      eyebrow: 'Client updates',
      title: 'Handle a curveball calmly',
      description: 'Keep Smart Chat open while you talk through the issue like you would with a mate.',
      steps: [
        'Explain the situation, the person you’re talking to and what outcome you want.',
        'Ask for two or three tone options so you can pick the one that fits.',
        'Finish with “wrap this in dot points / SMS / email” for the final send.'
      ]
    }
  ];
</script>

<div class="mx-auto max-w-6xl space-y-8 px-4 py-8">
  <header class="rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-slate-50 px-6 py-8 shadow-sm">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Workflow guide</p>
    <h1 class="mt-3 text-3xl font-semibold text-slate-900">Make every request land the first time</h1>
    <p class="mt-3 text-base text-slate-600">
      Tradie Assistant is three parts working together. Tools handle the paperwork, Chat keeps the conversation going, and the
      Assistant backs you with manuals and standards. This guide shows how to brief it like a human, not a robot, so you keep
      winning jobs and arguments.
    </p>
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
      <h2 class="mt-2 text-2xl font-semibold text-slate-900">Easy briefs that land</h2>
      <p class="mt-2 text-sm text-slate-600">Say it how you’d say it on site. These quick formulas keep things clear.</p>
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
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Keep it rolling</p>
      <h2 class="mt-2 text-2xl font-semibold">Chat like you would on site</h2>
      <ul class="mt-4 space-y-4 text-sm">
        {#each chatHabits as habit}
          <li class="flex gap-3">
            <span class="text-amber-300 font-semibold">{habit.step}</span>
            <div>
              <p class="font-semibold">{habit.title}</p>
              <p class="text-white/80">{habit.detail}</p>
            </div>
          </li>
        {/each}
      </ul>
      <div class="mt-6 rounded-2xl border border-white/40 bg-white/10 p-4 text-sm text-white/90">
        <p class="font-semibold">Tip</p>
        <p class="mt-1 text-white/80">Pin your favourite prompts or replies so apprentices and office staff can grab them fast.</p>
      </div>
    </div>
  </section>

  <section class="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
    <div class="flex flex-col gap-6 md:flex-row md:items-start">
      <div class="md:w-1/3">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Playbook</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">How tradies get the best out of it</h2>
        <p class="mt-2 text-sm text-slate-600">
          Try these simple plays whenever you’re quoting, sorting drama on site or keeping clients calm. Follow the steps and
          tweak them to suit your trade.
        </p>
      </div>
      <div class="md:w-2/3 grid gap-4 sm:grid-cols-2">
        {#each guidePlays as play}
          <article class="rounded-2xl border border-slate-100 bg-white/90 p-4">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-amber-600">{play.eyebrow}</p>
            <h3 class="mt-1 text-lg font-semibold text-slate-900">{play.title}</h3>
            <p class="mt-2 text-sm text-slate-600">{play.description}</p>
            <ul class="mt-3 list-disc space-y-1 pl-4 text-sm text-slate-600">
              {#each play.steps as step}
                <li>{step}</li>
              {/each}
            </ul>
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
