'use client';

import { Button } from '@/_shared/components/ui/button';
import { Textarea } from '@/_shared/components/ui/textarea';
import { apiFetch } from '@/_shared/helpers/utils/apiFetch';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type OnePager = {
  id: string;
  data: {
    markdown: string;
  };
};

type Props = {
  onePager: OnePager;
};

export const MarkdownEditor = ({ onePager }: Props) => {
  const t = useTranslations('IdeaDetailPage');
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(onePager.data.markdown);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`/api/onepager/${onePager.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: content }),
      });

      if (!response.ok) {
        throw new Error(t('FailedToSaveChanges')); // Translated error
      }

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      // You might want to show an error to the user
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="font-mono"
          />
          <article className="prose rounded-md border p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setContent(onePager.data.markdown);
              setIsEditing(false);
            }}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? t('Saving') : t('Save')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end pb-4">
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          {t('Edit')}
        </Button>
      </div>
      <article className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
};
