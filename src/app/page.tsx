
import { LandingHeader } from '@/features/landing/components/LandingHeader';
import { LandingHero } from '@/features/landing/components/LandingHero';
import { LandingReminders } from '@/features/landing/components/LandingReminders';
import { LandingFooter } from '@/features/landing/components/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      <LandingHeader />
      <LandingHero />
      <LandingReminders />
      <LandingFooter />
    </div>
  );
}
