'use client';

import Link from 'next/link';
import { CalendarIcon, TrashIcon, ChevronRightIcon, ClipboardDocumentListIcon, ClockIcon, CheckBadgeIcon, CheckIcon } from '@heroicons/react/24/outline';
import { StatCard } from '@/app/ui/dashboard/stat-card';
import { StatusBadge } from '@/app/ui/status-badge';
import { useTaskStore } from '@/store/useTaskStore';
import { completeTask, reopenTask, deleteTask } from './planning/[id]/actions';

export default function DashboardClient({ 
  fullName, 
  email, 
  role, 
  completedThisWeekCount 
}: { 
  fullName: string, 
  email: string, 
  role: string, 
  completedThisWeekCount: number 
}) {
  // Fetch data instantly from our local memory store (Pinia style)
  const getOpenTasks = useTaskStore(state => state.getOpenTasks);
  const updateTaskInStore = useTaskStore(state => state.updateTask);
  const removeTaskFromStore = useTaskStore(state => state.removeTask);

  const openTasks = getOpenTasks();
  
  // Sort by deadline (matching the original server code)
  const sortedTasks = [...openTasks].sort((a, b) => {
    if (!a.date_end) return 1;
    if (!b.date_end) return -1;
    return new Date(a.date_end).getTime() - new Date(b.date_end).getTime();
  });

  const openTasksCount = sortedTasks.length;
  const totalHours = sortedTasks.reduce((sum, task) => sum + (Number(task.estimated_hours) || 0), 0);
  const topTasks = sortedTasks.slice(0, 5);

  // Optimistic UI functions
  const handleComplete = async (taskId: number) => {
    updateTaskInStore(taskId, { status: 'Voltooid' }); // 0ms UI update
    const formData = new FormData();
    formData.append('task_id', taskId.toString());
    await completeTask(formData); // Background database update
  };

  const handleReopen = async (taskId: number) => {
    updateTaskInStore(taskId, { status: 'Open' }); // 0ms UI update
    const formData = new FormData();
    formData.append('task_id', taskId.toString());
    await reopenTask(formData); // Background database update
  };

  const handleDelete = async (taskId: number) => {
    removeTaskFromStore(taskId); // 0ms UI update
    const formData = new FormData();
    formData.append('task_id', taskId.toString());
    await deleteTask(formData); // Background database update
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-[15px] text-gray-500 dark:text-zinc-400">
          Welkom terug, <span className="font-medium text-gray-900 dark:text-white">{fullName || email}</span>! Je bent ingelogd als <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20">{role}</span>.
        </p>
      </div>

      {/* STATISTICS (Deze updaten nu real-time als je een taak afvinkt!) */}
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

                    <form action={() => isCompleted ? handleReopen(task.id) : handleComplete(task.id)} className="shrink-0 mt-0.5">
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

                        {(task.estimated_hours ?? 0) > 0 && (
                          <>
                            <span className="text-gray-300 dark:text-zinc-700">&bull;</span>
                            <div className="flex items-center gap-1.5">
                              <ClockIcon className="w-4 h-4 opacity-70" />
                              <span>{task.estimated_hours} uur</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <form action={() => handleDelete(task.id)}>
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
