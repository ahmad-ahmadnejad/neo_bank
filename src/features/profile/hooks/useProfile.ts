import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { queryKeys } from '@/lib/queryKeys';

const supabase = createClient();

export function useProfile() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.profile.all,
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw error || new Error('User not found');
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateMutation = useMutation({
    mutationFn: async (fullName: string) => {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      if (error) throw error;
      return fullName;
    },
    onSuccess: (fullName) => {
      queryClient.setQueryData(queryKeys.profile.all, (old: any) => ({
        ...old,
        user_metadata: { ...old?.user_metadata, full_name: fullName },
      }));
      toast.success('اطلاعات با موفقیت به‌روزرسانی شد.');
    },
    onError: () => {
      toast.error('خطا در به‌روزرسانی اطلاعات.');
    },
  });

  return { user, isLoading, updateMutation };
}
