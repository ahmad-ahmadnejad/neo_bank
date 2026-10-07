'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerSchema, type RegisterFormValues } from '../schemas/auth.schema';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export function RegisterForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        }
      }
    });
    if (error) {
      setIsLoading(false);
      if (error.code === 'user_already_exists') {
        registerForm.setError('root', { message: 'شما قبلا ثبت نام کرده اید.' });
      } else {
        registerForm.setError('root', { message: 'خطایی در ثبت‌نام رخ داد.' });
      }
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <motion.form
      key="register"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
      className="flex flex-col gap-4"
    >
      {registerForm.formState.errors.root && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 text-center" role="alert">
          {registerForm.formState.errors.root.message}
        </div>
      )}
      <div>
        <label htmlFor="reg-fullName" className="sr-only">نام و نام خانوادگی</label>
        <Input 
          id="reg-fullName"
          placeholder="نام و نام خانوادگی" 
          {...registerForm.register('fullName')} 
          disabled={isLoading}
          className="focus-visible:ring-2 focus-visible:ring-primary outline-none"
        />
        {registerForm.formState.errors.fullName && (
          <p className="text-xs text-red-400 mt-1 px-1">{registerForm.formState.errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reg-email" className="sr-only">ایمیل</label>
        <Input 
          id="reg-email"
          placeholder="ایمیل" 
          type="email"
          dir="ltr"
          className="text-left focus-visible:ring-2 focus-visible:ring-primary outline-none"
          {...registerForm.register('email')} 
          disabled={isLoading}
        />
        {registerForm.formState.errors.email && (
          <p className="text-xs text-red-400 mt-1 px-1">{registerForm.formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="reg-password" className="sr-only">رمز عبور</label>
          <Input 
            id="reg-password"
            type="password" 
            placeholder="رمز عبور" 
            dir="ltr"
            className="text-left font-sans focus-visible:ring-2 focus-visible:ring-primary outline-none"
            {...registerForm.register('password')} 
            disabled={isLoading}
          />
          {registerForm.formState.errors.password && (
            <p className="text-xs text-red-400 mt-1 px-1">{registerForm.formState.errors.password.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="reg-confirmPassword" className="sr-only">تکرار رمز</label>
          <Input 
            id="reg-confirmPassword"
            type="password" 
            placeholder="تکرار رمز" 
            dir="ltr"
            className="text-left font-sans focus-visible:ring-2 focus-visible:ring-primary outline-none"
            {...registerForm.register('confirmPassword')} 
            disabled={isLoading}
          />
          {registerForm.formState.errors.confirmPassword && (
            <p className="text-xs text-red-400 mt-1 px-1">{registerForm.formState.errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full mt-4 h-12 focus-visible:ring-2 focus-visible:ring-primary outline-none">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : 'ثبت نام'}
      </Button>
    </motion.form>
  );
}
