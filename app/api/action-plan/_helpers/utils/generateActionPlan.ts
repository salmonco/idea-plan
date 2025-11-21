import {
  AIActionPlanSchema, // Changed from ActionPlanSchema
  aiActionPlanSchema, // Changed from actionPlanSchema
} from '@/app/api/action-plan/_helpers/schemas/aiActionPlanSchema'; // Changed import path
import { ACTION_PLAN_GENERATION_PROMPT } from '@/app/api/onepager/_helpers/constants/prompts'; // New import
import OpenAI from 'openai';

export const generateActionPlan = async (
  featureList: { title: string; priority: 'P0' | 'P1' | 'P2' }[],
  duration: 7 | 14,
  locale: string, // New parameter
  retries = 0,
): Promise<AIActionPlanSchema> => {
  // Updated return type
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Sort features by priority: P0 first, then P1, then P2
  const sortedFeatures = [...featureList].sort((a, b) => {
    const priorityOrder: Record<'P0' | 'P1' | 'P2', number> = {
      P0: 0,
      P1: 1,
      P2: 2,
    };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  try {
    const languageInstruction = `Respond in ${locale === 'ko' ? 'Korean' : 'English'}.`;
    let prompt = ACTION_PLAN_GENERATION_PROMPT.replace(
      '{LANGUAGE_INSTRUCTION}',
      languageInstruction,
    );
    prompt = prompt.replace(
      '{featureList}',
      JSON.stringify(sortedFeatures, null, 2),
    );
    prompt = prompt.replace('{duration}', duration.toString());

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_GPT_MODEL || 'gpt-3.5-turbo',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const jsonResponse = JSON.parse(
      response.choices[0].message.content || '{}',
    );
    const validatedData = aiActionPlanSchema.parse(jsonResponse); // Use aiActionPlanSchema
    return validatedData;
  } catch (error) {
    if (retries < 2) {
      console.warn(
        `LLM JSON mode for Action Plan failed, retrying. Retry attempt ${
          retries + 1
        }`,
      );
      return generateActionPlan(featureList, duration, locale, retries + 1); // Pass locale in retry
    }
    console.error('Failed to generate Action Plan with OpenAI:', error);
    throw new Error('Failed to generate Action Plan content.');
  }
};
