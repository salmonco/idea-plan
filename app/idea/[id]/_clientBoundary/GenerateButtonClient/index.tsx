'use client';

import { Button } from '@/_shared/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  text: string;
  apiPath: string;
  payload: unknown;
  redirectPath: string;
  disabled: boolean;
  className?: string;
};

export const GenerateButtonClient = ({
  text,
  apiPath,
  payload,
  redirectPath,
  disabled,
  className = '',
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to generate ${text}.`);
      }

      router.push(redirectPath);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
      console.error(`Error generating ${text}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`mt-4 ${className}`}>
      <Button
        onClick={handleGenerate}
        disabled={isLoading || disabled}
        className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-lg transition-colors duration-300 hover:bg-blue-700 disabled:opacity-50">
        {isLoading ? 'Generating...' : text}
      </Button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};
