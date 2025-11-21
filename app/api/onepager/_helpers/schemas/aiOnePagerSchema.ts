import { z } from 'zod';

export const aiOnePagerSchema = z.object({
  Objective: z.string(),
  Background: z.string(),
  Value: z.string(),
  Principles: z.string(),
  Goals: z.string(),
  Metrics: z.string(),
  Roadmap: z.array(z.string()),
  FAQ: z.array(z.string()),
});

export type AIGeneratedOnePagerSchema = z.infer<typeof aiOnePagerSchema>;
