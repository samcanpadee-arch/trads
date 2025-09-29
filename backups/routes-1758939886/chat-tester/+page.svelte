<script lang="ts">
  let input = '';
  let output = '';
  let sending = false;

  async function send() {
    sending = true;
    output = '';
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        messages: [{ role:'user', content: input || 'Say hi!' }]
      })
    });

    if (!res.ok) {
      const body = await res.text().catch(()=>'');
      output = `HTTP ${res.status} ${res.statusText} ${body}`;
      sending = false;
      return;
    }

    // Stream the plain text response
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (reader) {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        output += decoder.decode(value, { stream: true });
      }
    } else {
      output = await res.text();
    }
    sending = false;
  }
</script>

<h1 class="text-2xl font-bold mb-4">Chat Tester</h1>
<form on:submit|preventDefault={send} class="space-y-3">
  <input
    class="border rounded px-3 py-2 w-full"
    bind:value={input}
    placeholder="Ask something…"
  />
  <button class="bg-black text-white rounded px-4 py-2" disabled={sending}>
    {sending ? 'Sending…' : 'Send'}
  </button>
</form>

<pre class="mt-4 whitespace-pre-wrap border rounded p-3">{output}</pre>
