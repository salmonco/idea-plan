import { z } from 'zod';

export const onePagerSchema = z.object({
  markdown: z.string(),
});

export type OnePagerSchema = z.infer<typeof onePagerSchema>;
