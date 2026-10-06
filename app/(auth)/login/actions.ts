'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // FormData bevat een lichtgewicht pakketje met alléén de specifieke velden (name="...") 
  // uit het HTML formulier. Dit is veel sneller en lichter dan alles in het geheugen opslaan met React State.
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Probeer in te loggen via Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Geef de specifieke foutmelding van Supabase terug (bijv. 'Email not confirmed')
    return { error: error.message }
  }

  // Bij succes: vernieuw de cache en stuur door naar het dashboard
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
