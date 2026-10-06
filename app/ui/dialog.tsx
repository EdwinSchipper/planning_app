'use client'

import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export interface UIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
}

export default function UIDialog({ isOpen, onClose, title, description, buttonText = "Begrepen" }: UIDialogProps) {
    return (
        <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={onClose}>
            <div className="fixed inset-0 z-50 w-screen overflow-y-auto bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl border border-gray-100 dark:border-zinc-800 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-lg font-bold text-gray-900 dark:text-white">
                            {title}
                        </DialogTitle>
                        <p className="mt-2 text-[15px] text-gray-600 dark:text-zinc-400">
                            {description}
                        </p>
                        <div className="mt-8 flex justify-end">
                            <Button
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                onClick={onClose}
                            >
                                {buttonText}
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
