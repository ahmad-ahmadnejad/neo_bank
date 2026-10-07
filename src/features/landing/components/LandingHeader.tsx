'use client';

import { Wallet } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-5 bg-background/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#C4B5FD] flex items-center justify-center shadow-neon">
          <Wallet className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <span className="text-white font-extrabold text-xl tracking-tight">رسا سامانه</span>
      </div>



      <div className="flex items-center gap-3">
        <Link href="/login" tabIndex={-1}>
          <Button size="sm" className="px-5 focus-visible:ring-2 focus-visible:ring-primary">شروع مدیریت مالی</Button>
        </Link>
      </div>
    </header>
  );
}
