'use client'

import { useState } from 'react'
import UIDialog from '@/app/ui/dialog'
import { updateTask as updateTaskAction } from './actions'
import { useTaskStore, Task } from '@/store/useTaskStore'

export default function ClientTaskForm({ children }: { children: React.ReactNode }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const updateTaskInStore = useTaskStore(state => state.updateTask)

    async function handleUpdate(formData: FormData) {
        // --- 1. OPTIMISTIC UPDATE (Bliksemsnel) ---
        // We werken de Zustand Store direct bij zodat de interface niet hoeft te wachten
        const taskId = formData.get('task_id') as string
        if (taskId) {
            const updates: Partial<Task> = {}
            if (formData.has('task_title')) updates.task_title = formData.get('task_title') as string
            if (formData.has('task_content')) updates.task_content = formData.get('task_content') as string
            if (formData.has('status')) updates.status = formData.get('status') as string
            if (formData.has('type')) updates.type = formData.get('type') as string
            if (formData.has('estimated_hours')) updates.estimated_hours = parseFloat(formData.get('estimated_hours') as string) || 0
            if (formData.has('userID')) updates.userID = formData.get('userID') as string || null
            if (formData.has('date_start')) updates.date_start = formData.get('date_start') as string || null
            if (formData.has('date_end')) updates.date_end = formData.get('date_end') as string || null

            updateTaskInStore(parseInt(taskId), updates)
        }

        // --- 2. SERVER ACTIE (Achtergrond proces) ---
        // Supabase database echt bijwerken via de Server Action
        await updateTaskAction(formData)
        
        setIsDialogOpen(true)
    }

    return (
        <>
            <form action={handleUpdate} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/80 overflow-hidden flex flex-col">
                {children}
            </form>

            <UIDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Taak succesvol opgeslagen!"
                description="De wijzigingen aan deze taak zijn succesvol verwerkt en zichtbaar in het overzicht."
                buttonText="Verdergaan"
            />
        </>
    )
}
