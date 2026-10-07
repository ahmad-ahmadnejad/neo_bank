import { Home, CreditCard, Activity, Bell, User } from 'lucide-react';

export const navItems = [
  { href: '/dashboard', icon: Home, label: 'داشبورد' },
  { href: '/dashboard/cards', icon: CreditCard, label: 'کارت‌های من' },
  { href: '/dashboard/transactions', icon: Activity, label: 'تراکنش‌ها' },
  { href: '/dashboard/reminders', icon: Bell, label: 'یادآورها' },
  { href: '/dashboard/profile', icon: User, label: 'پروفایل' },
];
