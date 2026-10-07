'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import type { CardType } from '@/features/cards/types';
import { expenseCategories, incomeCategories } from '../constants';

import { transactionFormSchema, type TransactionFormValues as FormValues } from '../schemas';

import type { TransactionType } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'INCOME' | 'EXPENSE';
  cards: CardType[];
  onSubmit: (data: Omit<TransactionType, 'id' | 'created_at'>) => void;
}

export function TransactionModal({ isOpen, onClose, type, cards, onSubmit }: TransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const categories = type === 'EXPENSE' ? expenseCategories : incomeCategories;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: { card_id: cards[0]?.id || '', amount: '', category: categories[0], description: '' }
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      reset({ card_id: cards[0]?.id || '', amount: '', category: categories[0], description: '' });
      if (!dialog.open) {
        dialog.showModal();
      }
    }

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [isOpen, type, cards, categories, reset, onClose]);

  const formatAmount = (value: string) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const submitHandler = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        card_id: data.card_id,
        type,
        amount: parseInt(data.amount.replace(/,/g, ''), 10),
        category: data.category,
        description: data.description || ''
      });
      reset();
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <div className="fixed inset-0 z-10 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
              <motion.section
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-md bg-surface-raised sm:border border-white/10 sm:rounded-3xl rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 pointer-events-auto h-[90vh] sm:h-auto overflow-y-auto"
              >
                <header className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      type === 'INCOME' ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                    )}>
                      {type === 'INCOME' ? <ArrowUpRight className="w-5 h-5" aria-hidden="true" /> : <ArrowDownLeft className="w-5 h-5" aria-hidden="true" />}
                    </div>
                    <h3 id="modal-title" className="text-xl font-bold text-white">
                      {type === 'INCOME' ? 'ثبت درآمد جدید' : 'ثبت هزینه جدید'}
                    </h3>
                  </div>
                  <button onClick={onClose} aria-label="بستن" className="p-2 text-foreground-muted hover:text-white bg-white/5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none">
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </header>

                <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="card_id" className="text-xs text-foreground-muted mb-2 block">کارت بانکی مبدا/مقصد</label>
                    <select 
                      id="card_id"
                      {...register('card_id')}
                      className="w-full h-14 rounded-xl border border-white/10 bg-surface px-4 text-sm text-white outline-none focus:ring-2 focus:ring-primary appearance-none focus-visible:ring-2 focus-visible:ring-primary"
                      disabled={isSubmitting}
                    >
                      {cards.map(card => (
                        <option key={card.id} value={card.id}>
                          {card.bank_name} ({card.card_number.slice(-4)})
                        </option>
                      ))}
                    </select>
                    {errors.card_id && <p className="text-xs text-red-400 mt-1">{errors.card_id.message}</p>}
                  </div>

                  <div>
                    <Input 
                      placeholder="مبلغ (تومان)" 
                      dir="ltr"
                      className="text-left font-sans text-xl h-16 focus-visible:ring-2 focus-visible:ring-primary"
                      disabled={isSubmitting}
                      {...register('amount', {
                        onChange: (e) => { setValue('amount', formatAmount(e.target.value), { shouldValidate: true, shouldDirty: true }); }
                      })} 
                    />
                    {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="category" className="text-xs text-foreground-muted mb-2 block">دسته‌بندی</label>
                    <select 
                      id="category"
                      {...register('category')}
                      className="w-full h-14 rounded-xl border border-white/10 bg-surface px-4 text-sm text-white outline-none focus:ring-2 focus:ring-primary appearance-none focus-visible:ring-2 focus-visible:ring-primary"
                      disabled={isSubmitting}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>}
                  </div>

                  <div>
                    <Input 
                      placeholder="توضیحات (اختیاری)" 
                      {...register('description')} 
                      disabled={isSubmitting}
                      className="focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className={cn(
                        "w-full h-14 gap-2 text-white border-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary outline-none",
                        type === 'INCOME' ? "bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-rose-500 hover:bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                      )}
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : 'ثبت تراکنش'}
                    </Button>
                  </div>
                </form>
              </motion.section>
            </div>
          </>
        )}
      </AnimatePresence>
    </dialog>
  );
}
