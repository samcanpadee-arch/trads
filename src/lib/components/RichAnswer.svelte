<script lang="ts">
  import { marked } from 'marked';

  export let text: string = "";

  // marked config — safe defaults
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  $: html = marked.parse(text || "");
</script>

<!--
  NOTE: We trust our own backend output, but if you ever allow 3rd-party content,
  consider sanitizing `html` before injecting.
-->
<div class="prose max-w-none leading-relaxed text-base [&_h1]:text-xl [&_h2]:text-lg [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-base-200">
  {@html html}
</div>
