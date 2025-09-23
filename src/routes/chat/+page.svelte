<script lang="ts">
  import { useChat } from '@ai-sdk/svelte';

  // Point to our working endpoint
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat'
  });
</script>

<!-- super minimal UI; we can style later -->
<div class="max-w-2xl mx-auto p-4 space-y-4">
  <h1 class="text-2xl font-semibold">Chat</h1>

  <div class="border rounded p-3 h-[50vh] overflow-auto space-y-3 bg-white/50">
    {#if messages.length === 0}
      <p class="text-gray-500">Start the conversation below…</p>
    {/if}

    {#each messages as m}
      <div class="whitespace-pre-wrap">
        <span class="font-medium">{m.role === 'user' ? 'You' : 'Assistant'}:</span>
        <span> {m.content}</span>
      </div>
    {/each}
  </div>

  {#if error}
    <div class="text-red-600 text-sm">Error: {String(error)}</div>
  {/if}

  <form class="flex gap-2" on:submit|preventDefault={handleSubmit}>
    <input
      class="flex-1 border rounded px-3 py-2"
      placeholder="Type your message…"
      value={input}
      on:input={handleInputChange}
    />
    <button class="border rounded px-4 py-2" disabled={isLoading}>
      {isLoading ? 'Sending…' : 'Send'}
    </button>
  </form>
</div>
