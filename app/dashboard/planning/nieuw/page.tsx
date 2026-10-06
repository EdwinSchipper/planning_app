import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import NieuweTaakForm from './form'

export default async function NieuweTaakPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Haal alle profielen op zodat we taken kunnen toewijzen aan collega's
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name', { ascending: true })

  return <NieuweTaakForm profiles={profiles || []} currentUserId={user.id} />
}
