import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

// We definiëren hier de structuur van een taak zoals hij in je database staat
interface Task {
  id: number;
  task_title: string;
  task_content: string;
  status: string;
  type: string;
  date_start?: string | null;
  date_end?: string | null;
  userID: string;
}

export default async function PlanningPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Lees de huidige URL uit (bijv ?filter=mine)
  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || 'all';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Bouw de database query op (maximaal 3 openstaande taken, maar we tellen wel het totaal)
  let query = supabase
    .from('db_tasks')
    .select('*', { count: 'exact' })
    .order('date_end', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: false })
    .limit(3);

  // Filter alleen jouw eigen taken als de toggle op 'Mijn Taken' staat
  if (filter === 'mine' && user) {
    query = query.eq('userID', user.id);
  }

  // Voer de query uit
  const { data: tasks, error, count } = await query;

  if (error) {
    console.error("Fout bij ophalen van taken:", error.message);
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Planning & Taken</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Overzicht van alle beschikbare projecten en taken.
          </p>
        </div>

        {/* Placeholder voor eventuele 'Taak Toevoegen' knop */}
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors w-full sm:w-auto justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nieuwe Taak
        </button>
      </div>

      {/* De Toggle (Tabbladen) */}
      <div className="flex bg-gray-100 dark:bg-zinc-800/50 p-1 rounded-lg w-fit border border-gray-200 dark:border-zinc-800">
        <Link
          href="?filter=all"
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'all' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
        >
          Alle Taken
        </Link>
        <Link
          href="?filter=mine"
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'mine' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
        >
          Mijn Taken
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        {tasks && tasks.length > 0 ? (
          <>
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Deze week</h2>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
              {tasks.map((task: Task) => (
                <li key={task.id} className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {task.task_title || "Naamloze Taak"}
                        </h3>
                        {task.status && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400">
                            {task.status}
                          </span>
                        )}
                        {task.type && (
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-zinc-800 dark:text-zinc-400">
                            {task.type}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {task.task_content || "Geen omschrijving beschikbaar."}
                      </p>

                      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-zinc-500">
                        {(task.date_start || task.date_end) && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            <span>
                              {task.date_start && !task.date_end && `Vanaf ${task.date_start}`}
                              {!task.date_start && task.date_end && `Deadline: ${task.date_end}`}
                              {task.date_start && task.date_end && `${task.date_start} tot ${task.date_end}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Details bekijken &rarr;
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Metadata balk rechts onderin als er meer dan 3 taken zijn */}
            {count && count > 3 && (
              <div className="px-6 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-800/20 flex justify-end">
                <span className="text-xs text-gray-500 dark:text-zinc-400 italic">
                  + {count - 3} andere {filter === 'mine' ? 'eigen ' : ''}taken verborgen in dit overzicht
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-gray-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Geen taken gevonden</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
              {filter === 'mine' ? "Je hebt momenteel geen taken aan jezelf gekoppeld staan." : "Er staan momenteel nog geen taken in de database."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
