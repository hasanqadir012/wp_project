import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Package, ShoppingCart } from 'lucide-react';

export default function DashboardMetrics({ dashboardData }) {
  const metrics = [
    {
      title: "Total Sales",
      value: formatCurrency(dashboardData?.totalSales || 0),
      description: "Total revenue from all orders",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Orders",
      value: dashboardData?.recentOrders?.length || 0,
      description: "Total orders placed",
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      title: "Products",
      value: dashboardData?.popularProducts?.length || 0,
      description: "Top selling products",
      icon: Package,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {metric.title}
            </CardTitle>
            <metric.icon 
              className={`h-5 w-5 ${metric.color}`} 
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}