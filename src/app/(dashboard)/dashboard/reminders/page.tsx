import { createClient } from '@/lib/supabase/server';
import { RemindersManager } from '@/features/reminders/components/RemindersManager';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'یادآورها | دستیار مالی رسا سامانه',
};

export default async function RemindersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Reminders sorted by closest due date first
  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')
    .order('due_date', { ascending: true });

  if (error) throw new Error(error.message);

  return <RemindersManager initialReminders={reminders || []} />;
}
