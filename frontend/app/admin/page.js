'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import DashboardSummary from '@/components/admin/DashboardSummary';

export default function AdminDashboardPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  // Protect admin routes
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Not an admin user, redirecting to home page...');
      // router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <DashboardSummary />
  );
}