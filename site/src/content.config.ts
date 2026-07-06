import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../web-dev-interview-playbook' }),
  schema: z
    .object({
      status: z.literal('updating').optional(),
    })
    .passthrough(),
});

export const collections = { docs };
