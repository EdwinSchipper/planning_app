import Link from 'next/link';
import { HomeIcon, CalendarIcon, UserIcon, PowerIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Planning', href: '/dashboard/planning', icon: CalendarIcon },
    { name: 'Profiel', href: '/dashboard/profiel', icon: UserIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 font-sans overflow-hidden">
      {/* Sidebar voor desktop */}
      <aside className="w-64 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-zinc-800">
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Planning App</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <item.icon className="h-5 w-5 text-gray-400 dark:text-zinc-500 group-hover:text-blue-600" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          >
            <PowerIcon className="h-5 w-5" />
            Uitloggen
          </Link>
        </div>
      </aside>

      {/* Hoofd content gedeelte */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Simpele mobiele header */}
        <header className="md:hidden h-16 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4">
          <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Planning App</span>
          <Link href="/login" className="text-red-500 p-2">
            <PowerIcon className="h-6 w-6" />
          </Link>
        </header>

        {/* Hier wordt de actieve pagina ingeladen */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
