import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { PlusIcon, CalendarIcon, ClipboardDocumentListIcon, TrashIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { StatusBadge } from '@/app/ui/status-badge';

// We definiëren hier de structuur van een taak zoals hij in je database staat
interface Task {
  id: number;
  task_title: string;
  task_content?: string;
  status: string;
  type: string;
  date_start?: string | null;
  date_end?: string | null;
  estimated_hours?: number;
  userID: string;
}

function isThisWeek(dateString?: string | null) {
  if (!dateString) return false;
  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dayOfWeek = today.getDay(); 
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + daysUntilSunday);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return targetDate <= endOfWeek;
}

export default async function PlanningPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Server action to delete a task
  async function deleteTaskAction(formData: FormData) {
    'use server'
    const supabase = await createClient();
    const task_id = formData.get('task_id') as string;
    
    if (!task_id) return;
    
    const { error } = await supabase.from('db_tasks').delete().eq('id', parseInt(task_id));
    if (error) {
      console.error("Fout bij verwijderen taak:", error.message);
    } else {
      revalidatePath('/dashboard/planning');
    }
  }

  // Server action to complete a task
  async function completeTaskAction(formData: FormData) {
    'use server'
    const supabase = await createClient();
    const task_id = formData.get('task_id') as string;
    
    if (!task_id) return;
    
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

  // Server action to reopen a task
  async function reopenTaskAction(formData: FormData) {
    'use server'
    const supabase = await createClient();
    const task_id = formData.get('task_id') as string;
    
    if (!task_id) return;
    
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

  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || 'all';

  // Bouw de database query op (we halen meer openstaande taken op voor de groepering)
  let query = supabase
    .from('db_tasks')
    .select('id, task_title, status, type, date_start, date_end, estimated_hours, userID', { count: 'exact' })
    .neq('is_archived', true)
    .order('date_end', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(50);

  // Filter alleen jouw eigen taken als de toggle op 'Mijn Taken' staat
  if (filter === 'mine' && user) {
    query = query.eq('userID', user.id);
  }

  // Voer de query uit
  const { data: tasks, error, count } = await query;

  if (error) {
    console.error("Fout bij ophalen van taken:", error.message);
  }

  const tasksThisWeek = tasks?.filter(t => t.date_end ? isThisWeek(t.date_end) : (t.date_start ? isThisWeek(t.date_start) : false)) || [];
  const tasksFuture = tasks?.filter(t => t.date_end ? !isThisWeek(t.date_end) : (t.date_start ? !isThisWeek(t.date_start) : true)) || [];

  const renderTask = (task: Task) => {
    const isCompleted = task.status === 'Voltooid';
    
    return (
    <li key={task.id} className={`p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group ${isCompleted ? 'opacity-60 bg-gray-50/50 dark:bg-zinc-900/50' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          
          <form action={isCompleted ? reopenTaskAction : completeTaskAction} className="shrink-0 mt-0.5">
            <input type="hidden" name="task_id" value={task.id} />
            <button 
              type="submit" 
              title={isCompleted ? "Taak is voltooid. Klik om te heropenen." : "Markeer als voltooid"}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                isCompleted 
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
            {task.status && (
              <StatusBadge status={task.status} />
            )}
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

            {task.estimated_hours ? (
              <>
                <span className="text-gray-300 dark:text-zinc-700">&bull;</span>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>{task.estimated_hours} uur</span>
                </div>
              </>
            ) : null}
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
    </li>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Planning & Taken</h1>
          <p className="mt-2 text-[15px] text-gray-500 dark:text-zinc-400">
            Overzicht van alle beschikbare projecten en taken.
          </p>
        </div>

        <Link
          href="/dashboard/planning/nieuw"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors w-full sm:w-auto justify-center cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          Nieuwe Taak
        </Link>
      </div>

      {/* De Toggle (Tabbladen) */}
      <div className="flex bg-gray-100 dark:bg-zinc-800/50 p-1 rounded-lg w-fit border border-gray-200 dark:border-zinc-800">
        <Link
          href="?filter=all"
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${filter === 'all' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
        >
          Alle Taken
        </Link>
        <Link
          href="?filter=mine"
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${filter === 'mine' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
        >
          Mijn Taken
        </Link>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="space-y-6">
          {tasksThisWeek.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Deze week</h2>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
                {tasksThisWeek.map(task => renderTask(task))}
              </ul>
            </div>
          )}

          {tasksFuture.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Verder in de toekomst</h2>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
                {tasksFuture.map(task => renderTask(task))}
              </ul>
            </div>
          )}

          {/* Metadata info als er meer dan 50 taken zijn */}
          {count && count > 50 && (
            <div className="text-center pt-2">
              <span className="text-xs text-gray-500 dark:text-zinc-400 italic">
                + {count - 50} andere {filter === 'mine' ? 'eigen ' : ''}taken verborgen in dit overzicht
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <ClipboardDocumentListIcon className="h-6 w-6 text-gray-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Geen taken gevonden</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
              {filter === 'mine' ? "Je hebt momenteel geen taken aan jezelf gekoppeld staan." : "Er staan momenteel nog geen taken in de database."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
