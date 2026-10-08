import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { UserIcon, CalendarIcon, ArrowLeftIcon, CheckIcon, TrashIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline'
import { UIInlineField, UIInlineSelect } from '@/app/ui/inline-field'
import { updateTask, archiveTask, deleteTask, completeTask, reopenTask } from './actions'
import ClientTaskForm from './client-form'
import ClientDateRange from './client-date-range'
import TaskTimeline from './task-timeline'
import { Suspense } from 'react'

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {

  const resolvedParams = await params
  const supabase = await createClient()

  // 0. Eerst checken of gebruiker is ingelogd (veiligheid en onnodige queries voorkomen)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 1. Haal de taak op uit de database
  const { data: task, error } = await supabase
    .from('db_tasks')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !task) {
    notFound()
  }

  // Bepaal of de taak readonly is voor deze gebruiker
  const isReadOnly = user.id !== task.userID

  // Haal alle profielen op
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">

      {/* Elegante, minimalistische back-link */}
      <div className="mb-6 px-2">
        <Link
          href="/dashboard/planning"
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-white transition-colors gap-2 cursor-pointer"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Terug naar overzicht
        </Link>
      </div>

      <ClientTaskForm>
        <input type="hidden" name="task_id" value={task.id} />

        {/* HEADER & METADATA GRID */}
        <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <textarea
              name="task_title"
              defaultValue={task.task_title || ""}
              rows={Math.max(1, Math.ceil((task.task_title?.length || 0) / 30))}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white bg-transparent border-none py-1 focus:ring-0 focus:outline-none flex-1 w-full placeholder-gray-300 dark:placeholder-zinc-700 resize-none overflow-hidden leading-tight"
              placeholder="Naamloze Taak"
              readOnly={isReadOnly}
              spellCheck="false"
            />

            {!isReadOnly && (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {task.status === 'Voltooid' ? (
                  <button
                    formAction={reopenTask}
                    className="inline-flex items-center gap-1.5 sm:gap-2 justify-center rounded-full sm:rounded-md p-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors shadow-sm cursor-pointer"
                    title="Taak is voltooid. Klik om te heropenen als dit een foutje was."
                  >
                    <CheckIcon className="w-4 h-4 stroke-[3]" />
                    <span className="hidden sm:inline">Voltooid</span>
                  </button>
                ) : (
                  <button
                    formAction={completeTask}
                    className="inline-flex items-center gap-1.5 sm:gap-2 justify-center rounded-full sm:rounded-md p-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors shadow-sm cursor-pointer"
                    title="Markeer deze taak direct als voltooid"
                  >
                    <CheckIcon className="w-4 h-4 stroke-[3]" />
                    <span className="hidden sm:inline">Voltooien</span>
                  </button>
                )}
                <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-1"></div>
                <button
                  formAction={archiveTask}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Archiveren (verberg uit overzicht)"
                >
                  <ArchiveBoxIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  formAction={deleteTask}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Definitief verwijderen"
                >
                  <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Properties Grid (Notion Style) */}
          <div className="flex flex-col gap-1 sm:gap-2 max-w-2xl mt-4 sm:mt-0">
            <div className="flex items-center gap-2 sm:gap-3 group">
              <span className="w-24 sm:w-32 shrink-0 text-xs text-gray-500 dark:text-zinc-400">Looptijd</span>
              <div className="flex-1 min-w-0 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white px-2 py-1.5 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors">
                <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-zinc-500 shrink-0" />
                <div className="flex items-center gap-2">
                  <ClientDateRange 
                    defaultStart={task.date_start || ''} 
                    defaultEnd={task.date_end || ''} 
                    isReadOnly={isReadOnly} 
                  />
                </div>
              </div>
            </div>

            <UIInlineSelect
              label="Status"
              name="status"
              defaultValue={task.status || 'Open'}
              disabled={isReadOnly}
              options={[
                { value: 'Open', label: 'Open' },
                { value: 'In Behandeling', label: 'In Behandeling' },
                { value: 'Wacht op feedback', label: 'Wacht op feedback' },
                { value: 'Voltooid', label: 'Voltooid' }
              ]}
            />

            <UIInlineSelect
              label="Toegewezen"
              name="userID"
              defaultValue={task.userID || ''}
              disabled={isReadOnly}
              options={(profiles || []).map(p => ({ value: p.id, label: p.full_name || p.id }))}
            />

            <UIInlineField
              label="Type"
              name="type"
              type="text"
              defaultValue={task.type || ''}
              placeholder="Bijv. Design"
              className="w-full sm:w-64"
              disabled={isReadOnly}
            />

            <UIInlineField
              label="Uren"
              name="estimated_hours"
              type="number"
              step="0.25"
              min="0"
              defaultValue={task.estimated_hours || ''}
              placeholder="0"
              className="w-32"
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* MAIN TEXT AREA */}
        <div className="p-8 sm:p-10 min-h-[400px] flex flex-col bg-gray-50/30 dark:bg-zinc-900/50">
          <textarea
            name="task_content"
            defaultValue={task.task_content || ''}
            className="w-full flex-1 bg-transparent border-none p-0 focus:ring-0 focus:outline-none resize-y text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 min-h-[300px] placeholder-gray-400 dark:placeholder-zinc-600"
            placeholder="Begin hier met schrijven..."
            readOnly={isReadOnly}
          />
        </div>

        {/* TIMELINE / HISTORY SECTION (Asynchronous Streaming) */}
        <Suspense fallback={
          <div className="p-8 sm:p-10 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <TaskTimeline taskId={task.id} />
        </Suspense>

        {/* STICKY BOTTOM BAR FOR SAVE */}
        {!isReadOnly && (
          <div className="sticky bottom-0 border-t border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 sm:px-8 py-4 flex justify-end">
            <button type="submit" className="w-full sm:w-auto text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors px-6 py-3 sm:py-2.5 rounded-lg shadow-sm cursor-pointer">
              Wijzigingen Opslaan
            </button>
          </div>
        )}
      </ClientTaskForm>
    </div>
  )
}
