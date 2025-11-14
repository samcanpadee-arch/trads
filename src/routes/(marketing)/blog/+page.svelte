<script lang="ts">
  import { sortedBlogPosts, blogInfo } from "./posts"
</script>

<svelte:head>
  <title>{blogInfo.name}</title>
  <meta name="description" content="Our blog posts." />
</svelte:head>

<div class="bg-gradient-to-b from-amber-50 via-white to-slate-50 text-slate-900">
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-60"
      style="background: radial-gradient(circle at 20% 10%, rgba(251, 191, 36, 0.35), transparent 45%),
        radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.2), transparent 55%),
        radial-gradient(circle at 50% 100%, rgba(248, 187, 208, 0.2), transparent 55%);"
    ></div>
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
      <div class="flex items-center justify-center gap-3 text-4xl font-bold">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-rose-500">{blogInfo.name}</span>
        <a href="/blog/rss.xml" target="_blank" rel="noreferrer" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 shadow">
          <img class="h-4 w-4" src="/images/rss.svg" alt="rss feed" />
        </a>
      </div>
      <p class="text-lg text-slate-700">A demo blog with sample content.</p>
      <div class="mx-auto mt-6 rounded-[32px] border border-dashed border-amber-200 bg-white/80 p-8 text-sm font-medium text-amber-500">
        Blog hero image placeholder — drop your latest feature shot or customer photo here
      </div>
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
            <div class="md:w-1/3 border-t md:border-t-0 md:border-l border-dashed border-amber-200 flex items-center justify-center p-6 text-sm font-medium text-amber-500">
              Image placeholder — drop blog artwork here
            </div>
          </div>
        </a>
      {/each}
    </div>
  </section>
</div>
