<script lang="ts">
  const tools = [
    {
      href: "/account/caption/material-cost",
      title: "Material & Cost Calculator",
      desc: "Enter materials, trade discounts, and markup. Get totals + profit.",
      icon: "calc"
    },
    { href: "#", title: "Proposal Builder", desc: "Generate polished client proposals.", soon: true },
    { href: "#", title: "Job Estimation Wizard", desc: "Step-by-step job estimator.", soon: true },
    { href: "#", title: "Client Job Summary", desc: "Summarize job scope for clients.", soon: true },
    { href: "#", title: "Review Responder", desc: "Reply to reviews with one click.", soon: true },
    { href: "#", title: "Social Media Generator", desc: "Posts for FB/IG/LinkedIn.", soon: true },
    { href: "#", title: "Email Template Generator", desc: "Outreach + follow-up emails.", soon: true },
  ];

  function Icon({ name }: { name: string }) {
    // minimal inline icons; extend as needed
    if (name === "calc") {
      return (
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <line x1="8" y1="6" x2="16" y2="6"></line>
          <line x1="8" y1="10" x2="8" y2="10"></line>
          <line x1="12" y1="10" x2="12" y2="10"></line>
          <line x1="16" y1="10" x2="16" y2="10"></line>
          <line x1="8" y1="14" x2="8" y2="14"></line>
          <line x1="12" y1="14" x2="12" y2="14"></line>
          <line x1="16" y1="14" x2="16" y2="14"></line>
          <line x1="8" y1="18" x2="16" y2="18"></line>
        </svg>
      );
    }
    return (
      <svg class="h-6 w-6 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
    );
  }
</script>

<svelte:head><title>AI Tools</title></svelte:head>

<div class="max-w-6xl mx-auto p-4 space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">AI Tools</h1>
    <span class="badge badge-outline">Powered by OpenAI</span>
  </div>

  <div class="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
    {#each tools as t}
      <a
        href={t.soon ? undefined : t.href}
        class="card bg-base-100 border hover:shadow transition {t.soon ? 'pointer-events-none opacity-60' : ''}"
      >
        <div class="card-body">
          <div class="flex items-center gap-2">
            <div class="rounded-btn bg-base-200 p-2">
              {@html ''}<!-- placeholder to satisfy TS -->
              {#key t.title}<Icon name={t.icon ?? ''} />{/key}
            </div>
            <div class="font-semibold">{t.title}</div>
            {#if t.soon}<div class="badge badge-sm ml-auto">Soon</div>{/if}
          </div>
          <p class="text-sm opacity-80">{t.desc}</p>
        </div>
      </a>
    {/each}
  </div>
</div>
