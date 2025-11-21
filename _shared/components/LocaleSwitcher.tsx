'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_shared/components/ui/select';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

export const LocaleSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Header');

  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <Select
      onValueChange={onSelectChange}
      defaultValue={locale}
      disabled={isPending}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder={t('Language')} />{' '}
        {/* Placeholder for language */}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ko">한국어</SelectItem>
      </SelectContent>
    </Select>
  );
};
