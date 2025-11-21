import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_shared/components/ui/card';
import { GoogleLoginButtonClient } from '@/app/login/_clientBoundary/GoogleLoginButtonClient';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to IdeaPlan</CardTitle>
          <CardDescription>
            Sign in to continue to your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <GoogleLoginButtonClient />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
