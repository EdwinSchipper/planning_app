import { createClient } from '@/utils/supabase/server'
import { CheckIcon } from '@heroicons/react/24/outline'

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

export default async function TaskTimeline({ taskId }: { taskId: string | number }) {
  const supabase = await createClient();

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
    .eq('task_id', taskId)
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
    // Geen logboeken gevonden
    return (
      <div className="p-8 sm:p-10 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">Activiteit</h3>
        <p className="text-sm text-gray-500 italic">Nog geen activiteiten gelogd voor deze taak.</p>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">Activiteit</h3>
      <div className="space-y-6">
        {history.map((item, index) => {
          const isVoltooid = item.action.includes("Status naar 'Voltooid'");
          return (
          <div key={item.id} className="relative flex gap-4">
            {/* Lijn die de bolletjes verbindt (behalve bij de laatste) */}
            {index !== history.length - 1 && (
              <span className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-gray-100 dark:bg-zinc-800" />
            )}
            
            {/* Bolletje met initiaal of vinkje */}
            <div className={`relative shrink-0 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 z-10 ${
              isVoltooid 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
              {isVoltooid ? (
                <CheckIcon className="w-4 h-4 stroke-[3]" />
              ) : (
                <span className="text-xs font-bold">{item.initial}</span>
              )}
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
        )})}
      </div>
    </div>
  )
}
