import { SPEC_GENERATION_PROMPT } from '@/app/api/onepager/_helpers/constants/prompts'; // New import
import { AIGeneratedOnePagerSchema } from '@/app/api/onepager/_helpers/schemas/aiOnePagerSchema';
import {
  AISpecSchema, // Changed from SpecSchema
  aiSpecSchema, // Changed from specSchema
} from '@/app/api/spec/_helpers/schemas/aiSpecSchema'; // Changed import path
import OpenAI from 'openai';

export const generateSpec = async (
  onePagerData: AIGeneratedOnePagerSchema,
  locale: string, // New parameter
  retries = 0,
): Promise<AISpecSchema> => {
  // Updated return type
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const languageInstruction = `Respond in ${locale === 'ko' ? 'Korean' : 'English'}.`;
    let prompt = SPEC_GENERATION_PROMPT.replace(
      '{LANGUAGE_INSTRUCTION}',
      languageInstruction,
    );
    prompt = prompt.replace(
      '{onePagerData}',
      JSON.stringify(onePagerData, null, 2),
    );

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_GPT_MODEL || 'gpt-3.5-turbo',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const jsonResponse = JSON.parse(
      response.choices[0].message.content || '{}',
    );
    const validatedData = aiSpecSchema.parse(jsonResponse); // Use aiSpecSchema
    return validatedData;
  } catch (error: unknown) {
    if (retries < 2) {
      console.warn(
        `LLM JSON mode for Spec failed, retrying. Retry attempt ${retries + 1}`,
      );
      return generateSpec(onePagerData, locale, retries + 1); // Pass locale in retry
    }
    console.error('Failed to generate Spec with OpenAI:', error);
    throw new Error('Failed to generate Spec content.');
  }
};
