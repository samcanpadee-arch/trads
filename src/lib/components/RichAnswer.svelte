<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown';
  import remarkGfm from 'remark-gfm';
  export let content: string = '';
</script>

<div class="prose max-w-none">
  <SvelteMarkdown source={content} remarkPlugins={[remarkGfm]} />
</div>
