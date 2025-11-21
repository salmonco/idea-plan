import z from 'zod';

export const onePagerInputSchema = z.object({
  problem: z.string(),
  target: z.string(),
  hypothesis: z.string(),
  features: z.array(z.string()),
  monetization: z.string(),
  roadmap: z.array(z.string()),
});
