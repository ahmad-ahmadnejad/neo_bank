import { z } from 'zod';

export const cardFormSchema = z.object({
  bankName: z.string().min(2, 'نام بانک الزامی است'),
  cardNumber: z.string().length(16, 'شماره کارت باید دقیقا ۱۶ رقم باشد').regex(/^\d+$/, 'فقط اعداد مجاز است'),
  balance: z.string().min(1, 'موجودی الزامی است')
});

export type CardFormValues = z.infer<typeof cardFormSchema>;
