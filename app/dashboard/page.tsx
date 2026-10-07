import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { CalendarIcon, TrashIcon, ChevronRightIcon, ClipboardDocumentListIcon, ClockIcon, CheckBadgeIcon, CheckIcon } from '@heroicons/react/24/outline';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { StatCard } from '@/app/ui/dashboard/stat-card';
import { StatusBadge } from '@/app/ui/status-badge';


export default async function DashboardHome() {

  // Function: Server action to delete a task
  async function deleteTaskAction(formData: FormData) {
    'use server'
    const supabase = await createClient();
    const task_id = formData.get('task_id') as string;

    // When Task ID is not available, return
    if (!task_id) return;

    // When User is not available, return
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('db_tasks').delete().eq('id', parseInt(task_id));
    if (error) {
      console.error("Fout bij verwijderen taak:", error.message);
    } else {

      // Clear the cache and fetch fresh data from the database
      // to instantly re-render the HTML for the user
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/planning');
    }
  }

  // Function: Server action to complete a task
  async function completeTaskAction(formData: FormData) {
    'use server'
    const supabase = await createClient();
    const task_id = formData.get('task_id') as string;

    // When Task ID is not available, return
    if (!task_id) return;

    // When User is not available, return
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('db_tasks').update({ status: 'Voltooid' }).eq('id', parseInt(task_id));
    if (!error) {
      await supabase.from('task_history').insert({
        task_id: parseInt(task_id),
        user_id: user.id,
        action: "Status naar 'Voltooid'"
      });

      revalidatePath('/dashboard/planning');
      revalidatePath('/dashboard');
    }
  }

  // Function: Server action to reopen a task
  async function reopenTaskAction(formData: FormData) {
    'use server'
    const supabase = await createClient();
    const task_id = formData.get('task_id') as string;

    // When Task ID is not available, return
    if (!task_id) return;

    // When User is not available, return
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('db_tasks').update({ status: 'Open' }).eq('id', parseInt(task_id));
    if (!error) {
      await supabase.from('task_history').insert({
        task_id: parseInt(task_id),
        user_id: user.id,
        action: "Status naar 'Open'"
      });

      revalidatePath('/dashboard/planning');
      revalidatePath('/dashboard');
    }
  }



  // Fetch the currently logged-in user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the associated profile (and thus the role and name)
  let role = 'user';
  let fullName = '';
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (profile) {
    role = profile.role;
    fullName = profile.full_name || '';
  }

  // 2. Calculate weekly completed tasks (Monday - Sunday)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Maandag als start van de week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - daysToSubtract);
  startOfWeek.setHours(0, 0, 0, 0);

  let completedThisWeekCount = 0;

  const { data: historyData } = await supabase
    .from('task_history')
    .select('task_id')
    .eq('user_id', user.id)
    .gte('created_at', startOfWeek.toISOString())
    .ilike('action', "%Status naar 'Voltooid'%");

  if (historyData) {
    const uniqueTaskIds = new Set(historyData.map(h => h.task_id));
    completedThisWeekCount = uniqueTaskIds.size;
  }

  // 3. Fetch all open tasks for this user
  let openTasksCount = 0;
  let totalHours = 0;
  let deadlinesCount = 0;
  let topTasks: any[] = [];

  const { data: myTasks } = await supabase
    .from('db_tasks')
    .select('id, task_title, status, type, date_start, date_end, estimated_hours')
    .eq('userID', user.id)
    .neq('is_archived', true)
    .neq('status', 'Voltooid')
    .order('date_end', { ascending: true, nullsFirst: false }) // Deadlines first
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (myTasks) {
    openTasksCount = myTasks.length;
    totalHours = myTasks.reduce((sum, task) => sum + (Number(task.estimated_hours) || 0), 0);
    deadlinesCount = myTasks.filter(task => task.date_end !== null).length;
    topTasks = myTasks.slice(0, 5); // Show maximum top 5
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-[15px] text-gray-500 dark:text-zinc-400">
          Welkom terug, <span className="font-medium text-gray-900 dark:text-white">{fullName || user?.email}</span>! Je bent ingelogd als <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20">{role}</span>.
        </p>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          title="Openstaande Taken"
          value={openTasksCount}
          icon={ClipboardDocumentListIcon}
          colorTheme="blue"
        />
        <StatCard
          title="Uren Ingeschat (Totaal)"
          value={totalHours.toString().replace('.', ',')}
          icon={ClockIcon}
          colorTheme="amber"
        />
        <StatCard
          title="Deze Week Afgerond"
          value={completedThisWeekCount}
          icon={CheckBadgeIcon}
          colorTheme="emerald"
        />
      </div>

      {/* RECENT ACTIVITY / TOP TASKS */}
      <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800">
        <div className="border-b border-gray-100 dark:border-zinc-800 px-6 py-5 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-800/20">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Mijn Prioriteiten</h3>
          <Link href="/dashboard/planning" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 cursor-pointer">
            Bekijk planning &rarr;
          </Link>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
          {topTasks.length > 0 ? (
            topTasks.map(task => {
              const isCompleted = task.status === 'Voltooid';
              return (
                <div key={task.id} className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group ${isCompleted ? 'opacity-60 bg-gray-50/50 dark:bg-zinc-900/50' : ''}`}>
                  <div className="flex items-start gap-4 flex-1 min-w-0">

                    <form action={isCompleted ? reopenTaskAction : completeTaskAction} className="shrink-0 mt-0.5">
                      <input type="hidden" name="task_id" value={task.id} />
                      <button
                        type="submit"
                        title={isCompleted ? "Taak is voltooid. Klik om te heropenen." : "Markeer als voltooid"}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${isCompleted
                          ? 'bg-green-50 text-green-600 border-green-300 hover:bg-green-100 hover:border-green-400'
                          : 'border-gray-300 dark:border-zinc-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 text-transparent hover:text-green-500'
                          }`}
                      >
                        <CheckIcon className={`w-4 h-4 stroke-[3] ${isCompleted ? 'text-green-600' : ''}`} />
                      </button>
                    </form>

                    <div className="flex-1 min-w-0">
                      <Link href={`/dashboard/planning/${task.id}`} className={`text-base font-semibold transition-colors truncate block cursor-pointer ${isCompleted ? 'text-gray-500 dark:text-zinc-500 line-through' : 'text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400'}`}>
                        {task.task_title || "Naamloze Taak"}
                      </Link>

                      <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-zinc-400">
                        <StatusBadge status={task.status || 'Open'} />

                        {task.type && (
                          <span className="font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/50 px-2 py-0.5 rounded-md border border-gray-100 dark:border-zinc-800">
                            {task.type}
                          </span>
                        )}

                        <div className="flex items-center gap-1.5 ml-1">
                          <CalendarIcon className="w-4 h-4 shrink-0 opacity-70" />
                          <span>
                            {task.date_start && !task.date_end && `Vanaf ${task.date_start}`}
                            {!task.date_start && task.date_end && <span className="text-red-600 dark:text-red-400 font-medium">Deadline: {task.date_end}</span>}
                            {task.date_start && task.date_end && `${task.date_start} - ${task.date_end}`}
                            {!task.date_start && !task.date_end && <span className="text-gray-400 dark:text-zinc-600 italic">Geen datum</span>}
                          </span>
                        </div>

                        {task.estimated_hours > 0 && (
                          <>
                            <span className="text-gray-300 dark:text-zinc-700">&bull;</span>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                              <span>{task.estimated_hours} uur</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <form action={deleteTaskAction}>
                      <input type="hidden" name="task_id" value={task.id} />
                      <button type="submit" title="Taak verwijderen" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors cursor-pointer">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </form>
                    <Link href={`/dashboard/planning/${task.id}`} title="Details bekijken" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors cursor-pointer">
                      <ChevronRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              );
            })
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