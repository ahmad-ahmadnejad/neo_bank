import { createClient } from '@/lib/supabase/server';
import { CardsManager } from '@/features/cards/components/CardsManager';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'کارت‌های من | دستیار مالی رسا سامانه',
};

export default async function CardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's cards
  const { data: cards, error } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return <CardsManager initialCards={cards || []} />;
}
