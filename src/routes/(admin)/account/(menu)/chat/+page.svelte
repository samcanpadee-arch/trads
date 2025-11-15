<script lang="ts">
  import { browser } from "$app/environment";
  import { afterUpdate, onMount } from "svelte";
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  import { getChatErrorMessage } from "$lib/utils/chat-errors";
  type Role = 'system' | 'user' | 'assistant';
  type Msg = { role: Role; content: string };

  const STORAGE_KEY = 'smart-chat-transcript';
  const INITIAL_MESSAGE: Msg = {
    role: 'assistant',
    content: "Hi! I'm your AI helper. How can I help today?"
  };

  let messages: Msg[] = [INITIAL_MESSAGE];

  // Simple model selector similar to “GPT-3.5/4” idea
  const models = [
    { id: 'gpt-4o-mini', label: 'Fast' },
    { id: 'gpt-4o', label: 'Best' }
  ];
  let model = models[0].id; // default

  type ChatPlaybook = {
    trade: string;
    title: string;
    summary: string;
    prompt: string;
  };

  const chatPlaybooks: ChatPlaybook[] = [
    {
      trade: 'Electrical',
      title: 'Quote follow-up that wins the work',
      summary:
        'Turn a switchboard upgrade scope into polished quote wording plus a friendly follow-up.',
      prompt:
        "I’m an electrician quoting a switchboard upgrade with RCBOs in an older brick home. Draft the quote summary, list the safety upgrades in bullet points, and give me a follow-up SMS that nudges the client to approve it this week."
    },
    {
      trade: 'Plumbing',
      title: 'Maintenance contract play',
      summary:
        'Pitch quarterly drain maintenance with ROI talking points and tidy proposal copy.',
      prompt:
        "I’m a plumber pitching a quarterly drain maintenance plan for a 12-unit block. Outline the inclusions, pricing options, and a short paragraph I can paste into a proposal explaining why preventative jetting saves money."
    },
    {
      trade: 'HVAC',
      title: 'Commissioning checklist & client summary',
      summary:
        'Get commissioning steps plus a customer-friendly note after a multi-split install.',
      prompt:
        "I’ve just installed a Daikin multi split (4 heads) in a two-storey townhouse. Give me the commissioning checklist with AS/NZS references plus a client-facing summary that covers maintenance and warranty steps."
    },
    {
      trade: 'Roofing',
      title: 'Insurance-ready job notes',
      summary:
        'Document storm damage clearly and tee up the right insurer wording.',
      prompt:
        "I’m a roofer on the Gold Coast helping a homeowner lodge a storm-damage claim. Draft a job note that documents the damage, temporary works completed, and the replacement scope tied to QBCC guidelines."
    },
    {
      trade: 'Solar',
      title: 'Compliance summary + upsell',
      summary:
        'Explain why a CCTV or monitoring add-on matters and capture compliance notes.',
      prompt:
        "I run a solar crew in Perth. We just finished a 6.6kW install with a Fronius Primo. Draft the compliance summary for the customer pack, referencing Clean Energy Council requirements and warranty pointers."
    },
    {
      trade: 'Landscaping',
      title: 'Variation & upsell helper',
      summary:
        'Capture the extra scope and turn it into approval-ready wording.',
      prompt:
        "I’m a landscaper in Adelaide. Mid-project, the client added a spotted-gum deck extension and upgraded lighting. Give me a variation email outlining new scope, costs, and next steps while sounding like a friendly tradie."
    }
  ];

  let input = '';
  let streaming = false;
  let streamingIndex: number | null = null;
  let errorMsg: string | null = null;
  let storageReady = false;
  let chatContainer: HTMLDivElement | null = null;
  let shouldStickToBottom = true;

  const serialize = (value: Msg[]) => JSON.stringify(value);

  function parseSavedMessages(raw: string | null): Msg[] | null {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return null;
      const cleaned: Msg[] = [];
      for (const entry of parsed) {
        if (!entry || typeof entry !== 'object') continue;
        const candidate = entry as { role?: unknown; content?: unknown };
        if (candidate.role === 'assistant' || candidate.role === 'user') {
          cleaned.push({ role: candidate.role, content: String(candidate.content ?? '') });
        }
      }
      if (!cleaned.length) return null;
      return cleaned;
    } catch (err) {
      console.warn('Failed to parse saved Smart Chat messages', err);
      return null;
    }
  }

  onMount(() => {
    if (!browser) return;
    const restored = parseSavedMessages(localStorage.getItem(STORAGE_KEY));
    if (restored) {
      messages = restored;
    }
    storageReady = true;
  });

  $: if (browser && storageReady) {
    try {
      localStorage.setItem(STORAGE_KEY, serialize(messages));
    } catch (err) {
      console.warn('Unable to persist Smart Chat messages', err);
    }
  }

  afterUpdate(() => {
    if (!chatContainer || !browser || !shouldStickToBottom) return;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });

  function loadChatPlaybook(prompt: string) {
    input = prompt;
  }

  function handleScroll() {
    if (!chatContainer) return;
    const distanceFromBottom =
      chatContainer.scrollHeight - (chatContainer.scrollTop + chatContainer.clientHeight);
    shouldStickToBottom = distanceFromBottom < 120;
  }

  async function sendMessage(e?: Event) {
    e?.preventDefault();
    if (!input.trim() || streaming) return;

    errorMsg = null;
    const userMessage: Msg = { role: 'user', content: input };
    const nextMessages = [...messages, userMessage];
    const payload = { messages: nextMessages, model };

    messages = nextMessages;
    shouldStickToBottom = true;

    input = '';
    streaming = true;
    messages = [...messages, { role: 'assistant', content: '' }];
    streamingIndex = messages.length - 1;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        errorMsg = await getChatErrorMessage(res);
        streaming = false;
        return;
      }

      if (!res.body) {
        errorMsg = 'The assistant sent an empty response. Please try again.';
        streaming = false;
        streamingIndex = null;
        shouldStickToBottom = true;
        return;
      }

      if (!res.body) {
        errorMsg = 'The assistant sent an empty response. Please try again.';
        messages = messages.slice(0, -1);
        streaming = false;
        streamingIndex = null;
        shouldStickToBottom = true;
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let doneStreaming = false;
      while (!doneStreaming) {
        const { value, done } = await reader.read();
        doneStreaming = Boolean(done);
        if (!value) continue;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk && streamingIndex !== null) {
          const current = messages[streamingIndex] ?? { role: 'assistant', content: '' };
          messages = [
            ...messages.slice(0, streamingIndex),
            { ...current, content: current.content + chunk },
            ...messages.slice(streamingIndex + 1)
          ];
          shouldStickToBottom = true;
        }
      }

      const finalChunk = decoder.decode();
      if (finalChunk && streamingIndex !== null) {
        const current = messages[streamingIndex] ?? { role: 'assistant', content: '' };
        messages = [
          ...messages.slice(0, streamingIndex),
          { ...current, content: current.content + finalChunk },
          ...messages.slice(streamingIndex + 1)
        ];
        shouldStickToBottom = true;
      }
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'Network error';
      if (streamingIndex !== null) {
        messages = messages.slice(0, -1);
      }
      shouldStickToBottom = true;
    } finally {
      streaming = false;
      streamingIndex = null;
    }
  }

  function clearChat() {
    messages = [{ ...INITIAL_MESSAGE, content: "New chat. What’s up?" }];
    errorMsg = null;
    streamingIndex = null;
    shouldStickToBottom = true;
  }

  function onKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      sendMessage();
    }
  }
</script>

<svelte:head>
  <title>Smart Chat</title>
</svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Conversations</p>
    <h1 class="mt-2 text-3xl font-bold leading-tight text-gray-900">Smart Chat</h1>
    <p class="mt-3 max-w-3xl text-base text-gray-700">
      Bounce site dramas, quoting curveballs, and client replies off an assistant that speaks tradie. Smart Chat keeps the full
      thread, offers next steps, and hands back wording you can paste straight into texts, emails, or the job log.
    </p>
  </header>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
    <div class="rounded-3xl border border-gray-200 bg-white/95 p-4 shadow-sm sm:p-6 space-y-5">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-primary">Live thread</p>
          <p class="text-sm text-gray-600">Chat history saves locally so you can pick up where you left off.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-gray-500" for="chat-model">Model</label>
          <select
            id="chat-model"
            class="select select-bordered w-full sm:w-auto sm:select-sm"
            bind:value={model}
            disabled={streaming}
          >
            {#each models as m}
              <option value={m.id}>{m.label}</option>
            {/each}
          </select>
          <button class="btn btn-ghost w-full sm:w-auto sm:btn-sm" on:click={clearChat} disabled={streaming}>
            Clear
          </button>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-inner h-[420px] max-h-[65vh] overflow-y-auto space-y-4"
        bind:this={chatContainer}
        on:scroll={handleScroll}
      >
        {#each messages as m, i}
          <div class="chat {m.role === 'user' ? 'chat-end' : 'chat-start'}">
            {#if m.role === 'assistant'}
              <div class="chat-bubble max-w-full bg-base-100 text-base-content [&_.prose]:m-0">
                <RichAnswer text={m.content} />
                {#if streaming && streamingIndex === i}
                  <div class="mt-2 flex justify-start">
                    <span class="loading loading-dots loading-xs"></span>
                  </div>
                {/if}
              </div>
            {:else}
              <div class="chat-bubble whitespace-pre-wrap">{m.content}</div>
            {/if}
          </div>
        {/each}
      </div>

      {#if errorMsg}
        <div class="alert alert-error">
          <span>{errorMsg}</span>
        </div>
      {/if}

      <form class="flex flex-col gap-3 lg:flex-row" on:submit|preventDefault={sendMessage}>
        <textarea
          class="textarea textarea-bordered min-h-[64px] flex-1"
          placeholder="Ask me anything… (Ctrl/Cmd+Enter to send)"
          bind:value={input}
          on:keydown={onKeydown}
        ></textarea>
        <button class="btn btn-primary shrink-0" disabled={streaming || !input.trim()}>
          {#if streaming}
            <span class="loading loading-spinner"></span>
          {:else}
            Send
          {/if}
        </button>
      </form>
    </div>

    <aside class="space-y-4">
      <div class="rounded-3xl border border-white/60 bg-gradient-to-br from-white via-amber-50/70 to-white p-5 shadow-sm backdrop-blur">
        <div class="flex flex-wrap items-center gap-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-primary">Trade playbooks</p>
          <p class="text-sm text-gray-600">Insert a proven scenario without typing it all out.</p>
        </div>
        <div class="mt-4 space-y-3">
          {#each chatPlaybooks as playbook}
            <article class="rounded-2xl border border-white/60 bg-white/80 p-3">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-primary">{playbook.trade}</p>
              <h3 class="text-sm font-semibold text-gray-900">{playbook.title}</h3>
              <p class="mt-1 text-xs text-gray-600">{playbook.summary}</p>
              <button
                type="button"
                class="btn btn-outline btn-xs mt-2"
                on:click={() => loadChatPlaybook(playbook.prompt)}
              >
                Use this playbook
              </button>
            </article>
          {/each}
        </div>
      </div>

      <div class="rounded-3xl border border-white/60 bg-gradient-to-br from-white/90 via-amber-50/70 to-rose-50/70 p-5 shadow-sm backdrop-blur">
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Best results</p>
        <ul class="mt-3 space-y-2 text-sm text-gray-700">
          <li>• Lead with the job context: trade, location, and what’s gone sideways.</li>
          <li>• Tell it what format you need back (SMS, quote wording, job notes).</li>
          <li>• Keep the thread open—Smart Chat remembers what you’ve tried.</li>
        </ul>
      </div>
      <div class="rounded-2xl border border-dashed border-gray-200 bg-white/80 p-4 shadow-sm">
        <div class="flex items-start gap-3">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
            💡
          </span>
          <div class="text-sm text-gray-700 space-y-1">
            <p class="font-semibold text-gray-900">Polish what you already have</p>
            <p>
              Paste any quote template, email, or website copy straight into Smart Chat and ask it to tighten the wording,
              keep the tone, or spin a fresh version.
            </p>
            <p class="text-xs text-gray-500">Handy when you need to modernise legacy docs without starting from scratch.</p>
          </div>
        </div>
      </div>
    </aside>
  </div>
</section>
