"use client";

import { useEffect, useState } from 'react';
import { homeApi } from '@/lib/api';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewArrivals from '@/components/NewArrivals';
import CategoryList from '@/components/CategoryList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const [homeData, setHomeData] = useState({
    featuredProducts: [],
    newArrivals: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await homeApi.getHomeData();
        setHomeData({
          featuredProducts: data.featuredProducts || [],
          newArrivals: data.newArrivals || [],
          categories: data.categories || []
        });
      } catch (err) {
        console.error('Failed to fetch home data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="text-red-600">{error}</div>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-900 text-white">
        <div className="container mx-auto py-20 px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Signature Scent
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Explore our collection of premium perfumes for every occasion
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-black">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <FeaturedProducts products={homeData.featuredProducts} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <CategoryList categories={homeData.categories} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">New Arrivals</h2>
          <NewArrivals products={homeData.newArrivals} />
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/products?category=New+Arrivals">View All New Arrivals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-indigo-900 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="mb-8">Stay updated with our newest arrivals and exclusive offers</p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-l-md text-gray-900 text-white" 
            />
            {/* <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-l-md text-gray-900"
            /> */}
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}