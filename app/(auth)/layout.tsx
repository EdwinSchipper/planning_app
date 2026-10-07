// React.ReactNode is the most flexible and recommended TypeScript type for the children prop
// because it represents anything that React can successfully render
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-zinc-800">
        {children}
      </div>
    </div>
  );
}
