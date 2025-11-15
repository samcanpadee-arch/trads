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

  type ChatPrompt = {
    trade: string;
    title: string;
    summary: string;
    prompt: string;
  };

  const chatPrompts: ChatPrompt[] = [
    {
      trade: 'HVAC',
      title: 'Service recap + next steps',
      summary:
        'Have Smart Chat summarise what you serviced and what the client should do next.',
      prompt:
        "Just wrapped a quarterly service on three ducted systems at a childcare centre. Summarise what we checked, highlight any follow-up work, and write an SMS so the centre manager knows the systems are healthy."
    },
    {
      trade: 'Electrical',
      title: 'Quote follow-up that feels human',
      summary:
        'Turn a switchboard upgrade scope into friendly quote wording plus a nudge to accept.',
      prompt:
        "I’m chasing up a switchboard upgrade quote on a 1970s brick home. Turn my scope into a short summary with 3 dot points, then draft a follow-up SMS that sounds like a real tradie and nudges them to approve it this week."
    },
    {
      trade: 'Carpentry',
      title: 'Variation explainer for custom joinery',
      summary:
        'Explain a scope change in plain English and keep the relationship warm.',
      prompt:
        "Midway through a kitchen reno the client asked for custom oak shelving and LED strips. Help me write a variation email that sets out the extra labour/materials, adjusted timeline, and keeps the tone positive."
    },
    {
      trade: 'Plumbing',
      title: 'Recurring maintenance pitch',
      summary:
        'Sell a preventative plan without sounding salesy.',
      prompt:
        "Body corporate for a 16-unit block keeps calling us for blocked stacks. Draft a short plan that explains quarterly jetting + CCTV checks, rough pricing tiers, and a follow-up SMS to get approval."
    }
  ];

  let input = '';
  let streaming = false;
  let streamingIndex: number | null = null;
  let errorMsg: string | null = null;
  let storageReady = false;
  let chatContainer: HTMLDivElement | null = null;
  let shouldStickToBottom = true;
  let chatPromptsOpen = false;

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

  function loadChatPrompt(prompt: string) {
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
        class="rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-inner h-[480px] sm:h-[620px] max-h-[80vh] overflow-y-auto space-y-4"
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
      <div class="rounded-3xl border border-white/60 bg-gradient-to-br from-white via-amber-50/70 to-white p-5 shadow-sm backdrop-blur space-y-4">
        <div class="flex flex-wrap items-center gap-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-primary">Chat prompts</p>
          <p class="text-sm text-gray-600">Insert a proven scenario without typing it all out.</p>
        </div>
        <button
          type="button"
          class="btn btn-ghost btn-xs justify-between border border-primary/30 bg-white/80 px-3 text-primary"
          on:click={() => (chatPromptsOpen = !chatPromptsOpen)}
          aria-expanded={chatPromptsOpen}
        >
          <span>{chatPromptsOpen ? 'Hide prompts' : 'Show prompts'}</span>
          <span>{chatPromptsOpen ? '–' : '+'}</span>
        </button>
        {#if chatPromptsOpen}
          <div class="space-y-3">
            {#each chatPrompts as prompt}
              <article class="rounded-2xl border border-white/60 bg-white/80 p-3">
                <p class="text-[11px] font-semibold uppercase tracking-wide text-primary">{prompt.trade}</p>
                <h3 class="text-sm font-semibold text-gray-900">{prompt.title}</h3>
                <p class="mt-1 text-xs text-gray-600">{prompt.summary}</p>
                <button
                  type="button"
                  class="btn btn-outline btn-xs mt-2"
                  on:click={() => loadChatPrompt(prompt.prompt)}
                >
                  Use this prompt
                </button>
              </article>
            {/each}
          </div>
        {:else}
          <p class="text-xs text-gray-500">Tap to open when you want ideas.</p>
        {/if}
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
