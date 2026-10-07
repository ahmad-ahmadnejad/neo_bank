'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Bell, Calendar } from 'lucide-react';
import Link from 'next/link';

export function LandingReminders() {
  return (
    <section id="reminders" className="relative py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24 overflow-hidden" aria-labelledby="reminders-heading">
      
      {/* Visual / Cards */}
      <figure className="flex-1 w-full relative h-[400px] flex flex-col items-center justify-center gap-6 px-4" aria-hidden="true">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.article 
          initial={{ opacity: 0, y: 30, x: 20 }}
          whileInView={{ opacity: 1, y: 0, x: 20 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="z-20 w-full sm:w-[420px] self-end"
        >
          <div className="bg-surface-raised border border-white/10 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between backdrop-blur-xl hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center shadow-inner border border-rose-500/20">
                <Bell className="w-6 h-6 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">قسط وام مسکن</h4>
                <p className="text-xs text-rose-400">سررسید: فردا (۱۵ آبان)</p>
              </div>
            </div>
            <div className="text-left">
              <div className="text-white font-bold font-mono text-lg">۴,۵۰۰,۰۰۰</div>
              <div className="text-[10px] text-foreground-muted">تومان</div>
            </div>
          </div>
        </motion.article>

        <motion.article 
          initial={{ opacity: 0, y: 30, x: -20 }}
          whileInView={{ opacity: 1, y: 0, x: -20 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="z-10 w-full sm:w-[420px] self-start"
        >
           <div className="bg-surface border border-white/5 p-5 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-between backdrop-blur-xl hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shadow-inner border border-emerald-500/20">
                <Calendar className="w-6 h-6 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">شارژ ساختمان</h4>
                <p className="text-xs text-foreground-muted">سررسید: ۲۰ آبان</p>
              </div>
            </div>
            <div className="text-left">
              <div className="text-white font-bold font-mono text-lg">۸۰۰,۰۰۰</div>
              <div className="text-[10px] text-foreground-muted">تومان</div>
            </div>
          </div>
        </motion.article>
      </figure>

      {/* Content */}
      <motion.div 
        className="flex-1 text-center lg:text-right"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
          <Bell className="w-4 h-4" aria-hidden="true" />
          یادآورهای هوشمند
        </div>
        <h2 id="reminders-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
          هیچ پرداختی را <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-rose-400 to-rose-600">فراموش نکنید!</span>
        </h2>
        <p className="text-foreground-muted text-lg sm:text-xl leading-relaxed mb-8 font-light">
          با سیستم یادآور هوشمند رسا سامانه، تمامی اقساط، چک‌ها و قبوض خود را به سادگی ثبت کنید. سیستم پیش از فرا رسیدن موعد پرداخت، شما را مطلع می‌کند تا دیگر نگران جریمه‌های دیرکرد نباشید.
        </p>
        <ul className="space-y-4 mb-10 text-right">
          {[
            'اطلاع‌رسانی دقیق پیش از سررسید',
            'دسته‌بندی پرداخت‌های دوره‌ای و یک‌باره',
            'مدیریت یکپارچه تمامی بدهی‌ها در یک نگاه'
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-white/90 font-medium">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                <div className="w-2 h-2 rounded-full bg-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
        <Link href="/login" tabIndex={-1}>
          <Button size="lg" className="w-full sm:w-auto px-8 gap-3 group shadow-neon text-base focus-visible:ring-2 focus-visible:ring-primary">
            ثبت اولین یادآور
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-300" aria-hidden="true" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
