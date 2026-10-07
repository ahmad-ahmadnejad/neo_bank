'use client';

import * as React from 'react';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <Card className="p-8 sm:p-10 w-full relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/5">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#C4B5FD] flex items-center justify-center shadow-neon">
            <Wallet className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
        </Link>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isLogin ? 'خوش آمدید' : 'ساخت حساب کاربری'}
        </h2>
        <p className="text-foreground-muted text-sm text-center">
          {isLogin 
            ? 'برای مدیریت هوشمندانه مالی خود وارد شوید' 
            : 'به جمع کاربران دستیار مالی رسا سامانه بپیوندید'}
        </p>
      </div>

      {/* Form Container with Animation */}
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          {isLogin ? (
            <LoginForm key="login" />
          ) : (
            <RegisterForm key="register" />
          )}
        </AnimatePresence>
      </div>

      {/* Footer Toggle */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-sm">
        <span className="text-foreground-muted">
          {isLogin ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کرده‌اید؟'}
        </span>
        <button 
          onClick={toggleMode}
          className="text-primary font-medium hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded px-1"
        >
          {isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}
        </button>
      </div>
    </Card>
  );
}
