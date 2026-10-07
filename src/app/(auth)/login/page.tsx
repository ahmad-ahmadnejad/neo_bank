import { AuthForm } from '@/features/auth/components/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ورود به دستیار مالی رسا سامانه',
};

export default function LoginPage() {
  return <AuthForm />;
}
