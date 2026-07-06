import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  output: 'static',

  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },

  integrations: [react()],
});