import { createClient } from '@/lib/supabase/server';
import { DashboardOverview } from '@/features/dashboard/components/DashboardOverview';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import type { CardType } from '@/features/cards/types';
import type { TransactionType } from '@/features/transactions/types';

export const metadata: Metadata = {
  title: 'پیشخوان | دستیار مالی رسا سامانه',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [cardsResult, transactionsResult, statsResult] = await Promise.all([
    supabase.from('cards').select('*').returns<CardType[]>(),
    supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(50).returns<TransactionType[]>(),
    supabase.rpc('get_dashboard_stats')
  ]);

  if (cardsResult.error) throw new Error(cardsResult.error.message);
  if (transactionsResult.error) throw new Error(transactionsResult.error.message);
  if (statsResult.error) throw new Error(statsResult.error.message);

  const cards = cardsResult.data;
  
  if (!cards || cards.length === 0) {
    redirect('/onboarding');
  }

  const transactions = transactionsResult.data;

  return (
    <DashboardOverview 
      cards={cards} 
      transactions={transactions || []} 
      userName={user.user_metadata?.full_name || ''} 
      serverStats={statsResult.data}
    />
  );
}
