import { useEffect, useState } from 'react';
import { productApi } from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function PopularProductsList({ popularProducts }) {
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!popularProducts || popularProducts.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Get details for all popular products
        const details = {};
        
        for (const item of popularProducts) {
          const product = await productApi.getProduct(item.productId);
          if (product && product.length > 0) {
            details[item.productId] = product[0];
          }
        }
        
        setProductDetails(details);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [popularProducts]);

  if (loading) {
    return <p className="text-gray-500 text-sm">Loading popular products...</p>;
  }

  if (!popularProducts || popularProducts.length === 0) {
    return <p className="text-gray-500 text-sm">No popular products data available.</p>;
  }

  // Find the maximum sold quantity for relative progress bar scaling
  const maxSold = Math.max(...popularProducts.map(p => p.totalSold));

  return (
    <div className="space-y-4">
      {popularProducts.map((item) => {
        const product = productDetails[item.productId];
        
        return (
          <Link
            href={`/admin/products/${item.productId}`}
            key={item.productId}
            className="block hover:bg-gray-50 rounded-lg p-3 -mx-3 transition-colors"
          >
            <div className="mb-1 flex justify-between">
              <div>
                <h4 className="font-medium">{product?.name || `Product #${item.productId}`}</h4>
                <p className="text-sm text-gray-500">
                  {product?.category?.name || 'Unknown category'}
                </p>
              </div>
              <div className="text-right">
                <span className="font-medium">{item.totalSold}</span>
                <p className="text-xs text-gray-500">units sold</p>
              </div>
            </div>
            <Progress
              value={(item.totalSold / maxSold) * 100}
              className="h-2"
            />
          </Link>
        );
      })}
      
      <div className="pt-2">
        <Link 
          href="/admin/products"
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Manage all products →
        </Link>
      </div>
    </div>
  );
}