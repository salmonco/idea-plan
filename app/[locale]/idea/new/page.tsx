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
import { apiFetch } from '@/_shared/helpers/utils/apiFetch';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const NewIdeaPage = () => {
  const t = useTranslations('NewIdeaPage');
  const [ideaText, setIdeaText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (ideaText.length < 10) {
      setError(t('IdeaMinLengthError')); // Translated error
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiFetch('/api/onepager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ideaText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // The error message from API might not be translated, so we use a fallback or general error
        throw new Error(errorData.error || t('FailedToCreateOnePager')); // New translation key
      }

      const result = await response.json();
      router.push(`/idea/${result.ideaId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('AnUnknownErrorOccurred'), // New translation key
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
            <CardTitle>{t('GenerateNewIdeaPlan')}</CardTitle>
            <CardDescription>{t('DescribeIdea')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-2">
              <Label htmlFor="idea">{t('YourIdea')}</Label>
              <Textarea
                id="idea"
                rows={5}
                placeholder={t('IdeaPlaceholder')}
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
              {isLoading ? t('Generating') : t('GenerateOnePager')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NewIdeaPage;
