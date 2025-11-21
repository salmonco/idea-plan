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
import Link from 'next/link';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(APP_PATH.LOGIN);
  }

  const { data: ideas, error } = await supabase
    .from('ideas')
    .select('id, idea_text, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ideas:', error);
    return (
      <div className="mt-8 text-center text-red-500">Failed to load ideas.</div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Idea Plans</h1>
        <Link href={APP_PATH.NEW_IDEA}>
          <Button>Create New Idea</Button>
        </Link>
      </div>

      {ideas.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-lg">No ideas yet.</p>
              <Link href={APP_PATH.NEW_IDEA}>
                <Button variant="link">Create your first one!</Button>
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
                    Created on {new Date(idea.created_at).toLocaleDateString()}
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
