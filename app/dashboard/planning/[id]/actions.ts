'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateTask(formData: FormData) {
  const supabase = await createClient()

  // Controleer of er een ingelogde gebruiker is
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const task_id = formData.get('task_id') as string
  const task_title = formData.get('task_title') as string
  const task_content = formData.get('task_content') as string
  const status = formData.get('status') as string
  const type = formData.get('type') as string
  const estimated_hours = formData.get('estimated_hours') as string
  const assigned_user_id = formData.get('userID') as string
  const date_start = formData.get('date_start') as string
  const date_end = formData.get('date_end') as string

  if (!task_id) return

  // Bouw de update object dynamisch op basis van wat er in form data zit
  const updates: any = {}

  if (status !== null) updates.status = status
  if (type !== null) updates.type = type
  if (estimated_hours !== null) updates.estimated_hours = parseFloat(estimated_hours) || 0
  if (assigned_user_id !== null) updates.userID = assigned_user_id || null
  if (task_title !== null) updates.task_title = task_title
  if (task_content !== null) updates.task_content = task_content
  if (date_start !== null) updates.date_start = date_start || null
  if (date_end !== null) updates.date_end = date_end || null

  // Werk de taak bij in de database
  const { error } = await supabase
    .from('db_tasks')
    .update(updates)
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
