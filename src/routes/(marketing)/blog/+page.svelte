<script lang="ts">
  import { sortedBlogPosts, blogInfo } from "./posts"
</script>

<svelte:head>
  <title>{blogInfo.name}</title>
  <meta name="description" content={blogInfo.description} />
</svelte:head>

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 text-slate-900">
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-60"
      style="background: radial-gradient(circle at 20% 10%, rgba(251, 191, 36, 0.35), transparent 45%),
        radial-gradient(circle at 80% 0%, rgba(198, 172, 255, 0.25), transparent 55%),
        radial-gradient(circle at 50% 100%, rgba(248, 187, 208, 0.2), transparent 55%);"
    ></div>
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-5">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Insights for tradies</p>
      <div class="flex flex-col items-center gap-4">
        <h1 class="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">{blogInfo.name}</h1>
        <a href="/blog/rss.xml" target="_blank" rel="noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 shadow">
          <img class="h-4 w-4" src="/images/rss.svg" alt="rss feed" />
        </a>
      </div>
      <p class="text-lg text-slate-700 max-w-3xl mx-auto">{blogInfo.description}</p>
      <p class="text-base text-slate-600 max-w-3xl mx-auto">
        Field-tested stories on Smart Chat, Smart Assistant, and Smart Tools so your team can document jobs faster,
        price work with confidence, and keep every client touchpoint on-brand.
      </p>
    </div>
  </section>

  <section class="py-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {#each sortedBlogPosts as post}
        <a
          href={post.link}
          class="block rounded-[28px] border border-slate-200 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="flex flex-col md:flex-row">
            <div class="md:w-2/3 p-6 space-y-2">
              <p class="text-xs uppercase tracking-[0.3em] text-amber-600">{blogInfo.name}</p>
              <h2 class="text-2xl font-semibold">{post.title}</h2>
              <p class="text-sm text-slate-500">
                {post.parsedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p class="text-slate-600">{post.description}</p>
            </div>
            <div class="md:w-1/3 border-t md:border-t-0 md:border-l border-dashed border-amber-200 flex items-center justify-center p-6 text-sm font-medium text-amber-500 text-center">
              Read the playbook →
            </div>
          </div>
        </a>
      {/each}
    </div>
  </section>
</div>
