'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Controleer wie er is ingelogd
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Je bent niet ingelogd." }

  // Haal de nieuwe naam uit het formulier
  const full_name = formData.get('full_name') as string

  // Update de tabel in de database
  const { error } = await supabase
    .from('profiles')
    .update({ full_name })
    .eq('id', user.id)

  if (error) {
    return { error: "Er is iets misgegaan bij het opslaan: " + error.message }
  }

  // Vertel Next.js dat hij de profielpagina én het dashboard opnieuw moet inladen 
  // zodat je overal in de app meteen je nieuwe naam ziet staan!
  revalidatePath('/dashboard/profiel')
  revalidatePath('/dashboard')
  
  return { success: "Profiel succesvol bijgewerkt!" }
}
