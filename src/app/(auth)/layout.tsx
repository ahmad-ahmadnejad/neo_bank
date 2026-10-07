import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-background">
      {/* Deep Dark Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#C4B5FD]/10 blur-[120px] rounded-full" />
      </div>
      
      <div className="relative z-10 w-full max-w-[420px]">
        {children}
      </div>
    </div>
  );
}
