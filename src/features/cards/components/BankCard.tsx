import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { type CardType } from '../types';
import { gradients } from '../constants';

interface BankCardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (id: string) => void;
  colorIndex: number;
}

const formatCardNumber = (num: string) => {
  return num.replace(/(\d{4})/g, '$1 ').trim();
};



const Chip = () => (
  <div className="w-11 h-8 rounded-[4px] bg-gradient-to-br from-[#ffd700] to-[#b8860b] border border-[#8b6508] relative overflow-hidden flex flex-col justify-between shadow-sm opacity-80 shrink-0">
    <div className="w-full h-[1px] bg-[#8b6508]/40 mt-1.5" />
    <div className="w-full h-[1px] bg-[#8b6508]/40" />
    <div className="w-full h-[1px] bg-[#8b6508]/40 mb-1.5" />
    <div className="absolute inset-y-0 left-2.5 w-[1px] bg-[#8b6508]/40" />
    <div className="absolute inset-y-0 right-2.5 w-[1px] bg-[#8b6508]/40" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-4 border border-[#8b6508]/40 rounded-[2px]" />
  </div>
);

export function BankCard({ card, onEdit, onDelete, colorIndex }: BankCardProps) {
  const gradient = gradients[colorIndex % gradients.length];

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative p-5 sm:p-6 rounded-2xl overflow-hidden aspect-[1.58/1] flex flex-col justify-between text-white shadow-xl group cursor-pointer border border-white/10"
    >
       {/* Base Color */}
       <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
       
       {/* Lighting Effect */}
       <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/15 pointer-events-none" />
       
       {/* Elegant Geometric Curves (Bank card security patterns) */}
       <div className="absolute -top-24 -right-24 w-64 h-64 border-[1px] border-white/5 rounded-full pointer-events-none" />
       <div className="absolute -top-32 -right-32 w-80 h-80 border-[1px] border-white/5 rounded-full pointer-events-none" />
       <div className="absolute -bottom-24 -left-24 w-64 h-64 border-[1px] border-white/5 rounded-full pointer-events-none opacity-50" />
       
       {/* Header: Bank Name & Actions */}
       <div className="relative z-10 flex justify-between items-start">
         <span className="font-bold text-lg sm:text-xl tracking-wide opacity-95 drop-shadow-md text-slate-50">
           {card.bank_name}
         </span>
         
         <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
           <button 
             onClick={(e) => { e.stopPropagation(); onEdit(card); }} 
             className="p-1.5 bg-black/20 rounded-lg hover:bg-black/40 backdrop-blur-md transition-colors border border-white/10 focus-visible:ring-2 focus-visible:ring-primary outline-none"
             title="ویرایش"
             aria-label={`ویرایش کارت ${card.bank_name}`}
           >
             <Edit2 className="w-4 h-4 text-white/90" aria-hidden="true" />
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); onDelete(card.id); }} 
             className="p-1.5 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/40 backdrop-blur-md transition-colors border border-red-500/20 focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
             title="حذف"
             aria-label={`حذف کارت ${card.bank_name}`}
           >
             <Trash2 className="w-4 h-4" aria-hidden="true" />
           </button>
         </div>
       </div>

       {/* Body: Chip, Number, Balance */}
       <div className="relative z-10 mt-auto flex flex-col gap-3 sm:gap-4">
         <Chip />
         
         <div className="font-mono text-[1.35rem] sm:text-[1.65rem] tracking-[0.15em] sm:tracking-[0.2em] dir-ltr text-left opacity-95 drop-shadow-md text-slate-100 leading-none">
           {formatCardNumber(card.card_number)}
         </div>
         
         <div className="flex justify-between items-end mt-1">
           <div className="flex flex-col">
             <span className="text-[10px] text-white/60 uppercase tracking-wider mb-0.5">موجودی حساب</span>
             <span className="font-medium text-base sm:text-lg tracking-wide text-slate-100 drop-shadow-sm">
               {card.balance.toLocaleString()} <span className="text-xs opacity-70 font-normal">تومان</span>
             </span>
           </div>
         </div>
       </div>
    </motion.div>
  );
}
