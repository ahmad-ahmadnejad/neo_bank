'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Wallet, PieChart, Calendar, Bell } from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

export function LandingHero() {
  return (
    <main className="relative flex-1 flex flex-col justify-center items-center px-6 sm:px-12 pt-32 pb-20 overflow-hidden">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[0%] right-[-5%] w-[500px] h-[500px] bg-success/15 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center gap-20 lg:gap-12"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Text Content */}
        <section className="flex-1 text-center lg:text-right">
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Bell className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm text-white/90 font-medium">دستیار هوشمند مالی شما</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold text-white leading-[1.3] mb-8 tracking-tight">
            مدیریت مالی <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-[#C4B5FD] drop-shadow-sm">هوشمند</span> و بی‌دغدغه
          </h1>

          <motion.p variants={fadeIn} className="text-lg sm:text-xl text-foreground-muted mb-12 leading-loose max-w-2xl mx-auto lg:mx-0 font-light">
            موجودی حساب‌ها، تراکنش‌ها، دسته‌بندی هزینه‌ها و یادآورهای پرداخت خود را به سادگی در یک نمای یکپارچه مدیریت کنید و همیشه یک قدم جلوتر باشید.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/login" className="w-full sm:w-auto" tabIndex={-1}>
              <Button size="lg" className="w-full gap-3 group px-8 focus-visible:ring-2 focus-visible:ring-primary">
                ورود به داشبورد
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-300" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Floating Visuals / App Preview Elements */}
        <motion.figure
          className="flex-1 relative w-full max-w-lg aspect-[4/3] lg:aspect-square flex items-center justify-center"
          variants={fadeIn}
          aria-label="پیش‌نمایش امکانات اپلیکیشن"
        >
          {/* Main Balance Card */}
          <motion.div
            className="absolute top-[10%] lg:right-[15%] right-[5%] w-[90%] sm:w-[80%] z-20"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Card className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">موجودی کل</h3>
                    <p className="text-foreground-muted text-xs">به‌روزرسانی لحظه‌ای</p>
                  </div>
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight flex items-baseline gap-2">
                <span>۴۵,۵۰۰,۰۰۰</span>
                <span className="text-lg text-white/50 font-normal">تومان</span>
              </div>
              <div className="text-sm font-medium text-success flex items-center gap-1.5 mt-4">
                <span className="bg-success/10 px-2 py-0.5 rounded text-success">+۲.۴٪</span>
                <span className="text-foreground-muted">افزایش پس‌انداز این ماه</span>
              </div>
            </Card>
          </motion.div>

          {/* Reminder Card */}
          <motion.div
            className="absolute bottom-[5%] lg:bottom-[15%] right-0 w-[70%] sm:w-[60%] z-30"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Card className="p-5 flex items-center gap-4 border-r-4 border-r-primary">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <div className="text-white font-bold text-[15px] mb-0.5">اقساط وام خودرو</div>
                <div className="text-foreground-muted text-xs">یادآوری پرداخت: فردا</div>
              </div>
            </Card>
          </motion.div>

          {/* Categories Chart Card */}
          <motion.div
            className="absolute top-[35%] left-[-5%] w-[65%] sm:w-[55%] z-10 hidden sm:block"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <Card className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <PieChart className="w-5 h-5 text-success" aria-hidden="true" />
                <span className="text-white text-sm font-medium">هزینه‌های این ماه</span>
              </div>

              {/* Multi-color Progress Bar */}
              <div className="w-full h-3 bg-surface-raised rounded-full overflow-hidden shadow-inner flex">
                <div className="w-[50%] h-full bg-gradient-to-l from-primary to-[#C4B5FD]" />
                <div className="w-[30%] h-full bg-success" />
                <div className="w-[20%] h-full bg-[#FF9A00]" />
              </div>

              <div className="flex justify-between text-[11px] text-foreground-muted w-full font-medium">
                <span>خرید روزمره ۵۰٪</span>
                <span>رستوران ۳۰٪</span>
              </div>
            </Card>
          </motion.div>
        </motion.figure>
      </motion.div>
    </main>
  );
}
