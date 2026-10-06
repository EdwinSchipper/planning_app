import { createClient } from '@/utils/supabase/server'
import ProfileForm from '@/app/ui/profile-form'

export default async function ProfielPage() {
  const supabase = await createClient()

  // Haal de ingelogde gebruiker op
  const { data: { user } } = await supabase.auth.getUser()
  
  // Haal het profiel op
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single()
    profile = data;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Profiel</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
          Beheer hier je persoonlijke gegevens en voorkeuren.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 md:p-8">
        <ProfileForm 
          initialFullName={profile?.full_name || ''} 
          email={user?.email || ''} 
          role={profile?.role || 'user'}
        />
      </div>
    </div>
  )
}
