import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../web-dev-interview-playbook' }),
  schema: z
    .object({
      status: z.string().optional(),
    })
    .passthrough()
    .catch({}),
});

export const collections = { docs };
