import { generateOnePagerFallback } from '@/app/api/onepager/_helpers/utils/generateOnePagerFallback';
import {
  onePagerSchema,
  OnePagerSchema,
} from '@/app/idea/[id]/_helpers/schemas/onePager';
import OpenAI from 'openai';

export const generateOnePager = async (
  ideaText: string,
  retries = 0,
): Promise<OnePagerSchema> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const prompt = `Given the idea: "${ideaText}", generate a 1-Pager document in JSON format.
    The 1-Pager should include:
    - problem: A concise description of the problem being solved.
    - target: The target audience or user.
    - hypothesis: The core hypothesis or solution.
    - features: An array of key features.
    - monetization: How the product will generate revenue.
    - roadmap: An array of high-level roadmap items.
    
    Ensure the output is a valid JSON that strictly adheres to the following TypeScript interface:
    interface OnePager {
      problem: string;
      target: string;
      hypothesis: string;
      features: string[];
      monetization: string;
      roadmap: string[];
    }
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_GPT_MODEL || 'gpt-3.5-turbo',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const jsonResponse = JSON.parse(
      response.choices[0].message.content || '{}',
    );
    const validatedData = onePagerSchema.parse(jsonResponse);
    return validatedData;
  } catch (error) {
    if (retries < 2) {
      console.warn(
        `LLM JSON mode failed, retrying with fallback prompt. Retry attempt ${retries + 1}`,
      );
      return generateOnePagerFallback(ideaText);
    }
    console.error('Failed to generate 1-Pager with OpenAI:', error);
    throw new Error('Failed to generate 1-Pager content.');
  }
};
