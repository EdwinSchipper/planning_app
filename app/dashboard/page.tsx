import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

function getStatusBadgeClasses(status: string) {
  const base = "px-2 py-0.5 rounded-md border text-xs font-medium";
  switch (status) {
    case 'Open':
      return `${base} text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800`;
    case 'In Behandeling':
      return `${base} text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800`;
    case 'Wacht op feedback':
      return `${base} text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800`;
    case 'Voltooid':
      return `${base} text-green-700 bg-green-50 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800`;
    default:
      return `${base} text-gray-700 bg-gray-100 border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700`;
  }
}

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
      .order('date_end', { ascending: true, nullsFirst: false }) // Deadlines bovenaan
      .order('created_at', { ascending: false });

    if (myTasks) {
      openTasksCount = myTasks.length;
      totalHours = myTasks.reduce((sum, task) => sum + (Number(task.estimated_hours) || 0), 0);
      deadlinesCount = myTasks.filter(task => task.date_end !== null).length;
      topTasks = myTasks.slice(0, 5); // Toon maximaal de top 5
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-[15px] text-gray-500 dark:text-zinc-400">
          Welkom terug, <span className="font-medium text-gray-900 dark:text-white">{fullName || user?.email}</span>! Je bent ingelogd als <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20">{role}</span>.
        </p>
      </div>

      {/* STATISTIEKEN */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-center">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-zinc-400">Mijn Openstaande Taken</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{openTasksCount}</dd>
        </div>

        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-center">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-zinc-400">Uren Ingeschat (Totaal)</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{totalHours.toString().replace('.', ',')}</dd>
        </div>

        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-center">
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
                <div className="flex flex-col gap-2 pr-4">
                  <Link href={`/dashboard/planning/${task.id}`} className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {task.task_title || "Naamloze Taak"}
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-zinc-500">
                    <span className={getStatusBadgeClasses(task.status || 'Open')}>{task.status || 'Open'}</span>

                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {task.date_end ? (
                        <span className="text-red-600 dark:text-red-400 font-medium">{task.date_end}</span>
                      ) : (
                        <span className="text-gray-400 dark:text-zinc-600 italic">Geen deadline</span>
                      )}
                    </span>

                    {task.estimated_hours > 0 && (
                      <>
                        <span className="text-gray-300 dark:text-zinc-700">&bull;</span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          {task.estimated_hours} uur
                        </span>
                      </>
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