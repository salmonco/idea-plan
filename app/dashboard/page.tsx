import { createClient } from '@/_shared/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
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
      <h1 className="mb-6 text-center text-3xl font-bold">My Idea Plans</h1>

      <div className="mb-4 flex justify-end">
        <Link href="/idea/new">
          <button className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white shadow-lg transition-colors duration-300 hover:bg-indigo-700">
            Create New Idea
          </button>
        </Link>
      </div>

      {ideas.length === 0 ? (
        <p className="text-center text-lg text-gray-500">
          No ideas yet. Start by creating a{' '}
          <Link href="/idea/new" className="text-indigo-600 hover:underline">
            new one
          </Link>
          !
        </p>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/idea/${idea.id}`} passHref>
              <div className="block cursor-pointer rounded-lg border border-gray-200 p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <h2 className="text-xl font-semibold">{idea.idea_text}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Created on {new Date(idea.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
