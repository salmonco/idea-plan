import { createClient } from '@/_shared/lib/supabase/server';
import { generateOnePager } from '@/app/api/onepager/_helpers/utils/generateOnePager';
import { jsonToMarkdown } from '@/app/api/onepager/_helpers/utils/markdownUtils';
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

    const { ideaText } = await req.json();

    // Extract locale from the request URL
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split('/');
    const locale = pathnameParts[1]; // Assuming locale is always the first segment, e.g., /ko/api/onepager

    // Validate ideaText length
    if (!ideaText || ideaText.length < 10) {
      return NextResponse.json(
        { error: 'Idea must be at least 10 characters long.' },
        { status: 400 },
      );
    }

    // Basic profanity check (can be expanded)
    const profanityKeywords = ['badword1', 'badword2']; // Example keywords
    if (
      profanityKeywords.some((keyword) =>
        ideaText.toLowerCase().includes(keyword),
      )
    ) {
      return NextResponse.json(
        { error: 'Inappropriate content detected in the idea.' },
        { status: 400 },
      );
    }

    // Generate 1-Pager using OpenAI
    const onePagerData = await generateOnePager(ideaText, locale);
    const ideaId = randomUUID();

    // Save initial idea to DB
    const { error: ideaError } = await supabase
      .from('ideas')
      .insert({ id: ideaId, user_id: user.id, idea_text: ideaText });

    if (ideaError) {
      console.error('Error saving idea:', ideaError);
      return NextResponse.json(
        { error: 'Failed to save idea.' },
        { status: 500 },
      );
    }

    const onePagerId = randomUUID();
    const now = new Date().toISOString();
    const markdownContent = jsonToMarkdown(onePagerData);

    // Save 1-Pager to DB
    const { error: onePagerError } = await supabase.from('one_pagers').insert({
      id: onePagerId,
      idea_id: ideaId,
      data: { markdown: markdownContent },
      updated_at: now,
    });

    if (onePagerError) {
      console.error('Error saving 1-Pager:', onePagerError);
      return NextResponse.json(
        { error: 'Failed to save 1-Pager.' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { onePager: { markdown: markdownContent }, ideaId: ideaId },
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
