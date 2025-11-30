<script lang="ts">
  import Chat from "$lib/components/chat.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>Smart Chat</title>
</svelte:head>

<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
  <header class="rounded-3xl border border-amber-200/70 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-6 py-8 shadow-sm">
    <p class="text-sm font-semibold uppercase tracking-wide text-amber-700">Conversations</p>
    <h1 class="mt-2 text-3xl font-bold leading-tight text-gray-900">Smart Chat</h1>
    <p class="mt-3 max-w-3xl text-base text-gray-700">
      Bounce site dramas, quoting curveballs, and client replies off an assistant that speaks tradie. Smart Chat keeps the full
      thread, offers next steps, and hands back wording you can paste straight into texts, emails, or the job log.
    </p>
  </header>

  <div class="rounded-3xl border border-gray-200 bg-white/95 p-0 shadow-sm sm:p-2">
    <Chat chat={undefined} initialMessages={[]} readonly={false} user={data.user} />
  </div>
</section>
