'use client';

import { Button } from '@/_shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/_shared/components/ui/card';
import { Label } from '@/_shared/components/ui/label';
import { Textarea } from '@/_shared/components/ui/textarea';
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
      router.push(`/idea/${result.ideaId}`);
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
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Generate New Idea Plan</CardTitle>
            <CardDescription>
              {`Start by describing your idea. We'll generate a 1-Pager to get
              you started.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-2">
              <Label htmlFor="idea">Your Idea</Label>
              <Textarea
                id="idea"
                rows={5}
                placeholder="e.g., 'An app for cafe baristas to memorize recipes'"
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                disabled={isLoading}
                className={error ? 'border-red-500' : ''}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full text-lg"
              disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate 1-Pager'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NewIdeaPage;
