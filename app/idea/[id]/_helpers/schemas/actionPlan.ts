import z from 'zod';

export const actionPlanSchema = z.object({
  timeline: z.array(
    z.object({
      day: z.number(),
      task: z.string(),
    }),
  ),
});

export type ActionPlanSchema = z.infer<typeof actionPlanSchema>;
