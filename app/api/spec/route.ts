import { createClient } from '@/_shared/lib/supabase/server';
import { generateSpec } from '@/app/api/spec/_helpers/utils/generateSpec';
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

    const { onePager, ideaId } = await req.json();

    // Validate incoming 1-Pager JSON structure
    // (A more robust validation could be added here using Zod if needed)
    if (!onePager || typeof onePager !== 'object' || !ideaId) {
      return NextResponse.json(
        { error: 'Invalid 1-Pager data or Idea ID provided.' },
        { status: 400 },
      );
    }

    // Generate Spec using OpenAI
    const specData = await generateSpec(onePager);
    const specId = randomUUID();

    // Save Spec to DB
    const { data: spec, error: specError } = await supabase
      .from('specs')
      .insert({ id: specId, idea_id: ideaId, data: specData })
      .select()
      .single();

    if (specError) {
      console.error('Error saving Spec:', specError);
      return NextResponse.json(
        { error: 'Failed to save Spec.' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { spec: specData, specId: spec.id },
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
