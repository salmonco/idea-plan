import { Button } from '@/_shared/components/ui/button';
import { APP_PATH } from '@/_shared/helpers/constants/appPath';
import { Lightbulb } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-10 w-10 text-yellow-400" />
        <h1 className="text-5xl font-bold">IdeaPlan</h1>
      </div>
      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        From a spark of an idea to a full-fledged action plan. Let AI help you
        think, plan, and execute.
      </p>
      <Link href={APP_PATH.DASHBOARD}>
        <Button size="lg">Get Started</Button>
      </Link>
    </div>
  );
};

export default Page;
