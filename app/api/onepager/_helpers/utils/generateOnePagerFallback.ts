import { ONE_PAGER_FALLBACK_PROMPT } from '@/app/api/onepager/_helpers/constants/prompts';
import {
  AIGeneratedOnePagerSchema,
  aiOnePagerSchema,
} from '@/app/api/onepager/_helpers/schemas/aiOnePagerSchema';
import OpenAI from 'openai';

export const generateOnePagerFallback = async (
  ideaText: string,
  locale: string, // New parameter
): Promise<AIGeneratedOnePagerSchema> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const languageInstruction = `Respond in ${locale === 'ko' ? 'Korean' : 'English'}.`;
    let prompt = ONE_PAGER_FALLBACK_PROMPT.replace(
      '{LANGUAGE_INSTRUCTION}',
      languageInstruction,
    );
    prompt = prompt.replace('{ideaText}', ideaText);

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_GPT_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const textContent = response.choices[0].message.content || '';

    // Improved regex patterns for robustness
    const objectiveMatch = textContent.match(/Objective:\s*(.*)/i);
    const backgroundMatch = textContent.match(/Background:\s*(.*)/i);
    const valueMatch = textContent.match(/Value:\s*(.*)/i);
    const principlesMatch = textContent.match(/Principles:\s*(.*)/i);
    const goalsMatch = textContent.match(/Goals:\s*(.*)/i);
    const metricsMatch = textContent.match(/Metrics:\s*(.*)/i);

    const roadmapMatch = textContent.match(/Roadmap:\n((?:- .*\n?)+)/i);
    const faqMatch = textContent.match(/FAQ:\n((?:- .*\n?)+)/i);

    // Default to empty array for lists if no match, otherwise parse
    const roadmapList = roadmapMatch
      ? roadmapMatch[1]
          .split('\n')
          .map((item) => item.replace(/^- /, '').trim())
          .filter(Boolean)
      : [];
    const faqList = faqMatch
      ? faqMatch[1]
          .split('\n')
          .map((item) => item.replace(/^- /, '').trim())
          .filter(Boolean)
      : [];

    const structuredData = {
      Objective: objectiveMatch ? objectiveMatch[1].trim() : '',
      Background: backgroundMatch ? backgroundMatch[1].trim() : '',
      Value: valueMatch ? valueMatch[1].trim() : '',
      Principles: principlesMatch ? principlesMatch[1].trim() : '',
      Goals: goalsMatch ? goalsMatch[1].trim() : '',
      Metrics: metricsMatch ? metricsMatch[1].trim() : '',
      Roadmap: roadmapList,
      FAQ: faqList,
    };

    const validatedData = aiOnePagerSchema.parse(structuredData);
    return validatedData;
  } catch (error) {
    console.error('Failed to generate 1-Pager with OpenAI fallback:', error);
    throw new Error('Failed to generate 1-Pager content even with fallback.');
  }
};
