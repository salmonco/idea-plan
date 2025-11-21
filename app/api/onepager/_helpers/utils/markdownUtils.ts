import { AIGeneratedOnePagerSchema } from '@/app/api/onepager/_helpers/schemas/aiOnePagerSchema';

export const jsonToMarkdown = (data: AIGeneratedOnePagerSchema): string => {
  return `## Objective
${data.Objective}

## Background
${data.Background}

## Value
${data.Value}

## Principles
${data.Principles}

## Goals
${data.Goals}

## Metrics
${data.Metrics}

## Roadmap
${data.Roadmap.map((r) => `- ${r}`).join('\n')}

## FAQ
${data.FAQ.map((f) => `- ${f}`).join('\n')}
`;
};
