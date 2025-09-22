<script lang="ts">
  // Use the wrapper that came with the template
  import { TooltipProvider } from '$lib/components/ui/tooltip';
</script>

<TooltipProvider>
  <slot />
</TooltipProvider>
