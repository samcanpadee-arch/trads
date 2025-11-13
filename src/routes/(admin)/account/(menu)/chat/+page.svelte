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
    const nextMessages = [...messages, { role: 'user', content: input }];
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

<div class="flex flex-col h-full">
  <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Smart Chat</h1>
      <p class="text-base leading-relaxed text-base-content/80 text-pretty">
        Need to bounce a quick idea off someone who speaks tradie? Fire it into Smart Chat and you’ll get fast, plain-English
        answers without waiting on hold. It remembers the convo, keeps things on the tools, and shouts out next steps like a
        switched-on mate in the ute.
      </p>
    </div>

    <div class="sm:ml-auto flex flex-wrap items-center gap-2">
      <label class="text-sm opacity-80 w-full sm:w-auto" for="chat-model">Model</label>
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
    class="flex-1 overflow-y-auto space-y-4 p-4 rounded bg-base-200"
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
    <div class="mt-3 alert alert-error">
      <span>{errorMsg}</span>
    </div>
  {/if}

  <form class="mt-4 flex gap-2" on:submit|preventDefault={sendMessage}>
    <textarea
      class="textarea textarea-bordered flex-1 min-h-[48px]"
      placeholder="Ask me anything… (Ctrl/Cmd+Enter to send)"
      bind:value={input}
      on:keydown={onKeydown}
    ></textarea>
    <button class="btn btn-primary" disabled={streaming || !input.trim()}>
      {#if streaming}
        <span class="loading loading-spinner"></span>
      {:else}
        Send
      {/if}
    </button>
  </form>
</div>
