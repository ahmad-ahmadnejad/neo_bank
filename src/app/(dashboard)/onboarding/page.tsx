import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'راه‌اندازی حساب | دستیار مالی رسا سامانه',
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user already has cards
  const { data: cards } = await supabase.from('cards').select('id').limit(1);
  
  if (cards && cards.length > 0) {
    // Already onboarded
    redirect('/dashboard');
  }

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
      <OnboardingWizard />
    </div>
  );
}
