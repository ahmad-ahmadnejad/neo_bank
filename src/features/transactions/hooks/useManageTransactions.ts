import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TransactionType } from '../types';
import { queryKeys } from '@/lib/queryKeys';

export function useManageTransactions(initialTransactions: TransactionType[]) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'INCOME' | 'EXPENSE' }>({
    isOpen: false,
    type: 'EXPENSE'
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
    initialData: initialTransactions
  });

  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query) ||
    t.amount.toString().includes(query)
  );

  const handleOpenAdd = (type: 'INCOME' | 'EXPENSE') => setModalState({ isOpen: true, type });
  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.transactions.all });
      const previous = queryClient.getQueryData<TransactionType[]>(queryKeys.transactions.all);
      queryClient.setQueryData<TransactionType[]>(queryKeys.transactions.all, old => old?.filter(t => t.id !== deletedId));
      return { previous };
    },
    onError: (err, deletedId, context) => {
      toast.error('خطا در حذف تراکنش.');
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.transactions.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      // We also need to invalidate cards since balances changed
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newTxData: Omit<TransactionType, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('transactions').insert(newTxData).select().single();
      if (error || !data) throw error || new Error('No data');
      return data as TransactionType;
    },
    onMutate: async (newTxData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.transactions.all });
      const previous = queryClient.getQueryData<TransactionType[]>(queryKeys.transactions.all);
      
      const optimisticTx: TransactionType = { 
        ...newTxData, 
        id: crypto.randomUUID(), 
        created_at: new Date().toISOString() 
      };
      
      queryClient.setQueryData<TransactionType[]>(queryKeys.transactions.all, old => [optimisticTx, ...(old || [])]);
      return { previous };
    },
    onError: (err, newTxData, context) => {
      toast.error('خطا در ثبت تراکنش.');
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.transactions.all, context.previous);
      }
    },
    onSuccess: () => {
      toast.success('تراکنش با موفقیت ثبت شد!');
      closeModal();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      // We also need to invalidate cards since balances changed
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    }
  });

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این تراکنش اطمینان دارید؟')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = async (data: Omit<TransactionType, 'id' | 'created_at'>) => {
    await addMutation.mutateAsync(data);
  };

  return {
    filteredTransactions,
    modalState,
    handleOpenAdd,
    closeModal,
    handleDelete,
    handleSubmit
  };
}
