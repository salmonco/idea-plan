import { z } from 'zod';

export const specSchema = z.object({
  feature_list: z.array(
    z.object({
      title: z.string(),
      priority: z.enum(['P0', 'P1', 'P2']),
    }),
  ),
});

export type SpecSchema = z.infer<typeof specSchema>;
