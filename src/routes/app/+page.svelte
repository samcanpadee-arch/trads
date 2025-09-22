<script lang="ts">
  let input = "";
  type Msg = { role: "user" | "assistant"; text: string };
  let messages: Msg[] = [];

  async function send() {
    const text = input.trim();
    if (!text) return;
    messages = [...messages, { role: "user", text }];
    input = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, mode: "qna" })
      });
      const data = await res.json();
      messages = [...messages, { role: "assistant", text: data.answer || "(no reply)" }];
    } catch (e) {
      messages = [...messages, { role: "assistant", text: "Sorry, something went wrong." }];
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
</script>

<div class="mx-auto max-w-3xl p-4 space-y-4">
  <h1 class="text-2xl font-semibold">Tradie Assistant</h1>

  <div class="border rounded p-3 h-[60vh] overflow-y-auto bg-base-200 space-y-3">
    {#if messages.length === 0}
      <p class="opacity-60">Ask a question to get started…</p>
    {/if}
    {#each messages as m}
      <div class={`rounded p-3 ${m.role === "user" ? "bg-primary text-primary-content self-end" : "bg-base-100"}`}>
        <strong class="block mb-1">{m.role === "user" ? "You" : "Assistant"}</strong>
        <pre class="whitespace-pre-wrap break-words">{m.text}</pre>
      </div>
    {/each}
  </div>

  <div class="flex gap-2">
    <textarea
      bind:value={input}
      on:keydown={onKey}
      rows="3"
      class="textarea textarea-bordered w-full"
      placeholder="Type your question and press Enter…"
    />
    <button class="btn btn-primary self-start" on:click={send}>Send</button>
  </div>
</div>
