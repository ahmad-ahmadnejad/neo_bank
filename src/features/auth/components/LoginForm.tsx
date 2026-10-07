'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.identifier,
      password: data.password,
    });
    if (error) {
      setIsLoading(false);
      loginForm.setError('root', { message: 'ایمیل یا رمز عبور اشتباه است.' });
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <motion.form
      key="login"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
      className="flex flex-col gap-5"
    >
      {loginForm.formState.errors.root && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 text-center" role="alert">
          {loginForm.formState.errors.root.message}
        </div>
      )}
      <div>
        <label htmlFor="identifier" className="sr-only">ایمیل یا نام کاربری</label>
        <Input 
          id="identifier"
          placeholder="ایمیل یا نام کاربری" 
          {...loginForm.register('identifier')} 
          disabled={isLoading}
          dir="ltr"
          className="text-left focus-visible:ring-2 focus-visible:ring-primary outline-none"
        />
        {loginForm.formState.errors.identifier && (
          <p className="text-xs text-red-400 mt-1.5 px-1">{loginForm.formState.errors.identifier.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="sr-only">رمز عبور</label>
        <Input 
          id="password"
          type="password" 
          placeholder="رمز عبور" 
          {...loginForm.register('password')} 
          disabled={isLoading}
          dir="ltr"
          className="text-left font-sans focus-visible:ring-2 focus-visible:ring-primary outline-none"
        />
        {loginForm.formState.errors.password && (
          <p className="text-xs text-red-400 mt-1.5 px-1">{loginForm.formState.errors.password.message}</p>
        )}
        <div className="flex justify-end mt-2">
          <a href="#" className="text-xs text-primary hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">رمز عبور را فراموش کردید؟</a>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full mt-2 h-12 focus-visible:ring-2 focus-visible:ring-primary outline-none">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : 'ورود به حساب'}
      </Button>
    </motion.form>
  );
}
