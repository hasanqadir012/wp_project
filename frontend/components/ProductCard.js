'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/providers/CartProvider';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Default placeholder image
  const imageUrl = product.imageUrl || '/perfume.jpeg';

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform hover:scale-105"
          />
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-md">Out of Stock</span>
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-2 left-2">
              <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded">Featured</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="flex-grow pt-4">
        <div className="text-sm text-gray-500 mb-1">{product.category?.name || 'Perfume'}</div>
        <Link href={`/shop/product/${product.id}`} className="block hover:underline">
          <h3 className="font-medium text-lg">{product.name}</h3>
        </Link>
        <p className="mt-2 text-xl font-semibold">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAddToCart} 
          disabled={!product.isAvailable || product.stockQuantity <= 0}
          className="w-full"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}