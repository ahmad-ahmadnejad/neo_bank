import { Metadata } from 'next';
import { ProfileManager } from '@/features/profile/components/ProfileManager';

export const metadata: Metadata = {
  title: 'حساب کاربری | دستیار مالی رسا سامانه',
};

export default function ProfilePage() {
  return <ProfileManager />;
}
