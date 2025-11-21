import { AIActionPlanSchema } from '@/app/api/action-plan/_helpers/schemas/aiActionPlanSchema';

export const jsonToMarkdown = (data: AIActionPlanSchema): string => {
  return `## Action Plan Timeline
${data.timeline.map((item) => `- Day ${item.day}: ${item.task}`).join('\n')}
`;
};
