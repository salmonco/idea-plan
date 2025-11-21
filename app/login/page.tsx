import { GoogleLoginButtonClient } from '@/app/login/_clientBoundary/GoogleLoginButtonClient';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="mb-4 text-4xl font-bold">Welcome to IdeaPlan</h1>
      <GoogleLoginButtonClient />
    </div>
  );
};

export default LoginPage;
