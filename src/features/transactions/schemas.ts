import { z } from 'zod';

export const transactionFormSchema = z.object({
  card_id: z.string().min(1, 'کارت را انتخاب کنید'),
  amount: z.string().min(1, 'مبلغ الزامی است'),
  category: z.string().min(1, 'دسته‌بندی الزامی است'),
  description: z.string().optional()
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
