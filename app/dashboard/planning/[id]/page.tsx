import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { UserIcon, CalendarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { UIInlineField, UIInlineSelect } from '@/app/ui/inline-field'
import { updateTask, archiveTask, deleteTask } from './actions'
import ClientTaskForm from './client-form'
import ClientDateRange from './client-date-range'

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Helper om de actie-tekst in stukjes op te knippen zodat "naar" of "t/m" grijs worden, 
  // en de properties + waarden mooi bold naar voren komen voor scanbaarheid.
  const formatActionText = (actionStr: string) => {
    let text = actionStr.charAt(0).toLowerCase() + actionStr.slice(1);
    
    // Splits op ' naar ', ' t/m ', en haakjes
    const parts = text.split(/( naar | t\/m |\(|\))/g).filter(Boolean);
    
    return parts.map((part, idx) => {
      if ([' naar ', ' t/m ', '(', ')'].includes(part)) {
        const trimmed = part.trim();
        const hasLeading = part.startsWith(' ');
        const hasTrailing = part.endsWith(' ');
        
        return (
          <span key={idx}>
            {hasLeading ? ' ' : ''}
            <span className="italic">{trimmed}</span>
            {hasTrailing ? ' ' : ''}
          </span>
        );
      }
      return <span key={idx} className="font-medium text-gray-800 dark:text-gray-200">{part}</span>;
    });
  };

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

  // Haal de tijdlijn op uit de database
  const { data: historyData, error: historyError } = await supabase
    .from('task_history')
    .select(`
      id,
      action,
      created_at,
      profiles (
        full_name
      )
    `)
    .eq('task_id', resolvedParams.id)
    .order('created_at', { ascending: false })

  let history = []
  
  if (!historyError && historyData && historyData.length > 0) {
    history = historyData.map((h: any) => {
      // Supabase geeft nested objects terug (soms als array, maar bij een FK meestal als object)
      const profile = Array.isArray(h.profiles) ? h.profiles[0] : h.profiles
      const fullName = profile?.full_name || 'Onbekende Gebruiker'
      
      return {
        id: h.id,
        user: fullName,
        initial: fullName.charAt(0).toUpperCase(),
        action: h.action,
        time: new Date(h.created_at).toLocaleString('nl-NL', { 
           day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' 
        })
      }
    })
  } else {
    // Fallback dummy data als de tabel nog niet bestaat of nog leeg is
    history = [
      { id: 'mock1', user: 'Voorbeeld Gebruiker', initial: 'V', action: 'Wacht op live data...', time: 'Zojuist' }
    ]
  }

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
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
            <input
              type="text"
              name="task_title"
              defaultValue={task.task_title || ""}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white bg-transparent border-none p-0 focus:ring-0 focus:outline-none flex-1 w-full placeholder-gray-300 dark:placeholder-zinc-700"
              placeholder="Naamloze Taak"
              readOnly={isReadOnly}
            />

            {!isReadOnly && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  formAction={archiveTask}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Verberg deze taak uit het overzicht"
                >
                  Archiveren
                </button>
                <button
                  formAction={deleteTask}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Definitief verwijderen uit database"
                >
                  Verwijderen
                </button>
              </div>
            )}
          </div>

          {/* Properties Grid (Notion Style) */}
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Looptijd</span>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 px-2 py-1">
                <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
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

        {/* TIMELINE / HISTORY SECTION */}
        <div className="p-8 sm:p-10 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">Activiteit</h3>
          <div className="space-y-6">
            {history.map((item, index) => (
              <div key={item.id} className="relative flex gap-4">
                {/* Lijn die de bolletjes verbindt (behalve bij de laatste) */}
                {index !== history.length - 1 && (
                  <span className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-gray-100 dark:bg-zinc-800" />
                )}
                
                {/* Bolletje met initiaal */}
                <div className="relative shrink-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 z-10">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.initial}</span>
                </div>
                
                <div className="flex flex-col pt-1.5 pb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">{item.user}</span>{' '}
                    <span className="italic">{item.action.toLowerCase().includes('aangemaakt') ? 'heeft deze' : 'heeft de'}</span>{' '}
                    {formatActionText(item.action)}
                  </p>
                  <span className="text-xs text-gray-400 dark:text-zinc-500 mt-1">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STICKY BOTTOM BAR FOR SAVE */}
        {!isReadOnly && (
          <div className="sticky bottom-0 border-t border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-8 py-4 flex justify-end">
            <button type="submit" className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors px-6 py-2.5 rounded-lg shadow-sm cursor-pointer">
              Wijzigingen Opslaan
            </button>
          </div>
        )}
      </ClientTaskForm>
    </div>
  )
}
