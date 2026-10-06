import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function DashboardHome() {
  const supabase = await createClient();
  
  // Haal de huidige ingelogde gebruiker op
  const { data: { user } } = await supabase.auth.getUser();
  
  // Haal het bijbehorende profiel (en dus de rol en naam) op
  let role = 'user';
  let fullName = '';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();
      
    if (profile) {
      role = profile.role;
      fullName = profile.full_name || '';
    }
  }

  // 2. Haal alle openstaande taken op voor deze gebruiker
  let openTasksCount = 0;
  let totalHours = 0;
  let deadlinesCount = 0;
  let topTasks: any[] = [];

  if (user) {
    const { data: myTasks } = await supabase
      .from('db_tasks')
      .select('*')
      .eq('userID', user.id)
      .neq('is_archived', true)
      .neq('status', 'Voltooid')
      .order('date_end', { ascending: true, nullsLast: true }) // Deadlines bovenaan
      .order('created_at', { ascending: false });

    if (myTasks) {
      openTasksCount = myTasks.length;
      totalHours = myTasks.reduce((sum, task) => sum + (Number(task.estimated_hours) || 0), 0);
      deadlinesCount = myTasks.filter(task => task.date_end !== null).length;
      topTasks = myTasks.slice(0, 5); // Toon maximaal de top 5
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
          Welkom terug, <span className="font-medium text-gray-900 dark:text-white">{fullName || user?.email}</span>! Je bent ingelogd als <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20">{role}</span>.
        </p>
      </div>

      {/* STATISTIEKEN */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-zinc-400">Mijn Openstaande Taken</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{openTasksCount}</dd>
        </div>
        
        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-zinc-400">Uren Ingeschat (Totaal)</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{totalHours.toString().replace('.', ',')}</dd>
        </div>

        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-zinc-400">Taken met Deadline</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{deadlinesCount}</dd>
        </div>
      </div>

      {/* RECENTE ACTIVITEIT / TOP TAKEN */}
      <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800">
        <div className="border-b border-gray-100 dark:border-zinc-800 px-6 py-5 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-800/20">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Mijn Prioriteiten (Top 5)</h3>
          <Link href="/dashboard/planning" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Bekijk planning &rarr;
          </Link>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
          {topTasks.length > 0 ? (
            topTasks.map(task => (
              <div key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                <div className="flex flex-col gap-1 pr-4">
                  <Link href={`/dashboard/planning/${task.id}`} className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {task.task_title || "Naamloze Taak"}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-zinc-500">
                    <span className="font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">{task.status || 'Open'}</span>
                    {task.date_end && (
                      <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {task.date_end}
                      </span>
                    )}
                    {task.estimated_hours > 0 && (
                      <span>{task.estimated_hours} uur</span>
                    )}
                  </div>
                </div>
                
                <Link href={`/dashboard/planning/${task.id}`} className="shrink-0 p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-500 dark:text-zinc-400">Je hebt momenteel geen openstaande taken op je naam staan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}