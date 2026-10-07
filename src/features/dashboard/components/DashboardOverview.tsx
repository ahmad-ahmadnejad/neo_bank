'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import Link from 'next/link';

import { Wallet, TrendingUp, TrendingDown, ArrowLeft, Search, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { createClient } from '@/lib/supabase/client';

import { TransactionItem } from '@/features/transactions/components/TransactionItem';
import { TransactionDetailsModal } from '@/features/transactions/components/TransactionDetailsModal';

import type { TransactionType } from '@/features/transactions/types';
import type { CardType } from '@/features/cards/types';

interface DashboardOverviewProps {
  cards: CardType[];
  transactions: TransactionType[];
  userName: string;
  serverStats?: any;
}

export function DashboardOverview({ cards: initialCards, transactions: initialTransactions, userName, serverStats: initialStats }: DashboardOverviewProps) {
  const supabase = createClient();

  const { data: cards = [] } = useQuery({
    queryKey: queryKeys.cards.all,
    queryFn: async () => {
      const { data, error } = await supabase.from('cards').select('*');
      if (error) throw error;
      return data as CardType[];
    },
    initialData: initialCards,
    staleTime: 1000 * 60 * 5,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as TransactionType[];
    },
    initialData: initialTransactions,
    staleTime: 1000 * 60 * 5,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);

  const { data: stats } = useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      if (error) throw error;
      return data;
    },
    initialData: initialStats,
    staleTime: 1000 * 60 * 5,
  });

  const { totalBalance, totalIncome, totalExpense, pieChartData, barChartData } = useMemo(() => {
    const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);

    let calcTotalIncome = 0;
    let calcTotalExpense = 0;
    let bChartData: any[] = [];

    if (stats) {
      calcTotalIncome = stats.total_income || 0;
      calcTotalExpense = stats.total_expense || 0;

      // Reconstruct historical balances
      const initialBalance = totalBalance - (calcTotalIncome - calcTotalExpense);
      const monthlyDataMap = new Map<string, number>();
      
      let runningBalance = initialBalance;
      const monthlyStats = Array.isArray(stats.monthly_stats) ? stats.monthly_stats : [];
      
      if (monthlyStats.length > 0) {
        monthlyStats.forEach((stat: any) => {
          const date = new Date(stat.month_date + '-01');
          const monthName = date.toLocaleDateString('fa-IR', { month: 'short', year: 'numeric' });
          runningBalance += stat.income;
          runningBalance -= stat.expense;
          monthlyDataMap.set(monthName, runningBalance);
        });
      } else {
        const currentMonthName = new Date().toLocaleDateString('fa-IR', { month: 'long' });
        monthlyDataMap.set(currentMonthName, totalBalance);
      }
      
      bChartData = Array.from(monthlyDataMap.entries()).map(([month, balance]) => ({ month, balance }));
    } else {
      calcTotalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
      calcTotalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

      const initialBalance = totalBalance - (calcTotalIncome - calcTotalExpense);
      const chronologicalTxs = [...transactions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      const monthlyDataMap = new Map<string, number>();
      const currentMonthName = new Date().toLocaleDateString('fa-IR', { month: 'long' });
      monthlyDataMap.set(currentMonthName, initialBalance);

      let runningBalance = initialBalance;
      chronologicalTxs.forEach(t => {
        const monthName = new Date(t.created_at).toLocaleDateString('fa-IR', { month: 'long' });
        if (t.type === 'INCOME') runningBalance += t.amount;
        if (t.type === 'EXPENSE') runningBalance -= t.amount;
        monthlyDataMap.set(monthName, runningBalance);
      });

      bChartData = Array.from(monthlyDataMap.entries()).map(([month, balance]) => ({ month, balance }));
    }

    let pieChartData = [
      { name: 'درآمد', value: calcTotalIncome, fill: '#3b82f6' },
      { name: 'مخارج', value: calcTotalExpense, fill: '#f43f5e' }
    ].filter(d => d.value > 0);

    if (pieChartData.length === 0) {
      pieChartData = [{ name: 'بدون تراکنش', value: 1, fill: '#27272a' }];
    }

    return { 
      totalBalance, 
      totalIncome: calcTotalIncome, 
      totalExpense: calcTotalExpense, 
      pieChartData, 
      barChartData: bChartData 
    };
  }, [cards, transactions, stats]);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions.slice(0, 5);
    const lowerQuery = searchQuery.toLowerCase();
    return transactions.filter(t => 
      t.description?.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery) ||
      t.amount.toString().includes(lowerQuery)
    );
  }, [searchQuery, transactions]);

  const getCardName = React.useCallback((cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    return card ? `${card.bank_name} (${card.card_number.slice(-4)})` : 'کارت نامشخص';
  }, [cards]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
       <header>
         <h1 className="text-3xl font-extrabold text-white mb-2">سلام، {userName || 'کاربر عزیز'} 👋</h1>
         <p className="text-foreground-muted">خلاصه‌ی وضعیت مالی شما در یک نگاه</p>
       </header>

       {/* KPIs */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Balance */}
         <div className="bg-surface border border-white/5 p-6 rounded-3xl shadow-glass relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center relative z-10 shadow-neon mb-6">
              <Wallet className="w-6 h-6" />
            </div>
            
            <figure className="relative z-10 flex flex-col group/balance">
              <figcaption className="text-foreground-muted text-sm mb-1 flex items-center w-full">
                موجودی کل حساب‌ها
              </figcaption>
              <p className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-wider" aria-label={`${totalBalance.toLocaleString()} تومان`}>{totalBalance.toLocaleString()} <span className="text-sm font-sans font-normal opacity-70" aria-hidden="true">تومان</span></p>
            </figure>
         </div>

         {/* Income */}
         <div className="bg-surface border border-white/5 p-6 rounded-3xl shadow-glass relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center relative z-10 shadow-neon mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <figure className="relative z-10">
              <figcaption className="text-foreground-muted text-sm mb-1">کل درآمدهای ثبت‌شده</figcaption>
              <p className="text-2xl sm:text-3xl font-bold font-mono tracking-wider text-emerald-400" aria-label={`+${totalIncome.toLocaleString()} تومان`}>+{totalIncome.toLocaleString()} <span className="text-sm font-sans font-normal text-foreground-muted" aria-hidden="true">تومان</span></p>
            </figure>
         </div>

         {/* Expenses */}
         <div className="bg-surface border border-white/5 p-6 rounded-3xl shadow-glass relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center relative z-10 shadow-neon mb-6">
              <TrendingDown className="w-6 h-6" />
            </div>
            <figure className="relative z-10">
              <figcaption className="text-foreground-muted text-sm mb-1">کل مخارج ثبت‌شده</figcaption>
              <p className="text-2xl sm:text-3xl font-bold font-mono tracking-wider text-rose-400" aria-label={`-${totalExpense.toLocaleString()} تومان`}>-{totalExpense.toLocaleString()} <span className="text-sm font-sans font-normal text-foreground-muted" aria-hidden="true">تومان</span></p>
            </figure>
         </div>
       </div>

       {/* Pie Chart & Transactions List */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Pie Chart */}
         <div className="bg-surface border border-white/5 p-6 sm:p-8 rounded-3xl shadow-glass flex flex-col h-[450px] relative">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="text-lg font-bold text-white">ترکیب درآمد و مخارج</h3>
               <p className="text-sm text-foreground-muted">نسبت ورودی به خروجی حساب‌ها</p>
             </div>
             
             {/* Legend */}
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                 <span className="text-sm text-white">درآمد</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
                 <span className="text-sm text-white">مخارج</span>
               </div>
             </div>
           </div>
           
           <div className="flex-1 w-full h-full min-h-0 relative" dir="ltr">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-0">
               <span className="text-xs text-foreground-muted mb-1">موجودی کل</span>
               <span className="font-mono text-xl text-white font-bold">{totalBalance.toLocaleString()}</span>
             </div>
             
             <ResponsiveContainer width="100%" height="100%" className="relative z-10">
               <PieChart>
                 <Pie
                   data={pieChartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={90}
                   outerRadius={130}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {pieChartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                   ))}
                 </Pie>
                 <Tooltip 
                   formatter={(value: any) => [`${Number(value)?.toLocaleString?.() || value} تومان`, 'مبلغ']}
                   contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '16px', color: '#fff', textAlign: 'right', direction: 'rtl', zIndex: 50 }}
                   itemStyle={{ color: '#fff' }}
                 />
               </PieChart>
             </ResponsiveContainer>
           </div>
         </div>

         {/* Transactions List with Search */}
         <div className="bg-surface border border-white/5 p-6 sm:p-8 rounded-3xl shadow-glass flex flex-col h-[450px]">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
             <h3 className="text-lg font-bold text-white shrink-0">جستجوی تراکنش‌ها</h3>
             <div className="relative w-full max-w-[200px]">
               <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
               <input 
                 type="text"
                 placeholder="جستجو (مبلغ، نام...)"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-black/20 border border-white/10 rounded-xl h-10 pr-9 pl-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2">
                   <X className="w-3.5 h-3.5 text-foreground-muted hover:text-white" />
                 </button>
               )}
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
             {filteredTransactions.length > 0 ? (
               filteredTransactions.map(t => (
                 <TransactionItem 
                   key={t.id} 
                   transaction={t} 
                   cardName={getCardName(t.card_id)}
                   onDelete={() => {}} 
                   readOnly
                   onClick={() => setSelectedTransaction(t)}
                 />
               ))
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-foreground-muted bg-white/5 rounded-2xl border border-dashed border-white/10">
                 {searchQuery ? 'تراکنشی با این مشخصات یافت نشد' : 'هیچ تراکنشی یافت نشد'}
               </div>
             )}
           </div>

           {!searchQuery && (
             <div className="mt-4 pt-4 border-t border-white/5 text-center">
               <Link href="/dashboard/transactions" className="text-sm text-primary hover:text-primary/80 transition-colors">
                 مشاهده همه تراکنش‌ها
               </Link>
             </div>
           )}
         </div>
       </div>

       {/* Monthly Bar Chart */}
       <div className="bg-surface border border-white/5 p-6 sm:p-8 rounded-3xl shadow-glass flex flex-col h-[400px]">
         <div className="mb-6">
           <h3 className="text-lg font-bold text-white">روند موجودی در ماه‌های اخیر</h3>
           <p className="text-sm text-foreground-muted">میانگین موجودی حساب شما در پایان هر ماه</p>
         </div>
         
         <div className="flex-1 w-full h-full min-h-0" dir="ltr">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
               <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
               <XAxis 
                 dataKey="month" 
                 stroke="#71717a" 
                 tick={{ fill: '#a1a1aa', fontSize: 12, fontFamily: 'sans-serif' }}
                 axisLine={false}
                 tickLine={false}
               />
               <YAxis 
                 stroke="#71717a" 
                 tick={{ fill: '#a1a1aa', fontSize: 12, fontFamily: 'sans-serif' }}
                 tickFormatter={(value) => {
                   if (value >= 1000000) return (value / 1000000).toLocaleString('fa-IR') + ' میلیون';
                   if (value >= 1000) return (value / 1000).toLocaleString('fa-IR') + ' هزار';
                   return value.toLocaleString('fa-IR');
                 }}
                 axisLine={false}
                 tickLine={false}
                 width={90}
               />
               <Tooltip 
                 formatter={(value: any) => [`${value?.toLocaleString?.() || value} تومان`, 'موجودی']}
                 labelStyle={{ color: '#a1a1aa', textAlign: 'right' }}
                 contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff', textAlign: 'right', direction: 'rtl' }}
                 cursor={{ fill: '#ffffff05' }}
               />
               <Bar 
                 dataKey="balance" 
                 fill="#3b82f6" 
                 radius={[6, 6, 0, 0]}
                 barSize={40}
               />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </div>

       <TransactionDetailsModal 
         isOpen={!!selectedTransaction}
         onClose={() => setSelectedTransaction(null)}
         transaction={selectedTransaction}
         cardName={selectedTransaction ? getCardName(selectedTransaction.card_id) : ''}
       />
    </div>
  );
}
