'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import TextField from '@/app/ui/input'
import UITextarea from '@/app/ui/textfield'
import UIButton from '@/app/ui/button'
import UIDropdown from '@/app/ui/dropdown'
import { createTask } from './actions'

export default function NieuweTaakForm({ profiles, currentUserId }: { profiles: any[], currentUserId: string }) {
  const [state, formAction, isPending] = useActionState(createTask, null)
  const [startDate, setStartDate] = useState('')

  const profileOptions = profiles.map(p => ({
    value: p.id,
    label: p.full_name || p.id
  }))

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/dashboard/planning" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-2 mb-4">
          &larr; Terug naar overzicht
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Nieuwe Taak Aanmaken</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
          Vul de details van de taak in. Je kunt datums later altijd nog aanpassen.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden p-6 sm:p-8">
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <p className="text-sm font-medium text-red-800">{state.error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <TextField
                label="Titel van de taak *"
                name="task_title"
                type="text"
                required
                placeholder="Bijv. Homepage redesign"
              />
            </div>

            <div className="sm:col-span-2">
              <TextField
                label="Categorie / Type"
                name="type"
                type="text"
                placeholder="Bijv. Design, Development..."
              />
            </div>

            <div className="sm:col-span-2">
              <UIDropdown
                label="Status"
                name="status"
                options={[
                  { value: 'Open', label: 'Open' },
                  { value: 'In Behandeling', label: 'In Behandeling' },
                  { value: 'Wacht op feedback', label: 'Wacht op feedback' },
                  { value: 'Voltooid', label: 'Voltooid' }
                ]}
              />
            </div>

            <div className="sm:col-span-2">
              <TextField
                label="Uren (Inschatting)"
                name="estimated_hours"
                type="number"
                step="0.25"
                min="0"
                placeholder="Bijv. 2.5"
              />
            </div>

            <div className="sm:col-span-6">
              <UIDropdown
                label="Toegewezen aan"
                name="userID"
                options={profileOptions}
                defaultValue={currentUserId}
              />
            </div>

            <div className="sm:col-span-6">
              <UITextarea
                label="Omschrijving *"
                name="task_content"
                required
                rows={4}
                placeholder="Beschrijf hier wat er precies moet gebeuren..."
              />
            </div>

            <div className="sm:col-span-3">
              <TextField
                label="Startdatum (Optioneel)"
                name="date_start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="sm:col-span-3">
              <TextField
                label="Einddatum / Deadline (Optioneel)"
                name="date_end"
                type="date"
                min={startDate || undefined}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Link
              href="/dashboard/planning"
              className="w-full sm:w-auto px-4 py-2.5 text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors"
            >
              Annuleren
            </Link>
            <div className="w-full sm:w-auto flex flex-col">
              <UIButton type="submit" disabled={isPending}>
                {isPending ? 'Bezig met opslaan...' : 'Taak Aanmaken'}
              </UIButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
