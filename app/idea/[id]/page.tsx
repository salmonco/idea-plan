import { createClient } from '@/_shared/lib/supabase/server';
import { GenerateButtonClient } from '@/app/idea/[id]/_clientBoundary/GenerateButtonClient';
import { actionPlanSchema } from '@/app/idea/[id]/_helpers/schemas/actionPlan';
import { onePagerSchema } from '@/app/idea/[id]/_helpers/schemas/onePager';
import { specSchema } from '@/app/idea/[id]/_helpers/schemas/spec';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const IdeaDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: ideaData, error: ideaError } = await supabase
    .from('ideas')
    .select(
      `
      id, idea_text, created_at,
      one_pagers (id, data, created_at),
      specs (id, data, created_at),
      action_plans (id, data, created_at)
    `,
    )
    .eq('id', id)
    .single();

  if (ideaError || !ideaData) {
    console.error('Error fetching idea details:', ideaError);
    return (
      <div className="mt-8 text-center text-red-500">
        Failed to load idea details.
      </div>
    );
  }

  const idea = ideaData;
  const onePager = ideaData.one_pagers[0]
    ? {
        ...ideaData.one_pagers[0],
        data: onePagerSchema.parse(ideaData.one_pagers[0].data),
      }
    : null;
  const spec = ideaData.specs[0]
    ? { ...ideaData.specs[0], data: specSchema.parse(ideaData.specs[0].data) }
    : null;
  const actionPlan = ideaData.action_plans[0]
    ? {
        ...ideaData.action_plans[0],
        data: actionPlanSchema.parse(ideaData.action_plans[0].data),
      }
    : null;

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Idea: {idea.idea_text}
      </h1>

      <div className="space-y-8">
        {/* 1-Pager Section */}
        <div className="rounded-lg border p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold">1-Pager</h2>
          {onePager ? (
            <div className="space-y-3">
              <p>
                <strong>Problem:</strong> {onePager.data.problem}
              </p>
              <p>
                <strong>Target:</strong> {onePager.data.target}
              </p>
              <p>
                <strong>Hypothesis:</strong> {onePager.data.hypothesis}
              </p>
              <p>
                <strong>Features:</strong>{' '}
                {onePager.data.features.map((f: string) => (
                  <span key={f}>{f}, </span>
                ))}
              </p>
              <p>
                <strong>Monetization:</strong> {onePager.data.monetization}
              </p>
              <p>
                <strong>Roadmap:</strong>{' '}
                {onePager.data.roadmap.map((r: string) => (
                  <span key={r}>{r}, </span>
                ))}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">1-Pager not generated yet.</p>
          )}
        </div>

        {/* Spec Section */}
        <div className="rounded-lg border p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold">Specification</h2>
          {spec ? (
            <div>
              {spec.data.feature_list.map((feature) => (
                <p key={feature.title}>
                  <strong>{feature.title}</strong>: {feature.priority}
                </p>
              ))}
            </div>
          ) : (
            <GenerateButtonClient
              text="Generate Spec"
              apiPath="/api/spec"
              payload={{ onePager: onePager?.data, ideaId: idea.id }}
              redirectPath={`/idea/${idea.id}`}
              disabled={!onePager}
            />
          )}
        </div>

        {/* Action Plan Section */}
        <div className="rounded-lg border p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold">Action Plan</h2>
          {actionPlan ? (
            <div>
              {actionPlan.data.timeline.map((item) => (
                <p key={item.day}>
                  <strong>Day {item.day}</strong>: {item.task}
                </p>
              ))}
            </div>
          ) : (
            <GenerateButtonClient
              text="Generate Action Plan (7 Days)"
              apiPath="/api/action-plan"
              payload={{ spec: spec?.data, duration: 7, ideaId: idea.id }}
              redirectPath={`/idea/${idea.id}`}
              disabled={!spec}
            />
          )}
          {!actionPlan && (
            <GenerateButtonClient
              text="Generate Action Plan (14 Days)"
              apiPath="/api/action-plan"
              payload={{ spec: spec?.data, duration: 14, ideaId: idea.id }}
              redirectPath={`/idea/${idea.id}`}
              disabled={!spec}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailPage;
