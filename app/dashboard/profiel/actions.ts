'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Check who is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Je bent niet ingelogd." }

  // Get the new name from the form
  const full_name = formData.get('full_name') as string

  // Update the table in the database
  const { error } = await supabase
    .from('profiles')
    .update({ full_name })
    .eq('id', user.id)

  if (error) {
    return { error: "Er is iets misgegaan bij het opslaan: " + error.message }
  }

  // Tell Next.js to reload the profile page and the dashboard 
  // so your new name is immediately visible everywhere in the app!
  revalidatePath('/dashboard/profiel')
  revalidatePath('/dashboard')

  return { success: "Profiel succesvol bijgewerkt!" }
}
