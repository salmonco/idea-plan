import z from 'zod';

export const actionPlanSchema = z.object({
  markdown: z.string(),
});

export type ActionPlanSchema = z.infer<typeof actionPlanSchema>;
