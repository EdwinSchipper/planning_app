'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateTaskMetadata(formData: FormData) {
  const supabase = await createClient()
  
  // Controleer of er een ingelogde gebruiker is
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  
  const task_id = formData.get('task_id') as string
  const status = formData.get('status') as string
  const type = formData.get('type') as string

  if (!task_id) return

  // Werk de status en type bij in de database
  const { error } = await supabase
    .from('db_tasks')
    .update({
      status,
      type
    })
    .eq('id', parseInt(task_id))

  if (error) {
    console.error("Fout bij updaten taak:", error.message)
  } else {
    // Vernieuw de cache zodat de UI direct de nieuwe data toont
    revalidatePath(`/dashboard/planning/${task_id}`)
    revalidatePath('/dashboard/planning')
  }
}

export async function archiveTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  
  const task_id = formData.get('task_id') as string
  if (!task_id) return

  const { error } = await supabase
    .from('db_tasks')
    .update({ is_archived: true })
    .eq('id', parseInt(task_id))

  if (!error) {
    revalidatePath('/dashboard/planning')
    redirect('/dashboard/planning')
  }
}

export async function deleteTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  
  const task_id = formData.get('task_id') as string
  if (!task_id) return

  const { error } = await supabase
    .from('db_tasks')
    .delete()
    .eq('id', parseInt(task_id))

  if (!error) {
    revalidatePath('/dashboard/planning')
    redirect('/dashboard/planning')
  }
}
