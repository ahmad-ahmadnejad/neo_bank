'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { User, Mail, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';

export function ProfileManager() {
  const { user, isLoading, updateMutation } = useProfile();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(fullName);
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 max-w-2xl mx-auto bg-surface rounded-3xl border border-white/5" />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">حساب کاربری</h1>
        <p className="text-foreground-muted">مدیریت اطلاعات فردی و تنظیمات حساب</p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-surface border border-white/5 p-6 sm:p-8 rounded-3xl shadow-glass relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-foreground-muted flex items-center gap-2 mb-2">
              <User className="w-4 h-4" aria-hidden="true" /> نام و نام خانوادگی
            </label>
            <input 
              id="fullName"
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="نام خود را وارد کنید"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground-muted flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" aria-hidden="true" /> آدرس ایمیل
            </label>
            <input 
              id="email"
              type="email" 
              value={user?.email || ''}
              disabled
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed outline-none"
            />
            <p className="text-xs text-foreground-muted/70 mt-1">آدرس ایمیل در حال حاضر قابل تغییر نیست.</p>
          </div>

          <div className="pt-4 border-t border-white/5">
            <Button type="submit" disabled={updateMutation.isPending} className="w-full sm:w-auto px-8">
              <Save className="w-4 h-4 ml-2" />
              {updateMutation.isPending ? 'در حال ثبت...' : 'ذخیره تغییرات'}
            </Button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
