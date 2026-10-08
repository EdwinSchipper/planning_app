import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PlanningClient from './planning-client';

export default async function PlanningPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <PlanningClient currentUserId={user.id} />;
}
