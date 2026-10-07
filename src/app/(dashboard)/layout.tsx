import { DashboardLayout } from '@/features/dashboard/components/layout/DashboardLayout';
import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'داشبورد | دستیار مالی رسا سامانه',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
