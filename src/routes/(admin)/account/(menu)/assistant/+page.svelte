<script lang="ts">
  let task = '';
  let logs: string[] = [];
</script>

<div class="space-y-4">
  <h1 class="text-2xl font-semibold">AI Assistant</h1>
  <p class="text-sm opacity-70">Agent-style assistant (tool use, RAG) will be wired next.</p>

  <form class="flex gap-2" on:submit|preventDefault={() => { if (!task.trim()) return; logs = [...logs, `Queued task: ${task.trim()}`]; task=''; }}>
    <input class="input input-bordered flex-1" bind:value={task} placeholder="Describe what you need…" />
    <button class="btn btn-primary" type="submit" disabled>Run (coming soon)</button>
  </form>

  <div class="border rounded p-4 bg-base-100">
    <div class="text-xs uppercase opacity-60 mb-2">Activity</div>
    {#if logs.length === 0}
      <p class="text-sm opacity-70">No runs yet.</p>
    {/if}
    <ul class="list-disc ml-5 space-y-1">
      {#each logs as line}
        <li class="text-sm">{line}</li>
      {/each}
    </ul>
  </div>
</div>
