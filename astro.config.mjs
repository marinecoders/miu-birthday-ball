import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react({
      experimentalReactChildren: true,
    }),
    svelte(),
  ],
  // Hosted on GitHub Pages at https://marinecoders.github.io/miu-birthday-ball/
  // With a custom domain (e.g. birthday.marines.dev), set site to it and base to '/'.
  site: 'https://marinecoders.github.io',
  base: '/miu-birthday-ball',
})
