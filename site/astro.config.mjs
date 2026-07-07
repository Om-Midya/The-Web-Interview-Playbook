import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import { rehypeChecklists } from './src/lib/transforms/rehype-checklists.ts';
import { rehypeQaReveal } from './src/lib/transforms/rehype-qa-reveal.ts';
import { rehypePredict } from './src/lib/transforms/rehype-predict.ts';

export default defineConfig({
  output: 'static',

  markdown: {
    shikiConfig: {
      themes: { light: 'everforest-light', dark: 'everforest-dark' },
      defaultColor: false,
    },
    rehypePlugins: [rehypeChecklists, rehypeQaReveal, rehypePredict],
  },

  integrations: [react()],
});