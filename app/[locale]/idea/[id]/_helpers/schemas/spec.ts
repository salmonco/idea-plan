import { z } from 'zod';

export const specSchema = z.object({
  markdown: z.string(),
});

export type SpecSchema = z.infer<typeof specSchema>;
