'use client';

import { Button } from '@/_shared/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const NewIdeaPage = () => {
  const [ideaText, setIdeaText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (ideaText.length < 10) {
      setError('Idea must be at least 10 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/onepager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ideaText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create 1-Pager.');
      }

      const result = await response.json();
      // Redirect to the idea detail page or dashboard after successful creation
      router.push(`/idea/${result.ideaId}`); // Assuming the API returns ideaId
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      console.error('Error creating 1-Pager:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Generate New Idea Plan
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="idea"
            className="mb-2 block text-lg font-medium text-gray-700">
            Your Idea
          </label>
          <textarea
            id="idea"
            rows={5}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            placeholder="e.g., '카페에서 일하는 알바생을 위한 레시피 암기 앱'"
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            disabled={isLoading}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <Button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-lg font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          disabled={isLoading}>
          {isLoading ? 'Generating 1-Pager...' : 'Generate 1-Pager'}
        </Button>
      </form>
    </div>
  );
};

export default NewIdeaPage;
