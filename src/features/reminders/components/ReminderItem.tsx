'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { ReminderType } from '../types';

interface ReminderItemProps {
  reminder: ReminderType;
  onDelete: (id: string) => void;
}

function calculateTimeLeft(dueDate: string) {
  const diff = new Date(dueDate).getTime() - new Date().getTime();
  if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  return {
    expired: false,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center bg-surface-raised rounded-xl p-2 min-w-[3.5rem] border border-white/5 shadow-inner">
    <span className="font-mono font-bold text-lg tabular-nums leading-none mb-1 text-white">{String(value).padStart(2, '0')}</span>
    <span className="text-[10px] text-foreground-muted font-sans uppercase">{label}</span>
  </div>
);

export function ReminderItem({ reminder, onDelete }: ReminderItemProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(reminder.due_date));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(reminder.due_date));
    }, 1000);
    return () => clearInterval(timer);
  }, [reminder.due_date]);

  const { expired, days, hours, minutes, seconds } = timeLeft;

  const isUrgent = !expired && days === 0 && hours < 24;

  return (
    <motion.li 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        "relative p-6 rounded-2xl border transition-all duration-300 group overflow-hidden list-none",
        expired ? "bg-rose-500/5 border-rose-500/20" : 
        isUrgent ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : 
        "bg-surface border-white/5 hover:border-white/10"
      )}
    >
      {/* Glow Effect */}
      {isUrgent && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" aria-hidden="true" />}
      {expired && <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" aria-hidden="true" />}

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-neon",
            expired ? "bg-rose-500/20 text-rose-400" : 
            isUrgent ? "bg-amber-500/20 text-amber-400 animate-pulse" : 
            "bg-blue-500/20 text-blue-400"
          )}>
            <Bell className="w-6 h-6" aria-hidden="true" />
          </div>
          
          <div>
            <h3 className="font-bold text-white text-lg mb-1">{reminder.description}</h3>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted text-sm">مبلغ:</span>
              <span className="font-mono text-base text-slate-200">{reminder.amount.toLocaleString()}</span>
              <span className="text-[10px] text-foreground-muted">تومان</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
          {isClient && (
            <div className="flex items-center gap-1.5" dir="ltr">
              {expired ? (
                <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-5 py-3 rounded-xl w-full justify-center border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                  <span className="font-bold text-sm tracking-wide">سررسید پرداخت گذشته است!</span>
                </div>
              ) : (
                <>
                  <TimeUnit value={days} label="روز" />
                  <span className="text-white/20 font-bold mb-4" aria-hidden="true">:</span>
                  <TimeUnit value={hours} label="ساعت" />
                  <span className="text-white/20 font-bold mb-4" aria-hidden="true">:</span>
                  <TimeUnit value={minutes} label="دقیقه" />
                  <span className="text-white/20 font-bold mb-4" aria-hidden="true">:</span>
                  <TimeUnit value={seconds} label="ثانیه" />
                </>
              )}
            </div>
          )}

          <div className="flex items-center justify-end w-full">
            <button 
              onClick={() => onDelete(reminder.id)}
              aria-label={`حذف یادآور ${reminder.description}`}
              className="p-2 text-foreground-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors md:opacity-0 md:group-hover:opacity-100 flex items-center gap-2 text-sm focus-visible:ring-2 focus-visible:ring-rose-500 outline-none"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              حذف یادآور
            </button>
          </div>
        </div>

      </div>
    </motion.li>
  );
}
