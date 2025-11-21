import { AIGeneratedOnePagerSchema } from '@/app/api/onepager/_helpers/schemas/aiOnePagerSchema';

export const markdownToStructuredData = (
  markdown: string,
): AIGeneratedOnePagerSchema => {
  const extractSection = (sectionName: string): string => {
    // Improved regex to handle various newline/whitespace scenarios after header
    const match = markdown.match(
      new RegExp(`## ${sectionName}\s*\n([\s\S]*?)(?=(?:\n## )|$)`, 'i'),
    );
    return match ? match[1].trim() : '';
  };

  const extractListSection = (sectionName: string): string[] => {
    const sectionContent = extractSection(sectionName);
    return sectionContent
      .split('\n')
      .map((item) => item.replace(/^- /, '').trim())
      .filter(Boolean);
  };

  return {
    Objective: extractSection('Objective'),
    Background: extractSection('Background'),
    Value: extractSection('Value'),
    Principles: extractSection('Principles'),
    Goals: extractSection('Goals'),
    Metrics: extractSection('Metrics'),
    Roadmap: extractListSection('Roadmap'),
    FAQ: extractListSection('FAQ'),
  };
};
