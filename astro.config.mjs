// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Windows + Decap writes cause intermittent ENOENT on .astro/*.tmp renames.
      // Polling avoids the chokidar race with external file writes.
      watch: {
        usePolling: true,
        interval: 200,
      },
    },
  },
  integrations: [react()],
});
