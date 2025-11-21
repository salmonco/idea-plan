import { createClient } from '@/_shared/lib/supabase/server';
import { NextResponse } from 'next/server';

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { markdown } = await req.json();
    const { id } = params;

    if (!markdown) {
      return NextResponse.json(
        { error: 'Markdown content is required.' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('action_plans')
      .update({
        data: { markdown: markdown },
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating Action Plan:', error);
      return NextResponse.json(
        { error: 'Failed to update Action Plan.' },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
};
