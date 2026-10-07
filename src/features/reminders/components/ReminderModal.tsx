'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, BellPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";

import { reminderFormSchema, type ReminderFormValues as FormValues } from '../schemas';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { description: string; amount: number; due_date: string }) => void;
}

export function ReminderModal({ isOpen, onClose, onSubmit }: ReminderModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { register, control, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: { description: '', amount: '', due_date: null }
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      reset({ description: '', amount: '', due_date: null });
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
  }, [isOpen, reset, onClose]);

  const formatAmount = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const submitHandler = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Parse the DateObject from react-multi-date-picker
      const dateObj = data.due_date as DateObject;
      const gregorianDateStr = dateObj.toDate().toISOString();

      await onSubmit({
        description: data.description,
        amount: parseInt(data.amount.replace(/,/g, ''), 10),
        due_date: gregorianDateStr
      });
      reset();
    } catch (err) {
      // Error handled by hook
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
                aria-labelledby="reminder-modal-title"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-md bg-surface-raised border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 pointer-events-auto"
              >
                <header className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-neon">
                      <BellPlus className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 id="reminder-modal-title" className="text-xl font-bold text-white">ثبت یادآور جدید</h3>
                  </div>
                  <button onClick={onClose} aria-label="بستن" className="p-2 text-foreground-muted hover:text-white bg-white/5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none">
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </header>

                <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="description" className="sr-only">عنوان یادآور</label>
                    <Input 
                      id="description"
                      placeholder="بابت چه چیزی؟ (مثلا: قسط وام، اجاره)" 
                      {...register('description')} 
                      disabled={isSubmitting}
                      className="focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className="sr-only">مبلغ</label>
                    <Input 
                      id="amount"
                      placeholder="مبلغ (تومان)" 
                      dir="ltr"
                      className="text-left font-sans tracking-widest focus-visible:ring-2 focus-visible:ring-primary"
                      disabled={isSubmitting}
                      {...register('amount', {
                        onChange: (e) => { setValue('amount', formatAmount(e.target.value), { shouldValidate: true, shouldDirty: true }); }
                      })} 
                    />
                    {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>}
                  </div>

                  <div className="relative">
                    <label className="text-xs text-foreground-muted mb-2 block">زمان یادآوری (تاریخ و ساعت)</label>
                    <Controller
                      control={control}
                      name="due_date"
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          value={value}
                          onChange={onChange}
                          calendar={persian}
                          locale={persian_fa}
                          format="YYYY/MM/DD HH:mm"
                          plugins={[<TimePicker position="bottom" hideSeconds />]}
                          minDate={new Date()}
                          className="bg-dark"
                          containerClassName="w-full block"
                          inputClass="w-full h-14 rounded-xl border border-white/10 bg-surface px-4 text-sm text-white outline-none focus:ring-2 focus:ring-primary dir-ltr text-center font-mono placeholder:font-sans focus-visible:ring-2 focus-visible:ring-primary"
                          placeholder="انتخاب زمان..."
                          disabled={isSubmitting}
                        />
                      )}
                    />
                    {errors.due_date && <p className="text-xs text-red-400 mt-1">{errors.due_date.message as string}</p>}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                    <Button type="button" variant="ghost" onClick={onClose} className="w-1/3 border border-white/10 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary outline-none" disabled={isSubmitting}>
                      انصراف
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-2/3 gap-2 bg-blue-500 hover:bg-blue-600 text-white border-none shadow-[0_0_20px_rgba(59,130,246,0.3)] focus-visible:ring-2 focus-visible:ring-primary outline-none"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : 'ثبت و تنظیم'}
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
