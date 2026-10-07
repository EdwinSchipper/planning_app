'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // FormData contains the specific fields (name="...") from the HTML form. 
  // Faster and more lightweight than storing everything in memory with React State.
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Try to log in via Supabase
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  // On success: clear the cache and redirect to the dashboard
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}
