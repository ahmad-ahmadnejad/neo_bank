import { createClient } from '@/lib/supabase/server';
import { TransactionsManager } from '@/features/transactions/components/TransactionsManager';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'تراکنش‌ها | دستیار مالی رسا سامانه',
};

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Fetch Cards
  const { data: cards, error: cardsError } = await supabase.from('cards').select('*');
  
  if (cardsError) throw new Error(cardsError.message);

  if (!cards || cards.length === 0) {
    redirect('/onboarding');
  }

  // 2. Fetch Transactions
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (txError) throw new Error(txError.message);

  return <TransactionsManager initialTransactions={transactions || []} cards={cards} />;
}
