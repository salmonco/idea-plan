import { createClient } from '@/_shared/lib/supabase/server';
import { jsonToMarkdown } from '@/app/api/action-plan/_helpers/utils/actionPlanMarkdownUtils'; // New import
import { generateActionPlan } from '@/app/api/action-plan/_helpers/utils/generateActionPlan';
import { markdownToStructuredData as specMarkdownToStructuredData } from '@/app/api/spec/_helpers/utils/specMarkdownToStructuredData'; // New import
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { specMarkdown, duration, ideaId } = await req.json(); // Changed to specMarkdown

    // Extract locale from the request URL
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split('/');
    const locale = pathnameParts[1]; // Assuming locale is always the first segment

    // Validate incoming Spec markdown structure and duration
    if (
      !specMarkdown || // Check specMarkdown directly
      typeof specMarkdown !== 'string' ||
      ![7, 14].includes(duration) ||
      !ideaId
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid Spec markdown data, duration (must be 7 or 14), or Idea ID provided.',
        },
        { status: 400 },
      );
    }

    // Convert Spec markdown to structured data for generateActionPlan
    const structuredSpec = specMarkdownToStructuredData(specMarkdown); // Pass specMarkdown

    // Generate Action Plan using OpenAI
    const actionPlanData = await generateActionPlan(
      structuredSpec.feature_list, // Pass structured feature_list
      duration,
      locale, // Pass locale
    );
    const actionPlanId = randomUUID();

    // Convert to Markdown
    const markdownContent = jsonToMarkdown(actionPlanData);

    // Save Action Plan to DB
    const { data: actionPlan, error: actionPlanError } = await supabase
      .from('action_plans')
      .insert({
        id: actionPlanId,
        idea_id: ideaId,
        data: { markdown: markdownContent },
      }) // Save as markdown
      .select()
      .single();

    if (actionPlanError) {
      console.error('Error saving Action Plan:', actionPlanError);
      return NextResponse.json(
        { error: 'Failed to save Action Plan.' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        actionPlan: { markdown: markdownContent },
        actionPlanId: actionPlan.id,
      }, // Update response
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
};
