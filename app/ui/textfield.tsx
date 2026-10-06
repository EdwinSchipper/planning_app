import { Description, Field, Label, Textarea } from '@headlessui/react'
import { TextareaHTMLAttributes } from 'react'

interface UITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    description?: string;
}

export default function UITextarea({ label, description, className, ...props }: UITextareaProps) {
    return (
        <div className="w-full">
            <Field>
                <Label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</Label>
                {description && (
                    <Description className="text-sm text-gray-500 dark:text-zinc-400 mb-2">{description}</Description>
                )}
                <Textarea
                    {...props}
                    className={`block w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
                />
            </Field>
        </div>
    )
}
