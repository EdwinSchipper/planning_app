import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the associated profile (and thus the role and name)
  let role = 'user';
  let fullName = '';
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (profile) {
    role = profile.role;
    fullName = profile.full_name || '';
  }

  // Calculate weekly completed tasks via Task History (since this is not in the tasks table itself)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Maandag als start van de week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - daysToSubtract);
  startOfWeek.setHours(0, 0, 0, 0);

  let completedThisWeekCount = 0;

  const { data: historyData } = await supabase
    .from('task_history')
    .select('task_id')
    .eq('user_id', user.id)
    .gte('created_at', startOfWeek.toISOString())
    .ilike('action', "%Status naar 'Voltooid'%");

  if (historyData) {
    const uniqueTaskIds = new Set(historyData.map(h => h.task_id));
    completedThisWeekCount = uniqueTaskIds.size;
  }

  // Rendert het client component. De taken zitten al in het geheugen dankzij layout.tsx!
  return (
    <DashboardClient 
      userId={user.id}
      fullName={fullName}
      email={user.email || ''}
      role={role}
      completedThisWeekCount={completedThisWeekCount}
    />
  );
}