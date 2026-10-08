import Link from 'next/link';
import { HomeIcon, CalendarIcon, UserIcon, ArrowRightOnRectangleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { logout } from '@/app/(auth)/login/actions';
import { createClient } from '@/utils/supabase/server';
import StoreInitializer from '@/store/store-initializer';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigation = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Planning', href: '/dashboard/planning', icon: CalendarIcon },
    { name: 'Profiel', href: '/dashboard/profiel', icon: UserIcon },
  ];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch all tasks globally for the logged-in user
  let tasks: any[] = [];
  if (user) {
    const { data } = await supabase
      .from('db_tasks')
      .select('*')
      .neq('is_archived', true)
      .order('date_end', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });
    tasks = data || [];
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 font-sans overflow-hidden">
      {/* Instantly populates the Zustand store for ALL pages in the dashboard */}
      <StoreInitializer tasks={tasks} />
      
      {/* Sidebar for desktop */}
      <aside className="w-64 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:flex flex-col">
        <div className="h-16 px-6 border-b border-gray-200 dark:border-zinc-800 flex items-center">
          <Link href="/" className="flex items-center gap-2 outline-none">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <CalendarDaysIcon className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Planning App</span>
          </Link>
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
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all text-left group cursor-pointer active:scale-[0.98]"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              Uitloggen
            </button>
          </form>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        {/* Simple mobile header */}
        <header className="md:hidden h-16 shrink-0 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 outline-none">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg active:scale-95 transition-transform">
              <CalendarDaysIcon className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Planning App</span>
          </Link>
          <form action={logout}>
            <button 
              type="submit" 
              title="Uitloggen"
              className="flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer outline-none active:scale-90"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
            </button>
          </form>
        </header>

        {/* Active page content is loaded here */}
        <div className="flex-1 overflow-auto px-5 py-8 sm:p-8 md:p-10 lg:p-12">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-around z-50 px-2 pb-[env(safe-area-inset-bottom)]">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full text-[10px] font-medium text-gray-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
            >
              <item.icon className="h-6 w-6 mb-0.5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
