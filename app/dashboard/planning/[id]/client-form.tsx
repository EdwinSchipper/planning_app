'use client'

import { useState } from 'react'
import UIDialog from '@/app/ui/dialog'
import { updateTask } from './actions'

export default function ClientTaskForm({ children }: { children: React.ReactNode }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    async function handleUpdate(formData: FormData) {
        // Run the server action
        await updateTask(formData)
        // Show success dialog
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
