import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import { rehypeChecklists } from './src/lib/transforms/rehype-checklists.ts';

export default defineConfig({
  output: 'static',

  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
    rehypePlugins: [rehypeChecklists],
  },

  integrations: [react()],
});