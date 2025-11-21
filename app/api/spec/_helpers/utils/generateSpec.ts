import { onePagerInputSchema } from '@/app/api/spec/_helpers/schemas/onePagerInput';
import { SpecSchema, specSchema } from '@/app/idea/[id]/_helpers/schemas/spec';
import OpenAI from 'openai';
import z from 'zod';

export const generateSpec = async (
  onePagerData: z.infer<typeof onePagerInputSchema>,
  retries = 0,
): Promise<SpecSchema> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const prompt = `Given the following 1-Pager data (JSON format):
${JSON.stringify(onePagerData, null, 2)}

Generate a detailed Specification (Spec) document in JSON format.
The Spec should contain a 'feature_list', which is an array of objects.
Each object in the 'feature_list' should have:
- 'title': A descriptive name for the feature.
- 'priority': The priority of the feature, which must be one of 'P0' (Must-have), 'P1' (Should-have), or 'P2' (Nice-to-have).

Prioritization rules:
- P0: Essential features for the core functionality.
- P1: Important features that enhance the product but are not critical for MVP.
- P2: Features that can be implemented in later stages.

Ensure the output is a valid JSON that strictly adheres to the following TypeScript interface:
interface Spec {
  feature_list: {
    title: string;
    priority: 'P0' | 'P1' | 'P2';
  }[];
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
    const validatedData = specSchema.parse(jsonResponse);
    return validatedData;
  } catch (error: unknown) {
    if (retries < 2) {
      console.warn(
        `LLM JSON mode for Spec failed, retrying. Retry attempt ${retries + 1}`,
      );
      return generateSpec(onePagerData, retries + 1); // Retry with the same data
    }
    console.error('Failed to generate Spec with OpenAI:', error);
    throw new Error('Failed to generate Spec content.');
  }
};
