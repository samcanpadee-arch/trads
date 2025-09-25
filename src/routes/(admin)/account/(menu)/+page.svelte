<script lang="ts">
  // Minimal Account landing page (no external chat libs)
</script>

<div class="space-y-6">
  <h1 class="text-2xl font-semibold">Account</h1>
  <p class="opacity-70 text-sm">
    Welcome to your account. Use the sidebar to navigate between sections.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <a href="/account/chat" class="card bg-base-100 border hover:shadow">
      <div class="card-body">
        <h2 class="card-title">Chat</h2>
        <p class="text-sm opacity-70">Real-time conversation with AI (coming next).</p>
      </div>
    </a>

    <a href="/account/assistant" class="card bg-base-100 border hover:shadow">
      <div class="card-body">
        <h2 class="card-title">AI Assistant</h2>
        <p class="text-sm opacity-70">Agent-style tasks & tools (wiring next).</p>
      </div>
    </a>

    <a href="/account/caption" class="card bg-base-100 border hover:shadow">Tools</a>
  </div>
</div>
