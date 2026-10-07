'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Loader2, ArrowRight, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cardFormSchema, type CardFormValues as FormValues } from '@/features/cards/schemas';

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: { bankName: '', cardNumber: '', balance: '' }
  });

  const formatBalance = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const addCardMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const { error } = await supabase.from('cards').insert({
        bank_name: data.bankName,
        card_number: data.cardNumber,
        balance: parseInt(data.balance.replace(/,/g, ''), 10)
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('کارت شما با موفقیت ثبت شد', {
        icon: '🎉',
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#10B981',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      setStep(3); // Success step
    },
    onError: (error) => {
      console.error(error);
      toast.error('خطا در ثبت کارت. لطفا مجدد تلاش کنید.');
    }
  });

  const onSubmit = (data: FormValues) => {
    addCardMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-surface-raised border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-8 shadow-neon">
                <Wallet className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-3xl font-extrabold text-white mb-4">خوش آمدید!</h1>
              <p className="text-foreground-muted mb-8 leading-relaxed">
                به دستیار مالی رسا سامانه خوش آمدید. برای شروع کار، بیایید اولین حساب بانکی یا کارت خود را به سیستم اضافه کنیم تا بتوانید تراکنش‌های خود را مدیریت کنید.
              </p>
              
              <Button onClick={() => setStep(2)} className="w-full h-14 text-lg gap-3">
                شروع راه‌اندازی
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-surface-raised border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">افزودن اولین کارت</h2>
                  <p className="text-sm text-foreground-muted">اطلاعات کارت خود را وارد کنید.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-foreground-muted mb-2">نام بانک</label>
                  <Input 
                    id="bankName"
                    placeholder="مثال: سامان، ملت" 
                    {...register('bankName')} 
                    disabled={addCardMutation.isPending}
                    className="h-14 bg-black/20 focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  {errors.bankName && <p className="text-xs text-red-400 mt-1">{errors.bankName.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground-muted mb-2">شماره کارت (۱۶ رقم)</label>
                  <Input 
                    id="cardNumber"
                    placeholder="xxxx xxxx xxxx xxxx" 
                    dir="ltr"
                    className="h-14 text-left font-mono tracking-[0.2em] bg-black/20 focus-visible:ring-2 focus-visible:ring-primary text-lg"
                    maxLength={16}
                    {...register('cardNumber')} 
                    disabled={addCardMutation.isPending}
                  />
                  {errors.cardNumber && <p className="text-xs text-red-400 mt-1">{errors.cardNumber.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="balance" className="block text-sm font-medium text-foreground-muted mb-2">موجودی اولیه (تومان)</label>
                  <Input 
                    id="balance"
                    placeholder="مثال: 5,000,000" 
                    dir="ltr"
                    className="h-14 text-left font-sans bg-black/20 focus-visible:ring-2 focus-visible:ring-primary text-lg"
                    disabled={addCardMutation.isPending}
                    {...register('balance', {
                      onChange: (e) => { e.target.value = formatBalance(e.target.value); }
                    })} 
                  />
                  {errors.balance && <p className="text-xs text-red-400 mt-1">{errors.balance.message}</p>}
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setStep(1)} 
                    disabled={addCardMutation.isPending}
                    className="w-1/3 border border-white/5"
                  >
                    بازگشت
                  </Button>
                  <Button type="submit" disabled={addCardMutation.isPending} className="w-2/3 h-14 text-lg">
                    {addCardMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'ثبت و ادامه'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-raised border border-emerald-500/20 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.1)] text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 mx-auto bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-8"
              >
                <ShieldCheck className="w-12 h-12" />
              </motion.div>
              
              <h2 className="text-3xl font-extrabold text-white mb-4">تبریک!</h2>
              <p className="text-foreground-muted mb-10 text-lg">
                حساب شما با موفقیت آماده شد. اکنون می‌توانید مدیریت هزینه‌ها و درآمدهای خود را آغاز کنید.
              </p>
              
              <Button 
                onClick={() => {
                  setIsRedirecting(true);
                  router.push('/dashboard');
                }} 
                disabled={isRedirecting}
                className="w-full h-14 text-lg bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-[0_0_20px_rgba(16,185,129,0.3)] gap-2 disabled:opacity-50"
              >
                {isRedirecting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    ورود به داشبورد
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
