'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppNavbar } from '@/components/shared/app-navbar';
import { useAuthStore } from '@/store/auth.store';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, fetchMe, accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      fetchMe();
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [accessToken, isAuthenticated, fetchMe, router]);

  return (
    <div className="min-h-screen bg-[#080808]">
      <AppNavbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
