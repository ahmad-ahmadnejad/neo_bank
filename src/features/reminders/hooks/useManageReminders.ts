import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReminderType } from '../types';
import { queryKeys } from '@/lib/queryKeys';

export function useManageReminders(initialReminders: ReminderType[]) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: reminders = [] } = useQuery({
    queryKey: queryKeys.reminders.all,
    queryFn: async () => {
      const { data, error } = await supabase.from('reminders').select('*');
      if (error) throw error;
      return (data as ReminderType[]).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    },
    initialData: initialReminders
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reminders').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.reminders.all });
      const previous = queryClient.getQueryData<ReminderType[]>(queryKeys.reminders.all);
      queryClient.setQueryData<ReminderType[]>(queryKeys.reminders.all, old => old?.filter(r => r.id !== deletedId));
      return { previous };
    },
    onError: (err, deletedId, context) => {
      toast.error('خطا در حذف یادآور.');
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.reminders.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all });
      setDeleteTargetId(null);
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newReminderData: Omit<ReminderType, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('reminders').insert(newReminderData).select().single();
      if (error || !data) throw error || new Error('No data');
      return data as ReminderType;
    },
    onMutate: async (newReminderData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.reminders.all });
      const previous = queryClient.getQueryData<ReminderType[]>(queryKeys.reminders.all);
      
      const optimisticReminder: ReminderType = { 
        ...newReminderData, 
        id: crypto.randomUUID(), 
        created_at: new Date().toISOString() 
      };
      
      queryClient.setQueryData<ReminderType[]>(queryKeys.reminders.all, old => {
        const updated = [optimisticReminder, ...(old || [])];
        return updated.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
      });
      return { previous };
    },
    onError: (err, newReminderData, context) => {
      toast.error('خطا در ثبت یادآور.');
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.reminders.all, context.previous);
      }
    },
    onSuccess: () => {
      toast.success('یادآور با موفقیت ثبت شد.');
      setIsModalOpen(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all });
    }
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const requestDelete = (id: string) => setDeleteTargetId(id);
  const cancelDelete = () => setDeleteTargetId(null);

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteMutation.mutate(deleteTargetId);
    }
  };

  const handleSubmit = async (data: Omit<ReminderType, 'id' | 'created_at'>) => {
    await addMutation.mutateAsync(data);
  };

  return {
    reminders,
    isModalOpen,
    openModal,
    closeModal,
    deleteTargetId,
    requestDelete,
    cancelDelete,
    confirmDelete,
    handleSubmit
  };
}
