import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import { rehypeChecklists } from './src/lib/transforms/rehype-checklists.ts';
import { rehypeQaReveal } from './src/lib/transforms/rehype-qa-reveal.ts';
import { rehypePredict } from './src/lib/transforms/rehype-predict.ts';
import { rehypeMdLinks } from './src/lib/transforms/rehype-md-links.ts';

export default defineConfig({
  output: 'static',

  // Deployment-target knobs; unset locally and on upstream → root-served build.
  site: process.env.ASTRO_SITE,
  base: process.env.ASTRO_BASE,

  markdown: {
    shikiConfig: {
      themes: { light: 'everforest-light', dark: 'everforest-dark' },
      defaultColor: false,
    },
    rehypePlugins: [rehypeChecklists, rehypeQaReveal, rehypePredict, rehypeMdLinks],
  },

  integrations: [react()],
});