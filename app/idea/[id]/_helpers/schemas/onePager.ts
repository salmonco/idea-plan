import { z } from 'zod';

export const onePagerSchema = z.object({
  problem: z.string(),
  target: z.string(),
  hypothesis: z.string(),
  features: z.array(z.string()),
  monetization: z.string(),
  roadmap: z.array(z.string()),
});

export type OnePagerSchema = z.infer<typeof onePagerSchema>;
