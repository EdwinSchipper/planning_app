import { createClient } from '@/utils/supabase/server';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
          Welkom terug, <span className="font-medium text-gray-900 dark:text-white">{fullName || user?.email}</span>! Je bent ingelogd als <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20">{role}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Kaart 1 */}
        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-zinc-400">Geplande Taken Vandaag</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">4</dd>
        </div>
        
        {/* Placeholder Kaart 2 */}
        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-zinc-400">Uren Gepland</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">6.5</dd>
        </div>

        {/* Placeholder Kaart 3 */}
        <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-zinc-400">Aankomende Deadlines</dt>
          <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">2</dd>
        </div>
      </div>

      {/* Recente Activiteit / Planning */}
      <div className="overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800">
        <div className="border-b border-gray-200 dark:border-zinc-800 px-6 py-5">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Planning van vandaag</h3>
        </div>
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-gray-500 dark:text-zinc-400">Je hebt nog geen specifieke tijden ingepland voor vandaag.</p>
        </div>
      </div>
    </div>
  );
}