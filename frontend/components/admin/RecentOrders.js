import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import Link from 'next/link';

// Status badge color mapping
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function RecentOrders({ orders }) {
  if (!orders || orders.length === 0) {
    return <p className="text-gray-500 text-sm">No recent orders found.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link 
          href={`/admin/orders/${order.orderId}`}
          key={order.orderId}
          className="block hover:bg-gray-50 rounded-lg p-3 -mx-3 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Order #{order.orderId}</span>
                <Badge className={statusColors[order.orderStatus] || "bg-gray-100"}>
                  {order.orderStatus}
                </Badge>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <User size={14} className="mr-1" />
                <span>{order.user?.username || 'Guest'}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className="font-medium">
              {formatCurrency(order.totalAmount)}
            </div>
          </div>
        </Link>
      ))}
      
      <div className="pt-2">
        <Link 
          href="/admin/orders"
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          View all orders →
        </Link>
      </div>
    </div>
  );
}