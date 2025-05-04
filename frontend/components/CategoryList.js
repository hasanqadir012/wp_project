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

  // Category images - in a real application, these would come from your API
  const categoryImages = {
    Men: '/category-men.jpg',
    Women: '/category-women.jpg',
    Unisex: '/category-unisex.jpg',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/shop/${category.name.toLowerCase()}`}>
          <Card className="overflow-hidden h-64 relative group cursor-pointer">
            <Image
              src={categoryImages[category.name] || '/category-default.jpg'}
              alt={category.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
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
      <Link href="/shop/best-selling">
        <Card className="overflow-hidden h-64 relative group cursor-pointer">
          <Image
            src="/category-bestselling.jpg"
            alt="Best Selling"
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
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
      <Link href="/shop/new-arrivals">
        <Card className="overflow-hidden h-64 relative group cursor-pointer">
          <Image
            src="/category-newarrivals.jpg"
            alt="New Arrivals"
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
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