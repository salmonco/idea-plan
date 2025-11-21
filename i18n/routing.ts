import { defineRouting } from 'next-intl/routing';

const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ko', 'en'],

  // Used when no locale matches
  defaultLocale: 'ko',
});

export default routing;
