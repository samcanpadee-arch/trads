<script lang="ts">
  let input = '';
  let messages: {role: 'user' | 'assistant', content: string}[] = [];
</script>

<div class="space-y-4">
  <h1 class="text-2xl font-semibold">Chat</h1>

  <div class="border rounded p-4 h-[60vh] overflow-auto bg-base-100">
    {#if messages.length === 0}
      <p class="text-sm opacity-70">Start a conversation… (backend wiring comes next)</p>
    {/if}
    {#each messages as m (m.content + m.role)}
      <div class="mb-3">
        <div class="text-xs uppercase opacity-60 mb-1">{m.role}</div>
        <div class="prose prose-sm bg-base-200 p-3 rounded">{m.content}</div>
      </div>
    {/each}
  </div>

  <form class="flex gap-2" on:submit|preventDefault={() => { if (!input.trim()) return; messages = [...messages, {role:'user', content: input.trim()}]; input=''; }}>
    <input class="input input-bordered flex-1" bind:value={input} placeholder="Type a message…" />
    <button class="btn btn-primary" type="submit" disabled>Send (coming soon)</button>
  </form>
</div>
