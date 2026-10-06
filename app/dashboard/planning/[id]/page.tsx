import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { UserIcon, CalendarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { UIInlineField, UIInlineSelect } from '@/app/ui/inline-field'
import { updateTask, archiveTask, deleteTask } from './actions'

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // 1. Haal de taak op uit de database
  const { data: task, error } = await supabase
    .from('db_tasks')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !task) {
    notFound()
  }

  // Haal alle profielen op
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name', { ascending: true })

  // 2. Haal de naam van de maker op
  let creatorName = 'Onbekende gebruiker'
  if (task.userID) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', task.userID)
      .single()
      
    if (profile && profile.full_name) {
      creatorName = profile.full_name
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">
      
      {/* Elegante, minimalistische back-link */}
      <div className="mb-6 px-2">
        <Link 
          href="/dashboard/planning" 
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-white transition-colors gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Terug naar overzicht
        </Link>
      </div>

      <form action={updateTask} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/80 overflow-hidden flex flex-col">
        <input type="hidden" name="task_id" value={task.id} />
        
        {/* BOVENKANT: Luchtige Header */}
        <div className="p-8 sm:p-10 relative">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
            <input 
              type="text"
              name="task_title"
              defaultValue={task.task_title || ""}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white pr-4 bg-transparent border-none p-0 focus:ring-0 focus:outline-none flex-1 w-full"
              placeholder="Naamloze Taak"
            />
            
            <div className="flex items-center gap-3 shrink-0">
              <button 
                formAction={archiveTask}
                className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-zinc-400 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                title="Verberg deze taak uit het overzicht"
              >
                Archiveren
              </button>
              <button 
                formAction={deleteTask}
                className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors shadow-sm"
                title="Definitief verwijderen uit database"
              >
                Verwijderen
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-gray-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              <span>{creatorName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  name="date_start" 
                  defaultValue={task.date_start || ''} 
                  className="text-sm bg-transparent border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 rounded p-1 text-gray-500 dark:text-zinc-400 focus:ring-2 focus:ring-blue-500 outline-none" 
                  title="Startdatum"
                />
                <span>tot</span>
                <input 
                  type="date" 
                  name="date_end" 
                  defaultValue={task.date_end || ''} 
                  className="text-sm bg-transparent border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 rounded p-1 text-red-500 dark:text-red-400 font-medium focus:ring-2 focus:ring-blue-500 outline-none" 
                  title="Einddatum"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MIDDEN: Subtiele 'Properties' balk (geïnspireerd op moderne tools zoals Linear/Notion) */}
        <div className="px-8 sm:px-10 py-4 bg-gray-50/50 dark:bg-zinc-800/30 border-y border-gray-100 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-6">
            
            <UIInlineSelect 
              label="Status"
              name="status"
              defaultValue={task.status || 'Open'}
              options={[
                { value: 'Open', label: 'Open' },
                { value: 'In Behandeling', label: 'In Behandeling' },
                { value: 'Wacht op feedback', label: 'Wacht op feedback' },
                { value: 'Voltooid', label: 'Voltooid' }
              ]}
            />

            <UIInlineField
              label="Type"
              name="type"
              type="text"
              defaultValue={task.type || ''}
              placeholder="Bijv. Design"
              className="w-32"
            />
            
            <UIInlineField
              label="Uren"
              name="estimated_hours"
              type="number"
              step="0.25"
              min="0"
              defaultValue={task.estimated_hours || ''}
              placeholder="0"
              className="w-16 text-center"
            />

            <UIInlineSelect 
              label="Toegewezen aan"
              name="userID"
              defaultValue={task.userID || ''}
              options={(profiles || []).map(p => ({ value: p.id, label: p.full_name || p.id }))}
            />
            
            <button type="submit" className="ml-auto text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors px-4 py-2 rounded-lg shadow-sm">
              Wijzigingen Opslaan
            </button>
          </div>
        </div>

        {/* ONDERKANT: Luchtig Tekstblok */}
        <div className="p-8 sm:p-10 min-h-[400px] flex flex-col">
          <textarea 
            name="task_content" 
            defaultValue={task.task_content || ''}
            className="w-full flex-1 bg-transparent border-none p-0 focus:ring-0 focus:outline-none resize-y text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 min-h-[300px]"
            placeholder="Typ hier de beschrijving van de taak..."
          />
        </div>

      </form>
    </div>
  )
}
