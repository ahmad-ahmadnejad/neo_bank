'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 w-full">
      <div className="bg-surface border border-white/10 p-8 rounded-3xl max-w-md w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20 shadow-inner">
          <AlertTriangle className="w-8 h-8 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">خطای ارتباط با سرور</h2>
        <p className="text-foreground-muted mb-8 text-sm leading-relaxed">
          متاسفانه در دریافت اطلاعات مشکلی پیش آمده است. اتصال اینترنت خود را بررسی کرده و صفحه را مجدداً بارگذاری کنید.
        </p>
        <div className="w-full flex flex-col gap-3">
          <Button onClick={() => reset()} className="w-full flex items-center justify-center gap-2 group shadow-neon focus-visible:ring-2 focus-visible:ring-primary">
            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            تلاش مجدد
          </Button>
        </div>
      </div>
    </div>
  );
}
