import z from 'zod';

export const aiActionPlanSchema = z.object({
  timeline: z.array(
    z.object({
      day: z.number(),
      task: z.string(),
    }),
  ),
});

export type AIActionPlanSchema = z.infer<typeof aiActionPlanSchema>;
