import { Button } from '@headlessui/react'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface UIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export default function UIButton({ children, className, ...props }: UIButtonProps) {
    return (
        <Button
            {...props}
            className={`py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium focus:ring-4 focus:ring-blue-500/50 transition-all shadow-lg shadow-blue-500/30 outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 data-[active]:scale-95 ${className || ''}`}
        >
            {children}
        </Button>
    )
}
