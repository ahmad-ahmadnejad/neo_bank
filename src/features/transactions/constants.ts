import { 
  Utensils, 
  ShoppingBag, 
  Car, 
  Home, 
  Phone, 
  HeartPulse, 
  GraduationCap, 
  Briefcase, 
  PlusCircle, 
  Gamepad2, 
  HelpCircle 
} from 'lucide-react';
import React from 'react';

export const expenseCategories = [
  'رستوران و کافه', 
  'سوپرمارکت و خرید', 
  'حمل و نقل', 
  'مسکن و قبوض', 
  'تلفن و اینترنت', 
  'سلامت و درمان', 
  'آموزش', 
  'سرگرمی', 
  'سایر'
];

export const incomeCategories = [
  'حقوق و دستمزد', 
  'سرمایه گذاری', 
  'سایر'
];

export const categoryIcons: Record<string, React.ElementType> = {
  'رستوران و کافه': Utensils,
  'سوپرمارکت و خرید': ShoppingBag,
  'حمل و نقل': Car,
  'مسکن و قبوض': Home,
  'تلفن و اینترنت': Phone,
  'سلامت و درمان': HeartPulse,
  'آموزش': GraduationCap,
  'حقوق و دستمزد': Briefcase,
  'سرمایه گذاری': PlusCircle,
  'سرگرمی': Gamepad2,
  'سایر': HelpCircle,
};
