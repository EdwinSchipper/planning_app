// Imports
import { Description, Field, Input, Label } from '@headlessui/react'

// Typescript validation
// Door extends React.InputHTMLAttributes<HTMLInputElement> te gebruiken: "Mijn TextFieldProps heeft een label en een description, én accepteert verder gewoon alles wat een normaal HTML <input> veld ook accepteert."
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    description?: string;
}

// Export UI Component
export default function TextField({
    label,
    description,
    className,
    ...props
}: TextFieldProps) {

    // Return UI Component
    return (
        <div className="w-full">
            <Field>
                <Label className="text-sm/6 font-medium text-gray-900 dark:text-white">
                    {label}
                </Label>

                {description && (
                    <Description className="text-sm/6 text-gray-500 dark:text-white/50">
                        {description}
                    </Description>
                )}

                <Input
                    {...props}
                    className={`mt-2 block w-full rounded-lg border border-gray-200 dark:border-none bg-gray-50 dark:bg-white/5 px-3 py-2 text-sm/6 text-gray-900 dark:text-white focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-blue-500 ${className || ''}`}
                />
            </Field>
        </div>
    )
}
