import { z } from 'zod';

export const aiSpecSchema = z.object({
  feature_list: z.array(
    z.object({
      title: z.string(),
      priority: z.enum(['P0', 'P1', 'P2']),
    }),
  ),
});

export type AISpecSchema = z.infer<typeof aiSpecSchema>;
