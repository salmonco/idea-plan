import { createClient } from '@/_shared/lib/supabase/server';
import { generateActionPlan } from '@/app/api/action-plan/_helpers/utils/generateActionPlan';
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

    const { spec, duration, ideaId } = await req.json();

    // Validate incoming Spec JSON structure and duration
    if (
      !spec ||
      !Array.isArray(spec.feature_list) ||
      ![7, 14].includes(duration) ||
      !ideaId
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid Spec data, duration (must be 7 or 14), or Idea ID provided.',
        },
        { status: 400 },
      );
    }

    // Generate Action Plan using OpenAI
    const actionPlanData = await generateActionPlan(
      spec.feature_list,
      duration,
    );
    const actionPlanId = randomUUID();

    // Save Action Plan to DB
    const { data: actionPlan, error: actionPlanError } = await supabase
      .from('action_plans')
      .insert({ id: actionPlanId, idea_id: ideaId, data: actionPlanData })
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
      { actionPlan: actionPlanData, actionPlanId: actionPlan.id },
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
