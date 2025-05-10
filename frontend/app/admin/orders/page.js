'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import OrdersManager from '@/components/admin/orders/OrdersManager';

export default function AdminOrdersPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  // Protect admin routes
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <OrdersManager />
  );
}