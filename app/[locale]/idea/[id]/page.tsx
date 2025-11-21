import { Badge } from '@/_shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/_shared/components/ui/table';
import { APP_PATH } from '@/_shared/helpers/constants/appPath';
import { createClient } from '@/_shared/lib/supabase/server';
import { GenerateButtonClient } from '@/app/[locale]/idea/[id]/_clientBoundary/GenerateButtonClient';
import { MarkdownEditor } from '@/app/[locale]/idea/[id]/_clientBoundary/MarkdownEditor';
import { actionPlanSchema } from '@/app/[locale]/idea/[id]/_helpers/schemas/actionPlan';
import { onePagerSchema } from '@/app/[locale]/idea/[id]/_helpers/schemas/onePager';
import { specSchema } from '@/app/[locale]/idea/[id]/_helpers/schemas/spec';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const IdeaDetailPage = async ({ params }: Props) => {
  const t = await getTranslations('IdeaDetailPage');

  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(APP_PATH.LOGIN);
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
        {t('FailedToLoadIdeaDetails')}
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
        {t('Idea')}: {idea.idea_text}
      </h1>

      <div className="space-y-8">
        {/* 1-Pager Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('OnePager')}</CardTitle>
          </CardHeader>
          <CardContent>
            {onePager ? (
              <MarkdownEditor onePager={onePager} />
            ) : (
              <p className="text-muted-foreground">
                {t('OnePagerNotGenerated')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Spec Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('Spec')}</CardTitle>
          </CardHeader>
          <CardContent>
            {spec ? (
              <ul className="space-y-2">
                {spec.data.feature_list.map((feature) => (
                  <li
                    key={feature.title}
                    className="flex items-center justify-between rounded-md border p-3">
                    <span className="font-medium">{feature.title}</span>
                    <Badge
                      variant={
                        feature.priority === 'P0' ? 'default' : 'secondary'
                      }>
                      {feature.priority}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <GenerateButtonClient
                text={t('GenerateSpec')}
                apiPath="/api/spec"
                payload={{ onePager: onePager?.data, ideaId: idea.id }}
                redirectPath={`/idea/${idea.id}`}
                disabled={!onePager}
              />
            )}
          </CardContent>
        </Card>

        {/* Action Plan Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('ActionPlan')}</CardTitle>
          </CardHeader>
          <CardContent>
            {actionPlan ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">{t('Day')}</TableHead>
                    <TableHead>{t('Task')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actionPlan.data.timeline.map((item) => (
                    <TableRow key={item.day}>
                      <TableCell className="font-medium">{item.day}</TableCell>
                      <TableCell>{item.task}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-wrap gap-4">
                <GenerateButtonClient
                  text={t('GenerateActionPlan7Days')}
                  apiPath="/api/action-plan"
                  payload={{ spec: spec?.data, duration: 7, ideaId: idea.id }}
                  redirectPath={`/idea/${idea.id}`}
                  disabled={!spec}
                />
                <GenerateButtonClient
                  text={t('GenerateActionPlan14Days')}
                  apiPath="/api/action-plan"
                  payload={{ spec: spec?.data, duration: 14, ideaId: idea.id }}
                  redirectPath={`/idea/${idea.id}`}
                  disabled={!spec}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IdeaDetailPage;
