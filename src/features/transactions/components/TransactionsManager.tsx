'use client';

import * as React from 'react';
import { AnimatePresence } from 'framer-motion';
import { TransactionItem } from './TransactionItem';
import type { TransactionType } from '../types';
import { TransactionModal } from './TransactionModal';
import { ArrowDownLeft, ArrowUpRight, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CardType } from '@/features/cards/types';
import { useManageTransactions } from '../hooks/useManageTransactions';

interface TransactionsManagerProps {
  initialTransactions: TransactionType[];
  cards: CardType[];
}

export function TransactionsManager({ initialTransactions, cards }: TransactionsManagerProps) {
  const {
    filteredTransactions,
    modalState,
    handleOpenAdd,
    closeModal,
    handleDelete,
    handleSubmit
  } = useManageTransactions(initialTransactions);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border border-white/5 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">مدیریت تراکنش‌ها</h1>
          <p className="text-foreground-muted">ثبت و پیگیری درآمدها و مخارج روزمره</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            onClick={() => handleOpenAdd('EXPENSE')} 
            className="flex-1 md:flex-none gap-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all h-12 px-6"
          >
            <ArrowDownLeft className="w-5 h-5" />
            ثبت هزینه
          </Button>
          <Button 
            onClick={() => handleOpenAdd('INCOME')} 
            className="flex-1 md:flex-none gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all h-12 px-6"
          >
            <ArrowUpRight className="w-5 h-5" />
            ثبت درآمد
          </Button>
        </div>
      </div>

      {/* Transactions List */}
      <div>
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <ReceiptText className="w-5 h-5 text-primary" />
          لیست تراکنش‌های اخیر
        </h2>
        
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 border-dashed rounded-3xl bg-surface/50">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <ReceiptText className="w-10 h-10 text-foreground-muted" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">تراکنشی یافت نشد</h3>
            <p className="text-foreground-muted">اولین درآمد یا هزینه خود را با دکمه‌های بالا ثبت کنید.</p>
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            <AnimatePresence>
              {filteredTransactions.map(t => {
                const card = cards.find(c => c.id === t.card_id);
                const cardName = card ? `${card.bank_name} (${card.card_number.slice(-4)})` : 'کارت نامشخص';
                
                return (
                  <TransactionItem 
                    key={t.id} 
                    transaction={t} 
                    cardName={cardName}
                    onDelete={handleDelete}
                  />
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <TransactionModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        cards={cards}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
