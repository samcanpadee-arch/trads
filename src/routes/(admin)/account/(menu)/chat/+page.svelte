<script lang="ts">
  import RichAnswer from "$lib/components/RichAnswer.svelte";
  type Role = 'system' | 'user' | 'assistant';
  type Msg = { role: Role; content: string };

  let messages: Msg[] = [
    { role: 'assistant', content: "Hi! I'm your AI helper. How can I help today?" }
  ];

  // Simple model selector similar to “GPT-3.5/4” idea
  const models = [
    { id: 'gpt-4o-mini', label: 'Fast' },
    { id: 'gpt-4o', label: 'Best' }
  ];
  let model = models[0].id; // default

  let input = '';
  let streaming = false;
  let streamBuffer = '';
  let errorMsg: string | null = null;

  async function sendMessage(e?: Event) {
    e?.preventDefault();
    if (!input.trim() || streaming) return;

    errorMsg = null;
    messages = [...messages, { role: 'user', content: input }];
    const payload = { messages, model };

    input = '';
    streaming = true;
    streamBuffer = '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok || !res.body) {
        errorMsg = await res.text();
        streaming = false;
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        streamBuffer += decoder.decode(value, { stream: true });
      }

      messages = [...messages, { role: 'assistant', content: streamBuffer }];
    } catch (err: any) {
      errorMsg = err?.message ?? 'Network error';
    } finally {
      streaming = false;
    }
  }

  function clearChat() {
    messages = [{ role: 'assistant', content: "New chat. What’s up?" }];
    errorMsg = null;
    streamBuffer = '';
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
      <label class="text-sm opacity-80 w-full sm:w-auto">Model</label>
      <select
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

  <div class="flex-1 overflow-y-auto space-y-4 p-4 rounded bg-base-200">
    {#each messages as m}
      <div class="chat {m.role === 'user' ? 'chat-end' : 'chat-start'}">
        {#if m.role === 'assistant'}
          <div class="chat-bubble max-w-full bg-base-100 text-base-content [&_.prose]:m-0">
            <RichAnswer text={m.content} />
          </div>
        {:else}
          <div class="chat-bubble whitespace-pre-wrap">{m.content}</div>
        {/if}
      </div>
    {/each}

    {#if streaming}
      <div class="chat chat-start">
        <div class="chat-bubble max-w-full bg-base-100 text-base-content [&_.prose]:m-0">
          <RichAnswer text={streamBuffer} />
          <div class="mt-2 flex justify-start">
            <span class="loading loading-dots loading-xs"></span>
          </div>
        </div>
      </div>
    {/if}
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
    />
    <button class="btn btn-primary" disabled={streaming || !input.trim()}>
      {#if streaming}
        <span class="loading loading-spinner"></span>
      {:else}
        Send
      {/if}
    </button>
  </form>
</div>
