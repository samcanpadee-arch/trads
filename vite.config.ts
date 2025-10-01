import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Make sure SSR doesn't try to bundle the ESM OpenAI SDK
  ssr: {
    external: ['openai']
  }
});
