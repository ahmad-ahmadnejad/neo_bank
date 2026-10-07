import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  date: z.string(), // ISO date string
  created_at: z.string(),
});

export const reminderSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  amount: z.number().positive(),
  date: z.string(), // ISO date string
  is_paid: z.boolean().default(false),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type Reminder = z.infer<typeof reminderSchema>;
