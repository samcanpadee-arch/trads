<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';

  // Point to your API route
  const chat = new Chat({ api: '/api/chat' });

  let input = '';

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    chat.sendMessage({ text: input });
    input = '';
  }
</script>

<main class="max-w-2xl mx-auto p-4 space-y-4">
  <ul class="space-y-3">
    {#each chat.messages as message, i (i)}
      <li class="rounded border p-3">
        <div class="text-xs opacity-70">{message.role}</div>
        <div class="mt-1 space-y-1">
          {#each message.parts as part, j (j)}
            {#if part.type === 'text'}
              <div>{part.text}</div>
            {/if}
          {/each}
        </div>
      </li>
    {/each}
  </ul>

  <form on:submit={handleSubmit} class="flex gap-2">
    <input
      class="input input-bordered flex-1"
      bind:value={input}
      placeholder="Type a message..."
    />
    <button class="btn btn-primary" type="submit" disabled={chat.status === 'streaming'}>
      {chat.status === 'streaming' ? 'Thinking…' : 'Send'}
    </button>
  </form>
</main>
