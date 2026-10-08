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

  // Haal originele taak op om te bepalen wat er is gewijzigd
  const { data: oldTask } = await supabase
    .from('db_tasks')
    .select('*')
    .eq('id', parseInt(task_id))
    .single()

  // Bouw de update object dynamisch op basis van wat er in form data zit
  const updates: any = {}
  const changes: string[] = []

  if (status !== null) {
    updates.status = status
    if (oldTask && oldTask.status !== status) changes.push(`Status naar '${status}'`)
  }
  if (type !== null) {
    updates.type = type
    if (oldTask && oldTask.type !== type) changes.push(`Type gewijzigd`)
  }
  if (estimated_hours !== null) {
    const parsedHours = parseFloat(estimated_hours) || 0
    updates.estimated_hours = parsedHours
    if (oldTask && oldTask.estimated_hours !== parsedHours) changes.push(`Uren gewijzigd`)
  }
  if (assigned_user_id !== null) {
    updates.userID = assigned_user_id || null
    if (oldTask && oldTask.userID !== assigned_user_id) changes.push(`Toewijzing veranderd`)
  }
  if (task_title !== null) {
    updates.task_title = task_title
    if (oldTask && oldTask.task_title !== task_title) changes.push(`Titel gewijzigd`)
  }
  if (task_content !== null) {
    updates.task_content = task_content
    if (oldTask && oldTask.task_content !== task_content) changes.push(`Omschrijving gewijzigd`)
  }
  let startChanged = false
  let endChanged = false

  if (date_start !== null) {
    updates.date_start = date_start || null
    if (oldTask && oldTask.date_start !== (date_start || null)) startChanged = true
  }
  if (date_end !== null) {
    updates.date_end = date_end || null
    if (oldTask && oldTask.date_end !== (date_end || null)) endChanged = true
  }

  if (startChanged && endChanged) {
    changes.push(`Looptijd gewijzigd (${updates.date_start || 'Geen'} t/m ${updates.date_end || 'Geen'})`)
  } else if (startChanged) {
    changes.push(`Startdatum gewijzigd naar ${updates.date_start || 'Geen'}`)
  } else if (endChanged) {
    changes.push(`Einddatum gewijzigd naar ${updates.date_end || 'Geen'}`)
  }

  // Werk de taak bij in de database
  const { error } = await supabase
    .from('db_tasks')
    .update(updates)
    .eq('id', parseInt(task_id))

  if (error) {
    console.error("Fout bij updaten taak:", error.message)
  } else {
    // Log history
    const actionMessage = changes.length > 0 ? changes.join(', ') : 'Taakdetails bijgewerkt'
    await supabase.from('task_history').insert({
      task_id: parseInt(task_id),
      user_id: user.id,
      action: actionMessage
    })

    // Vernieuw de cache zodat de UI direct de nieuwe data toont
    revalidatePath('/dashboard', 'layout')
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
    await supabase.from('task_history').insert({
      task_id: parseInt(task_id),
      user_id: user.id,
      action: 'Taak gearchiveerd'
    })
    revalidatePath('/dashboard', 'layout')
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
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard/planning')
  }
}

export async function completeTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const task_id = formData.get('task_id') as string
  if (!task_id) return

  const { error } = await supabase
    .from('db_tasks')
    .update({ status: 'Voltooid' })
    .eq('id', parseInt(task_id))

  if (!error) {
    await supabase.from('task_history').insert({
      task_id: parseInt(task_id),
      user_id: user.id,
      action: "Status naar 'Voltooid'"
    })
    revalidatePath('/dashboard', 'layout')
  }
}

export async function reopenTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const task_id = formData.get('task_id') as string
  if (!task_id) return

  const { error } = await supabase
    .from('db_tasks')
    .update({ status: 'Open' })
    .eq('id', parseInt(task_id))

  if (!error) {
    await supabase.from('task_history').insert({
      task_id: parseInt(task_id),
      user_id: user.id,
      action: "Status naar 'Open'"
    })
    revalidatePath('/dashboard', 'layout')
  }
}


