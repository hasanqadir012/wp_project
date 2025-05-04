'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductsManager from '@/components/admin/products/ProductsManager';

export default function AdminProductsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  // Protect admin routes
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Not an admin user, redirecting to home page...');
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <AdminLayout>
      <ProductsManager />
    </AdminLayout>
  );
}