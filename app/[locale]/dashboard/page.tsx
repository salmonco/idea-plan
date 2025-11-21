import { Button } from '@/_shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_shared/components/ui/card';
import { APP_PATH } from '@/_shared/helpers/constants/appPath';
import { createClient } from '@/_shared/lib/supabase/server';
import { Link, redirect } from '@/i18n/navigation';
import { getLocale, getTranslations } from 'next-intl/server';

const DashboardPage = async () => {
  const locale = await getLocale();
  const t = await getTranslations('DashboardPage');
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: APP_PATH.LOGIN, locale });
    return;
  }

  const { data: ideas, error } = await supabase
    .from('ideas')
    .select('id, idea_text, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ideas:', error);
    return (
      <div className="mt-8 text-center text-red-500">
        {t('FailedToLoadIdeas')}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('MyIdeaPlans')}</h1>
        <Link href={APP_PATH.NEW_IDEA}>
          <Button>{t('CreateNewIdea')}</Button>
        </Link>
      </div>

      {ideas.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-lg">{t('NoIdeasYet')}</p>
              <Link href={APP_PATH.NEW_IDEA}>
                <Button variant="link">{t('CreateFirstOne')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/idea/${idea.id}`} passHref>
              <Card className="cursor-pointer transition-shadow duration-200 hover:shadow-md">
                <CardHeader>
                  <CardTitle>{idea.idea_text}</CardTitle>
                  <CardDescription>
                    {t('CreatedOn')}{' '}
                    {new Date(idea.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
