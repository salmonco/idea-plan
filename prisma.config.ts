import 'dotenv/config';
import type { PrismaConfig } from 'prisma';
import { env } from 'prisma/config';

export default {
  schema: '_shared/lib/prisma/schema.prisma',
  migrations: {
    path: '_shared/lib/prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
} satisfies PrismaConfig;
