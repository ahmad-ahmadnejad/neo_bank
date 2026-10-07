'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, CreditCard, Calendar, Hash, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TransactionType } from '../types';
import { Button } from '@/components/ui/Button';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionType | null;
  cardName: string;
}

export function TransactionDetailsModal({ isOpen, onClose, transaction, cardName }: TransactionDetailsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && transaction && !dialog.open) {
      dialog.showModal();
    }

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [isOpen, transaction, onClose]);

  if (!transaction) return null;

  const isIncome = transaction.type === 'INCOME';
  
  const date = new Date(transaction.created_at).toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const time = new Date(transaction.created_at).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <dialog 
      ref={dialogRef} 
      className="bg-transparent m-0 p-0 max-w-none max-h-none w-full h-full backdrop:bg-transparent overflow-hidden"
    >
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
              aria-hidden="true"
            />
            <div className="fixed inset-0 z-10 flex items-center justify-center p-4 pointer-events-none">
              <motion.section
                role="dialog"
                aria-modal="true"
                aria-labelledby="details-modal-title"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-md bg-surface-raised border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 pointer-events-auto relative overflow-hidden"
              >
                <div className={cn(
                  "absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-20",
                  isIncome ? "bg-emerald-500" : "bg-rose-500"
                )} aria-hidden="true" />

                <header className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shadow-neon",
                      isIncome ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                    )}>
                      <Receipt className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 id="details-modal-title" className="text-xl font-bold text-white">جزئیات تراکنش</h3>
                  </div>
                  <button onClick={onClose} aria-label="بستن" className="p-2 text-foreground-muted hover:text-white bg-white/5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none">
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </header>

                <div className="flex flex-col items-center mb-8 relative z-10">
                  <span className={cn(
                    "font-mono text-4xl font-bold mb-2 tracking-wider",
                    isIncome ? "text-emerald-400" : "text-rose-400"
                  )}>
                    <span className="font-sans text-2xl ml-1" aria-hidden="true">{isIncome ? '+' : '-'}</span>
                    {transaction.amount.toLocaleString()}
                  </span>
                  <span className="text-foreground-muted text-sm">تومان</span>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 text-foreground-muted">
                      <Tag className="w-5 h-5 opacity-70" aria-hidden="true" />
                      <span>دسته‌بندی</span>
                    </div>
                    <span className="font-bold text-white">{transaction.category}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 text-foreground-muted">
                      <CreditCard className="w-5 h-5 opacity-70" aria-hidden="true" />
                      <span>کارت مرتبط</span>
                    </div>
                    <span className="font-bold text-white">{cardName}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 text-foreground-muted">
                      <Calendar className="w-5 h-5 opacity-70" aria-hidden="true" />
                      <span>زمان ثبت</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-white">{date}</span>
                      <span className="text-xs text-foreground-muted mt-0.5">{time}</span>
                    </div>
                  </div>

                  {transaction.description && (
                    <div className="flex flex-col gap-2 p-4 bg-black/20 rounded-2xl border border-white/5">
                      <span className="text-foreground-muted text-sm flex items-center gap-2">
                        <Hash className="w-4 h-4 opacity-70" aria-hidden="true" />
                        توضیحات تکمیلی
                      </span>
                      <span className="text-white leading-relaxed">{transaction.description}</span>
                    </div>
                  )}
                </div>

                <footer className="mt-8 relative z-10">
                  <Button onClick={onClose} className="w-full bg-white/10 hover:bg-white/20 text-white border-none h-12 focus-visible:ring-2 focus-visible:ring-primary outline-none">
                    بستن
                  </Button>
                </footer>

              </motion.section>
            </div>
          </>
        )}
      </AnimatePresence>
    </dialog>
  );
}
