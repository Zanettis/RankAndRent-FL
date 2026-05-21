import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Gulf Blvd Concrete Works'),
    tags: z.array(z.string()).optional(),
    howToSteps: z
      .array(
        z.object({
          name: z.string(),
          text: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { blog };
