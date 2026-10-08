'use client';

import { useRef } from 'react';
import { useTaskStore, Task } from '@/store/useTaskStore';

export default function StoreInitializer({ tasks }: { tasks: Task[] }) {
  const initialized = useRef(false);

  if (!initialized.current) {
    // Populate the Zustand store immediately with fresh data from the Next.js Server
    useTaskStore.getState().setTasks(tasks);
    initialized.current = true;
  }
  
  return null; // This component is invisible and only handles data hydration
}
