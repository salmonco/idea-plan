import { AISpecSchema } from '@/app/api/spec/_helpers/schemas/aiSpecSchema';

export const jsonToMarkdown = (data: AISpecSchema): string => {
  return `## Feature List
${data.feature_list
  .map((feature) => `- **${feature.title}**: ${feature.priority}`)
  .join('\n')}
`;
};
