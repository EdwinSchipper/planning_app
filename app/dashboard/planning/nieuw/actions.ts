'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTask(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  // Controleer of de gebruiker is ingelogd
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Je moet ingelogd zijn om een taak aan te maken." }
  }

  // Haal de waardes uit het formulier
  const task_title = formData.get('task_title') as string
  const task_content = formData.get('task_content') as string
  const type = formData.get('type') as string
  const status = formData.get('status') as string
  const date_start = formData.get('date_start') as string
  const date_end = formData.get('date_end') as string
  const estimated_hours = formData.get('estimated_hours') as string
  const assigned_user_id = formData.get('userID') as string

  // Simpele validatie
  if (!task_title || !task_content) {
    return { error: "Vul op z'n minst een titel en omschrijving in." }
  }

  // Sla op in de database
  const { data, error } = await supabase
    .from('db_tasks')
    .insert({
      task_title,
      task_content,
      type: type || 'Algemeen',
      status: status || 'Open',
      date_start: date_start || null,
      date_end: date_end || null,
      estimated_hours: estimated_hours ? parseFloat(estimated_hours) : 0,
      userID: assigned_user_id || user.id, // Koppel aan de geselecteerde gebruiker (standaard jezelf)
      isAdmin: false
    })
    .select('id')
    .single()

  if (error) {
    return { error: "Er is iets misgegaan bij het opslaan: " + error.message }
  }

  // Log in history
  if (data?.id) {
    await supabase.from('task_history').insert({
      task_id: data.id,
      user_id: user.id,
      action: 'Taak aangemaakt'
    })
  }

  // Als alles goed ging: vernieuw de planning pagina (zodat de taak erbij staat) en ga terug
  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard/planning')
}
