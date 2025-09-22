<script lang="ts">
  import { TooltipProvider } from '$lib/components/ui/tooltip';
  // Prefer the barrel export first:
  import { SidebarProvider } from '$lib/components/ui/sidebar';
  // If the above import fails in your editor, use the direct path:
  // import SidebarProvider from '$lib/components/ui/sidebar/sidebar-provider.svelte';
</script>

<SidebarProvider>
  <TooltipProvider>
    <slot />
  </TooltipProvider>
</SidebarProvider>
