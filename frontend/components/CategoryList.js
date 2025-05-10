'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function CategoryList({ categories }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.name} href={`/products?category=${category.name.slice(0, 1).toUpperCase() + category.name.slice(1)}`}>
          <Card className="overflow-hidden h-64 relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <CardContent className="p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-200">
                  {category.description || `Explore our ${category.name} collection`}
                </p>
              </CardContent>
            </div>
          </Card>
        </Link>
      ))}
      <Link href="/products?category=Best+Selling">
        <Card className="overflow-hidden h-64 relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <CardContent className="p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Best Selling</h3>
              <p className="text-sm text-gray-200">
                Our most popular fragrances
              </p>
            </CardContent>
          </div>
        </Card>
      </Link>
      <Link href="/products?category=New+Arrivals">
        <Card className="overflow-hidden h-64 relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <CardContent className="p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">New Arrivals</h3>
              <p className="text-sm text-gray-200">
                The latest additions to our collection
              </p>
            </CardContent>
          </div>
        </Card>
      </Link>
    </div>
  );
}