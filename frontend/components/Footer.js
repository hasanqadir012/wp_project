'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Perfume Store</h3>
            <p className="text-gray-400 mb-4">
              Discover premium fragrances for every occasion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop/men" className="text-gray-400 hover:text-white transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/shop/women" className="text-gray-400 hover:text-white transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/shop/unisex" className="text-gray-400 hover:text-white transition-colors">
                  Unisex
                </Link>
              </li>
              <li>
                <Link href="/shop/best-selling" className="text-gray-400 hover:text-white transition-colors">
                  Best Selling
                </Link>
              </li>
              <li>
                <Link href="/shop/new-arrivals" className="text-gray-400 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="text-gray-400 not-italic">
              <p className="mb-2">1234 Fragrance Avenue</p>
              <p className="mb-2">Perfume City, PC 12345</p>
              <p className="mb-2">Email: info@perfumestore.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Perfume Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}