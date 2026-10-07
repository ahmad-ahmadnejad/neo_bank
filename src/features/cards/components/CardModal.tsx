'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { CardType } from '../types';

import { cardFormSchema, type CardFormValues as FormValues } from '../schemas';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CardType, 'id'>, id?: string) => void;
  editingCard: CardType | null;
}

export function CardModal({ isOpen, onClose, onSubmit, editingCard }: CardModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: { bankName: '', cardNumber: '', balance: '' }
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (editingCard) {
        reset({
          bankName: editingCard.bank_name,
          cardNumber: editingCard.card_number,
          balance: editingCard.balance.toLocaleString()
        });
      } else {
        reset({ bankName: '', cardNumber: '', balance: '' });
      }
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
  }, [isOpen, editingCard, reset, onClose]);

  const formatBalance = (value: string) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const submitHandler = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        bank_name: data.bankName,
        card_number: data.cardNumber,
        balance: parseInt(data.balance.replace(/,/g, ''), 10)
      }, editingCard?.id);
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
            <div className="fixed inset-0 z-10 flex items-center justify-center p-4 pointer-events-none">
              <motion.section
                role="dialog"
                aria-modal="true"
                aria-labelledby="card-modal-title"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-md bg-surface-raised border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 pointer-events-auto"
              >
                <header className="flex items-center justify-between mb-6">
                  <h3 id="card-modal-title" className="text-xl font-bold text-white">
                    {editingCard ? 'ویرایش کارت بانکی' : 'افزودن کارت جدید'}
                  </h3>
                  <button onClick={onClose} aria-label="بستن" className="p-2 text-foreground-muted hover:text-white hover:bg-white/5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none">
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </header>

                <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="bankName" className="sr-only">نام بانک</label>
                    <Input 
                      id="bankName"
                      placeholder="نام بانک (مثل: سامان)" 
                      {...register('bankName')} 
                      disabled={isSubmitting}
                      className="focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    {errors.bankName && <p className="text-xs text-red-400 mt-1">{errors.bankName.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="cardNumber" className="sr-only">شماره کارت</label>
                    <Input 
                      id="cardNumber"
                      placeholder="شماره کارت ۱۶ رقمی" 
                      dir="ltr"
                      className="text-left font-sans tracking-widest focus-visible:ring-2 focus-visible:ring-primary"
                      maxLength={16}
                      {...register('cardNumber')} 
                      disabled={isSubmitting}
                    />
                    {errors.cardNumber && <p className="text-xs text-red-400 mt-1">{errors.cardNumber.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="balance" className="sr-only">موجودی</label>
                    <Input 
                      id="balance"
                      placeholder="موجودی فعلی (تومان)" 
                      dir="ltr"
                      className="text-left font-sans focus-visible:ring-2 focus-visible:ring-primary"
                      disabled={isSubmitting}
                      {...register('balance', {
                        onChange: (e) => { setValue('balance', formatBalance(e.target.value), { shouldValidate: true, shouldDirty: true }); }
                      })} 
                    />
                    {errors.balance && <p className="text-xs text-red-400 mt-1">{errors.balance.message}</p>}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <Button type="button" variant="ghost" onClick={onClose} className="w-full focus-visible:ring-2 focus-visible:ring-primary outline-none" disabled={isSubmitting}>
                      انصراف
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : 'ذخیره کارت'}
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
