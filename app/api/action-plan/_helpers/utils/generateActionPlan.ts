import {
  actionPlanSchema,
  ActionPlanSchema,
} from '@/app/[locale]/idea/[id]/_helpers/schemas/actionPlan';
import OpenAI from 'openai';

export const generateActionPlan = async (
  featureList: { title: string; priority: 'P0' | 'P1' | 'P2' }[],
  duration: 7 | 14,
  retries = 0,
): Promise<ActionPlanSchema> => {
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
    const prompt = `Given the following feature list (sorted by priority) and a ${duration}-day duration:
${JSON.stringify(sortedFeatures, null, 2)}

Generate an Action Plan in JSON format, outlining tasks for each day.
The Action Plan should contain a 'timeline', which is an array of objects.
Each object in the 'timeline' should have:
- 'day': The day number (starting from 1).
- 'task': A descriptive name for the task.

Rules for generation:
- Allocate 1 to 3 tasks per day.
- Prioritize P0 features first, then P1, then P2.
- Schedule tasks serially; no parallel tasks are allowed.
- Ensure the plan covers the full ${duration} days, distributing tasks logically.

Ensure the output is a valid JSON that strictly adheres to the following TypeScript interface:
interface ActionPlan {
  timeline: {
    day: number;
    task: string;
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
    const validatedData = actionPlanSchema.parse(jsonResponse);
    return validatedData;
  } catch (error) {
    if (retries < 2) {
      console.warn(
        `LLM JSON mode for Action Plan failed, retrying. Retry attempt ${
          retries + 1
        }`,
      );
      return generateActionPlan(featureList, duration, retries + 1); // Retry with the same data
    }
    console.error('Failed to generate Action Plan with OpenAI:', error);
    throw new Error('Failed to generate Action Plan content.');
  }
};
