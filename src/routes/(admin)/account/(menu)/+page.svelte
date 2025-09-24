<script lang="ts">
  import { createChat } from "@ai-sdk/svelte"

  // Use our working API route
  const { messages, setInput, handleSubmit, isLoading } = createChat({
    api: "/api/chat",
  })

  function onInput(e: Event) {
    const t = e.target as HTMLInputElement
    setInput(t.value)
  }
</script>

<div class="flex flex-col gap-4 h-full">
  <div class="flex-1 overflow-auto space-y-2">
    {#each $messages as m}
      <div class={m.role === "user" ? "chat chat-end" : "chat chat-start"}>
        <div class="chat-bubble whitespace-pre-wrap">{m.content}</div>
      </div>
    {/each}
  </div>

  <form class="join w-full" on:submit|preventDefault={handleSubmit}>
    <input
      class="input input-bordered join-item w-full"
      placeholder="Type your message…"
      on:input={onInput}
    />
    <button class="btn join-item" disabled={$isLoading}>Send</button>
  </form>
</div>
