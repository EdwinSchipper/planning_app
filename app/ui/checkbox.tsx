import { Checkbox, Field, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'

interface UICheckboxProps {
    name?: string;
    label: string;
    defaultChecked?: boolean;
    className?: string;
}

export default function UICheckbox({ name, label, defaultChecked, className }: UICheckboxProps) {
    return (
        <Field className="flex items-center gap-2">
            <Checkbox
                name={name}
                defaultChecked={defaultChecked}
                className={`group block size-4 rounded border border-gray-300 bg-white data-[checked]:bg-blue-600 data-[checked]:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 outline-none transition-all ${className || ''}`}
            >
                <CheckIcon className="hidden size-3.5 fill-white group-data-[checked]:block" />
            </Checkbox>
            <Label className="block text-sm text-gray-700 dark:text-zinc-300 cursor-pointer">
                {label}
            </Label>
        </Field>
    )
}