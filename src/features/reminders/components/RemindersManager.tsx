'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReminderItem } from './ReminderItem';
import type { ReminderType } from '../types';
import { ReminderModal } from './ReminderModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useManageReminders } from '../hooks/useManageReminders';

interface RemindersManagerProps {
  initialReminders: ReminderType[];
}

export function RemindersManager({ initialReminders }: RemindersManagerProps) {
  const {
    reminders,
    isModalOpen,
    openModal,
    closeModal,
    deleteTargetId,
    requestDelete,
    cancelDelete,
    confirmDelete,
    handleSubmit
  } = useManageReminders(initialReminders);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-surface border border-white/5 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">یادآورهای مالی</h1>
          <p className="text-foreground-muted">پیگیری سررسید اقساط، قبوض و پرداخت‌های دوره‌ای</p>
        </div>
        
        <Button 
          onClick={openModal} 
          className="gap-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/20 transition-all h-12 px-6 shadow-neon"
        >
          <Plus className="w-5 h-5" />
          افزودن یادآور جدید
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          لیست پرداخت‌های آینده
        </h2>
        
        {reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 border-dashed rounded-3xl bg-surface/50">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Bell className="w-10 h-10 text-foreground-muted" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">یادآوری یافت نشد</h3>
            <p className="text-foreground-muted">هزینه‌ها و اقساط آینده خود را اضافه کنید تا پیش از موعد به شما اطلاع دهیم.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4" role="list">
            <AnimatePresence>
              {reminders.map(r => (
                <ReminderItem 
                  key={r.id} 
                  reminder={r} 
                  onDelete={requestDelete}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <ReminderModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <ConfirmModal 
        isOpen={!!deleteTargetId}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="حذف یادآور"
        description="آیا از حذف این یادآور اطمینان دارید؟ این عمل غیرقابل بازگشت است."
        confirmText="حذف یادآور"
      />
    </div>
  );
}
