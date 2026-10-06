'use client'

import { useActionState } from 'react'
import TextField from './input'
import UIButton from './button'
import { updateProfile } from '../dashboard/profiel/actions'

export default function ProfileForm({ initialFullName, email, role }: { initialFullName: string, email: string, role: string }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">{state.error}</p>
        </div>
      )}
      
      {state?.success && (
        <div className="rounded-lg bg-green-50 p-4 border border-green-200">
          <p className="text-sm font-medium text-green-800">{state.success}</p>
        </div>
      )}

      {/* Email (Gekoppeld aan Auth, dus niet hier aanpasbaar) */}
      <TextField
        label="E-mailadres"
        name="email"
        type="email"
        defaultValue={email}
        disabled
        className="opacity-60 cursor-not-allowed bg-gray-100 dark:bg-zinc-800"
      />

      {/* Volledige Naam (Gekoppeld aan Profiles tabel) */}
      <TextField
        label="Volledige Naam"
        name="full_name"
        type="text"
        defaultValue={initialFullName}
        placeholder="Bijv. Edwin Schipper"
      />

      {/* Rol Weergave */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-zinc-100 mb-2">Rol</label>
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20">
          {role}
        </span>
        <p className="text-xs text-gray-500 mt-2">Je rol kan alleen door een database-beheerder worden aangepast.</p>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
        <UIButton
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? 'Bezig met opslaan...' : 'Wijzigingen Opslaan'}
        </UIButton>
      </div>
    </form>
  )
}
