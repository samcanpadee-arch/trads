import { mergeConfig, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: [
        'backups/**',
        'node_modules/**',
        'dist/**',
        '.{idea,git,cache}/**',
        '**/node_modules/**'
      ]
    }
  })
)
