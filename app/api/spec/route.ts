import { createClient } from '@/_shared/lib/supabase/server';
import { markdownToStructuredData } from '@/app/api/onepager/_helpers/utils/markdownToStructuredData'; // New import
import { generateSpec } from '@/app/api/spec/_helpers/utils/generateSpec';
import { jsonToMarkdown } from '@/app/api/spec/_helpers/utils/specMarkdownUtils'; // New import
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

    const { onePagerMarkdown, ideaId } = await req.json(); // Changed input

    // Extract locale from the request URL
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split('/');
    const locale = pathnameParts[1]; // Assuming locale is always the first segment

    // Validate incoming markdown and ideaId
    if (!onePagerMarkdown || typeof onePagerMarkdown !== 'string' || !ideaId) {
      return NextResponse.json(
        { error: 'Invalid 1-Pager markdown data or Idea ID provided.' }, // Updated error message
        { status: 400 },
      );
    }

    // Convert markdown to structured data for generateSpec
    const onePagerStructuredData = markdownToStructuredData(onePagerMarkdown);

    // Generate Spec using OpenAI
    const specData = await generateSpec(onePagerStructuredData, locale); // Pass structured data
    const specId = randomUUID();

    // Convert to Markdown
    const markdownContent = jsonToMarkdown(specData);

    // Save Spec to DB
    const { data: spec, error: specError } = await supabase
      .from('specs')
      .insert({
        id: specId,
        idea_id: ideaId,
        data: { markdown: markdownContent },
      }) // Save as markdown
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
      { spec: { markdown: markdownContent }, specId: spec.id }, // Update response
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
