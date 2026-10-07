import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welkom terug</h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2">Log in op je account om verder te gaan</p>
      </div>

      <LoginForm />
    </>
  );
}
