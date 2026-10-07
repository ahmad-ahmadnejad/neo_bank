import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from '@/lib/queryKeys';
import type { TransactionType } from '../types';

const supabase = createClient();

export function useSearchTransactions(searchQuery: string) {
  return useQuery({
    queryKey: queryKeys.transactions.search(searchQuery),
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('id, amount, type, category, description, created_at')
        .or(`description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (error) throw error;
      return data as Pick<TransactionType, 'id' | 'amount' | 'type' | 'category' | 'description' | 'created_at'>[];
    },
    enabled: !!searchQuery.trim(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
