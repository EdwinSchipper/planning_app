import { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

interface UIInlineFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function UIInlineField({ label, className = '', ...props }: UIInlineFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">{label}</span>
      <input 
        className={`text-sm font-medium text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-200 dark:hover:bg-zinc-700 border border-transparent hover:border-gray-300 dark:hover:border-zinc-600 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-300 dark:placeholder-zinc-600 ${className}`}
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
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">{label}</span>
      <select 
        className={`text-sm font-medium text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-200 dark:hover:bg-zinc-700 border border-transparent hover:border-gray-300 dark:hover:border-zinc-600 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none pr-6 relative ${className}`}
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
