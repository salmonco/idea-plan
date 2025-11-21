import { ONE_PAGER_GENERATION_PROMPT } from '@/app/api/onepager/_helpers/constants/prompts';
import {
  AIGeneratedOnePagerSchema,
  aiOnePagerSchema,
} from '@/app/api/onepager/_helpers/schemas/aiOnePagerSchema';
import { generateOnePagerFallback } from '@/app/api/onepager/_helpers/utils/generateOnePagerFallback';
import OpenAI from 'openai';

export const generateOnePager = async (
  ideaText: string,
  locale: string, // New parameter
  retries = 0,
): Promise<AIGeneratedOnePagerSchema> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const languageInstruction = `Respond in ${locale === 'ko' ? 'Korean' : 'English'}.`;
    let prompt = ONE_PAGER_GENERATION_PROMPT.replace(
      '{LANGUAGE_INSTRUCTION}',
      languageInstruction,
    );
    prompt = prompt.replace('{ideaText}', ideaText);

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_GPT_MODEL || 'gpt-3.5-turbo',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const jsonResponse = JSON.parse(
      response.choices[0].message.content || '{}',
    );
    const validatedData = aiOnePagerSchema.parse(jsonResponse);
    return validatedData;
  } catch (error) {
    if (retries < 2) {
      console.warn(
        `LLM JSON mode failed, retrying with fallback prompt. Retry attempt ${retries + 1}`,
      );
      return generateOnePagerFallback(ideaText, locale); // Pass locale to fallback
    }
    console.error('Failed to generate 1-Pager with OpenAI:', error);
    throw new Error('Failed to generate 1-Pager content.');
  }
};
