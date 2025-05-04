import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function LowStockAlert({ lowStockItems }) {
  if (!lowStockItems || lowStockItems.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-orange-800">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Low Stock Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-orange-700 mb-4">
          The following products are running low on inventory and may need restocking.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockItems.map(item => (
            <Link 
              href={`/admin/products/${item.id}`}
              key={item.id}
              className="flex justify-between items-center p-3 bg-white rounded-md border border-orange-200 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">{item.category?.name || 'Unknown category'}</div>
              </div>
              <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                {item.stockQuantity} left
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}