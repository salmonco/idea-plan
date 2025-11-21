import { AISpecSchema } from '@/app/api/spec/_helpers/schemas/aiSpecSchema';

export const markdownToStructuredData = (markdown: string): AISpecSchema => {
  const features: { title: string; priority: 'P0' | 'P1' | 'P2' }[] = [];

  const featureListBlockMatch = markdown.match(
    /## Feature List\s*\n([\s\S]*)/i,
  ); // Added \s*
  if (featureListBlockMatch && featureListBlockMatch[1]) {
    const lines = featureListBlockMatch[1].split('\n').filter(Boolean);
    lines.forEach((line) => {
      // More robust regex for parsing each feature line
      const match = line.match(/^[*-]?\s*\*\*(.*?)\*\*\s*\((P0|P1|P2)\)/i); // Allows * or - for bullet, optional bold for title, and (P0) priority
      if (match) {
        features.push({
          title: match[1].trim(),
          priority: match[2].toUpperCase() as 'P0' | 'P1' | 'P2', // Ensure uppercase priority
        });
      }
    });
  }

  return {
    feature_list: features,
  };
};
