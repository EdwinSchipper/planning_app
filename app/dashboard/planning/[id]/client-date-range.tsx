'use client'

import { useState } from 'react'

interface ClientDateRangeProps {
  defaultStart?: string | null
  defaultEnd?: string | null
  isReadOnly?: boolean
}

export default function ClientDateRange({ defaultStart = '', defaultEnd = '', isReadOnly = false }: ClientDateRangeProps) {
  const [start, setStart] = useState(defaultStart || '')
  
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        name="date_start"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="bg-transparent border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 rounded p-1 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 dark:text-zinc-400 cursor-pointer w-auto"
        title="Startdatum"
        readOnly={isReadOnly}
        disabled={isReadOnly}
      />
      <span className="text-gray-400 dark:text-zinc-500">&rarr;</span>
      <input
        type="date"
        name="date_end"
        defaultValue={defaultEnd || ''}
        min={start || undefined}
        className="bg-transparent border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 rounded p-1 focus:ring-2 focus:ring-blue-500 outline-none text-red-600 dark:text-red-400 font-medium cursor-pointer w-auto"
        title="Einddatum"
        readOnly={isReadOnly}
        disabled={isReadOnly}
      />
    </div>
  )
}
