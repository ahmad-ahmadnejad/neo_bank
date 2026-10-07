'use client';

import * as React from 'react';
import { BankCard } from './BankCard';
import type { CardType } from '../types';
import { CardModal } from './CardModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Plus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useManageCards } from '../hooks/useManageCards';

export function CardsManager({ initialCards }: { initialCards: CardType[] }) {
  const {
    cards,
    isModalOpen,
    editingCard,
    setEditingCard,
    setIsModalOpen,
    handleOpenAdd,
    closeModal,
    handleDelete,
    handleSubmit,
    deleteTargetId,
    setDeleteTargetId,
    confirmDelete,
    isDeleting
  } = useManageCards(initialCards);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">کارت‌های من</h1>
          <p className="text-foreground-muted">مدیریت حساب‌ها و کارت‌های بانکی شخصی</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 shadow-neon whitespace-nowrap">
          <Plus className="w-5 h-5" />
          افزودن کارت جدید
        </Button>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface border border-white/5 rounded-3xl border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <CreditCard className="w-10 h-10 text-foreground-muted" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">هیچ کارتی یافت نشد</h3>
          <p className="text-foreground-muted mb-6">شما هنوز کارت بانکی به سیستم اضافه نکرده‌اید.</p>
          <Button onClick={handleOpenAdd} variant="glass" className="gap-2">
            <Plus className="w-5 h-5" />
            افزودن اولین کارت
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {cards.map((card, index) => (
            <motion.li
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
            >
              <BankCard 
                card={card} 
                colorIndex={index} 
                onEdit={(c) => { setEditingCard(c); setIsModalOpen(true); }} 
                onDelete={handleDelete} 
              />
            </motion.li>
          ))}
        </ul>
      )}

      <CardModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingCard={editingCard}
      />

      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="حذف کارت بانکی"
        description="آیا از حذف این کارت اطمینان دارید؟ تمامی تراکنش‌های مرتبط با این کارت باید به صورت دستی مدیریت شوند و این عمل غیرقابل بازگشت است."
      />
    </div>
  );
}
