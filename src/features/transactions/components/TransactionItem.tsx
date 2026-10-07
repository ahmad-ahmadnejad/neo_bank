'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Trash2, HelpCircle, Utensils, ShoppingBag, Car, Home, Phone, HeartPulse, GraduationCap, Briefcase, PlusCircle, Gamepad2, FileText, ChevronLeft, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

import { categoryIcons } from '../constants';
import type { TransactionType } from '../types';

interface TransactionItemProps {
  transaction: TransactionType;
  cardName: string;
  onDelete: (id: string) => void;
  readOnly?: boolean;
  onClick?: () => void;
}

export function TransactionItem({ transaction, cardName, onDelete, readOnly, onClick }: TransactionItemProps) {
  const isIncome = transaction.type === 'INCOME';
  const Icon = categoryIcons[transaction.category] || HelpCircle;

  const date = new Date(transaction.created_at).toLocaleDateString('fa-IR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.li 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 bg-surface border border-white/5 rounded-2xl transition-all group",
        onClick ? "cursor-pointer hover:bg-white/5" : "hover:bg-surface-raised"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
          isIncome ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
        )}>
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-1">{transaction.category}</h4>
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" aria-hidden="true" /> {cardName}</span>
            <span className="opacity-50">•</span>
            <span>{date}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className={cn(
            "font-mono font-bold text-lg",
            isIncome ? "text-emerald-400" : "text-rose-400"
          )}>
            <span className="font-sans ml-1 text-sm">{isIncome ? '+' : '-'}</span>
            {transaction.amount.toLocaleString()}
          </span>
          <span className="text-xs text-foreground-muted">تومان</span>
        </div>
        
        {!readOnly && (
          <Button 
            onClick={(e) => { e.stopPropagation(); onDelete(transaction.id); }}
            variant="ghost" 
            aria-label="حذف تراکنش"
            className="w-10 h-10 p-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity focus-visible:ring-2 focus-visible:ring-rose-500 outline-none hover:bg-rose-500/20 text-rose-400"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </motion.li>
  );
}
