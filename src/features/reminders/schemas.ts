import { z } from 'zod';
import type { DateObject } from "react-multi-date-picker";

export const reminderFormSchema = z.object({
  description: z.string().min(2, 'عنوان یادآور الزامی است'),
  amount: z.string().min(1, 'مبلغ الزامی است'),
  due_date: z.any()
    .refine((val) => val, { message: "انتخاب تاریخ و زمان الزامی است" })
    .refine((val) => {
      if (!val) return true;
      return (val as DateObject).toDate().getTime() > Date.now();
    }, { message: "زمان یادآور نمی‌تواند در گذشته باشد" })
});

export type ReminderFormValues = z.infer<typeof reminderFormSchema>;
