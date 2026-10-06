import { Select, Field, Label } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { SelectHTMLAttributes } from 'react'

interface UISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
}

export default function UIDropdown({ label, options, className, ...props }: UISelectProps) {
    return (
        <Field>
            <Label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {label}
            </Label>
            <div className="relative">
                <Select
                    {...props}
                    className={`block w-full appearance-none rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="bg-white dark:bg-zinc-800">
                            {option.label}
                        </option>
                    ))}
                </Select>
                <ChevronDownIcon
                    className="pointer-events-none absolute top-2.5 right-2.5 size-4 fill-gray-500 dark:fill-white/60"
                    aria-hidden="true"
                />
            </div>
        </Field>
    )
}
