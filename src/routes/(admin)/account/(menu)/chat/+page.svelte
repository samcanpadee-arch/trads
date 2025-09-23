<script lang="ts">
  import { useChat } from '@ai-sdk/svelte';

  // Reuse the working API endpoint
  const { messages, input, handleInput, handleSubmit, isLoading } = useChat({
    api: '/api/chat'
  });
</script>

<div class="max-w-3xl mx-auto p-4 space-y-4">
  <div class="border rounded p-3 h-[60vh] overflow-y-auto bg-base-200">
    {#each messages as m}
      <div class="mb-3">
        <div class="text-xs opacity-60 mb-1">{m.role === 'user' ? 'You' : 'Assistant'}</div>
        <div class="whitespace-pre-line">{m.content}</div>
      </div>
    {/each}
    {#if isLoading}
      <div class="opacity-60 text-sm">…thinking</div>
    {/if}
  </div>

  <form on:submit|preventDefault={handleSubmit} class="join w-full">
    <input
      class="input input-bordered join-item w-full"
      placeholder="Type your message…"
      bind:value={input}
      on:input={handleInput}
    />
    <button class="btn btn-primary join-item" disabled={isLoading || !input.trim()}>
      Send
    </button>
  </form>
</div>
