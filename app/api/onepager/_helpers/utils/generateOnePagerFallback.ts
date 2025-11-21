import {
  onePagerSchema,
  OnePagerSchema,
} from '@/app/idea/[id]/_helpers/schemas/onePager';
import OpenAI from 'openai';

export const generateOnePagerFallback = async (
  ideaText: string,
): Promise<OnePagerSchema> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const prompt = `Given the idea: "${ideaText}", generate a 1-Pager document.
    Please structure it clearly with the following sections and provide the content for each:
    - Problem:
    - Target:
    - Hypothesis:
    - Features: (List each feature on a new line)
    - Monetization:
    - Roadmap: (List each roadmap item on a new line)
    
    Convert this structured text into a JSON object with keys: problem, target, hypothesis, features (array), monetization, roadmap (array).`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_GPT_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const textContent = response.choices[0].message.content || '';
    // Attempt to parse the text content into the desired JSON format
    // This part would ideally involve more sophisticated parsing or a secondary LLM call
    // For now, a simple attempt to find common patterns
    const problemMatch = textContent.match(/Problem: (.*)/);
    const targetMatch = textContent.match(/Target: (.*)/);
    const hypothesisMatch = textContent.match(/Hypothesis: (.*)/);
    const monetizationMatch = textContent.match(/Monetization: (.*)/);

    const featuresMatch = textContent.match(/Features:\n((?:- .*)+)/);
    const roadmapMatch = textContent.match(/Roadmap:\n((?:- .*)+)/);

    const parseList = (match: RegExpMatchArray | null) =>
      match
        ? match[1]
            .split('\n')
            .map((item) => item.replace(/^- /, '').trim())
            .filter(Boolean)
        : [];

    const jsonOutput = {
      problem: problemMatch ? problemMatch[1].trim() : 'N/A',
      target: targetMatch ? targetMatch[1].trim() : 'N/A',
      hypothesis: hypothesisMatch ? hypothesisMatch[1].trim() : 'N/A',
      features: parseList(featuresMatch),
      monetization: monetizationMatch ? monetizationMatch[1].trim() : 'N/A',
      roadmap: parseList(roadmapMatch),
    };

    const validatedData = onePagerSchema.parse(jsonOutput);
    return validatedData;
  } catch (error) {
    console.error('Failed to generate 1-Pager with OpenAI fallback:', error);
    throw new Error('Failed to generate 1-Pager content even with fallback.');
  }
};
