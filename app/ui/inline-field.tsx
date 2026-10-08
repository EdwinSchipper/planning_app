import { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

interface UIInlineFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function UIInlineField({ label, className = '', ...props }: UIInlineFieldProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 group">
      <span className="w-24 sm:w-32 shrink-0 text-xs text-gray-500 dark:text-zinc-400">{label}</span>
      <input 
        className={`flex-1 min-w-0 text-sm font-medium text-gray-900 dark:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 -ml-2 focus:ring-1 focus:ring-gray-300 dark:focus:ring-zinc-700 outline-none transition-colors placeholder-gray-300 dark:placeholder-zinc-600 ${className}`}
        {...props} 
      />
    </div>
  )
}

interface UIInlineSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function UIInlineSelect({ label, options, className = '', ...props }: UIInlineSelectProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 group">
      <span className="w-24 sm:w-32 shrink-0 text-xs text-gray-500 dark:text-zinc-400">{label}</span>
      <select 
        className={`flex-1 min-w-0 text-sm font-medium text-gray-900 dark:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800 rounded px-2 py-1 -ml-2 focus:ring-1 focus:ring-gray-300 dark:focus:ring-zinc-700 outline-none transition-colors cursor-pointer appearance-none pr-6 relative ${className}`}
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239CA3AF\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 4px center', backgroundRepeat: 'no-repeat', backgroundSize: '14px' }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-800">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
