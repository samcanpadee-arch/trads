<script lang="ts">
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
  <title>Chat</title>
</svelte:head>

<div class="flex flex-col h-full">
  <div class="mb-3 flex items-center gap-3">
    <h1 class="text-2xl font-bold">Chat</h1>

    <div class="ml-auto flex items-center gap-2">
      <label class="text-sm opacity-80" for="modelSelect">Model</label>
      <select id="modelSelect" class="select select-bordered select-sm" bind:value={model} disabled={streaming}>
        {#each models as m}
          <option value={m.id}>{m.label}</option>
        {/each}
      </select>
      <button class="btn btn-ghost btn-sm" on:click={clearChat} disabled={streaming}>
        Clear
      </button>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto space-y-4 p-4 rounded bg-base-200">
    {#each messages as m}
      <div class="chat {m.role === 'user' ? 'chat-end' : 'chat-start'}">
        <div class="chat-bubble whitespace-pre-wrap">{m.content}</div>
      </div>
    {/each}

    {#if streaming}
      <div class="chat chat-start">
        <div class="chat-bubble">
          {streamBuffer}<span class="loading loading-dots loading-xs align-middle ml-2"></span>
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
