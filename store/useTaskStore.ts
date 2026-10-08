import { create } from 'zustand';

// --- REUSABLE LOGIC (UTILS) ---
// Placed here so both the store and individual components can use this logic
export function isThisWeek(dateString?: string | null) {
  if (!dateString) return false;
  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + daysUntilSunday);
  endOfWeek.setHours(23, 59, 59, 999);

  return targetDate <= endOfWeek;
}

// 1. Define the Types for our Task (Mapped to Supabase 'db_tasks')
export type Task = {
  id: number;              // Supabase ID
  type: string;
  status: string;          // e.g., 'Open' or 'Voltooid'
  userID: string | null;   // The ID of the assigned user
  task_title: string;      // Task title
  task_content?: string;   // Task Text (description)
  date_start?: string | null; // Start date (ISO string)
  date_end?: string | null;   // End date (ISO string)
  estimated_hours?: number;   // Estimated hours
};

// 2. Define the shape of our Store (State + Actions)
type TaskStore = {
  tasks: Task[];           // Where we store the data (the cache)
  isLoading: boolean;      // Useful for showing a loading spinner
  error: string | null;    // In case fetching fails

  // --- ACTIONS ---
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;

  // Helper: a generic function to update ANY field of a task
  updateTask: (id: number, updates: Partial<Task>) => void;
  removeTask: (id: number) => void;

  // --- GETTERS (Derived State, similar to Pinia!) ---
  // Adding Getters prevents components from doing the calculation themselves.
  getTasksThisWeek: () => Task[];
  getTasksFuture: () => Task[];
  getCompletedTasks: () => Task[];
  getOpenTasks: () => Task[];
};

// 3. Create the actual Zustand store
// <TaskStore> is the Generic! It tells Zustand exactly what the store looks like.
export const useTaskStore = create<TaskStore>((set, get) => ({
  // --- STATE ---
  tasks: [],
  isLoading: false,
  error: null,

  // --- ACTIONS ---
  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t =>
      t.id === id ? { ...t, ...updates } : t
    )
  })),

  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),

  // --- GETTERS IMPLEMENTATION ---
  // Any client component can now call this: const tasks = useTaskStore(state => state.getTasksThisWeek())
  getTasksThisWeek: () => {
    const tasks = get().tasks;
    return tasks.filter(t => t.date_end ? isThisWeek(t.date_end) : (t.date_start ? isThisWeek(t.date_start) : false));
  },

  getTasksFuture: () => {
    const tasks = get().tasks;
    return tasks.filter(t => t.date_end ? !isThisWeek(t.date_end) : (t.date_start ? !isThisWeek(t.date_start) : true));
  },

  getCompletedTasks: () => {
    return get().tasks.filter(t => t.status === 'Voltooid');
  },

  getOpenTasks: () => {
    return get().tasks.filter(t => t.status !== 'Voltooid');
  }
}));
