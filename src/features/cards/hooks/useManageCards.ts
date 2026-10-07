import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CardType } from '../types';
import { queryKeys } from '@/lib/queryKeys';

export function useManageCards(initialCards: CardType[]) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: cards = [] } = useQuery({
    queryKey: queryKeys.cards.all,
    queryFn: async () => {
      const { data, error } = await supabase.from('cards').select('*');
      if (error) throw error;
      return data as CardType[];
    },
    initialData: initialCards
  });

  const handleOpenAdd = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cards').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cards.all });
      const previous = queryClient.getQueryData<CardType[]>(queryKeys.cards.all);
      queryClient.setQueryData<CardType[]>(queryKeys.cards.all, old => old?.filter(c => c.id !== deletedId));
      return { previous };
    },
    onError: (err, deletedId, context) => {
      toast.error('خطا در حذف کارت.');
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.cards.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      setDeleteTargetId(null);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async ({ data, id }: { data: Omit<CardType, 'id'>, id?: string }) => {
      if (id) {
        const { data: updatedCard, error } = await supabase.from('cards').update(data).eq('id', id).select().single();
        if (error || !updatedCard) throw error || new Error('Update failed');
        return updatedCard as CardType;
      } else {
        const { data: newCard, error } = await supabase.from('cards').insert(data).select().single();
        if (error || !newCard) throw error || new Error('Insert failed');
        return newCard as CardType;
      }
    },
    onMutate: async ({ data, id }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cards.all });
      const previous = queryClient.getQueryData<CardType[]>(queryKeys.cards.all);
      
      queryClient.setQueryData<CardType[]>(queryKeys.cards.all, old => {
        if (id) {
          return old?.map(c => c.id === id ? { ...c, ...data } : c);
        } else {
          const optimisticCard = { ...data, id: crypto.randomUUID() } as CardType;
          return [...(old || []), optimisticCard];
        }
      });
      return { previous };
    },
    onError: (err, variables, context) => {
      toast.error(variables.id ? 'خطا در ویرایش کارت.' : 'خطا در افزودن کارت جدید.');
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.cards.all, context.previous);
      }
    },
    onSuccess: (data, variables) => {
      toast.success(variables.id ? 'کارت با موفقیت ویرایش شد.' : 'کارت جدید با موفقیت اضافه شد.');
      closeModal();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
    }
  });

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteMutation.mutate(deleteTargetId);
    }
  };

  const handleSubmit = async (data: Omit<CardType, 'id'>, id?: string) => {
    await saveMutation.mutateAsync({ data, id });
  };

  return {
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
    isDeleting: deleteMutation.isPending
  };
}
