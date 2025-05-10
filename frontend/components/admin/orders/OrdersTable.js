import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenu
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Eye,
  Package,
  Truck,
  Check,
  X,
  Loader2
} from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import { formatDate, formatCurrency } from '@/lib/utils';
import OrderDetailsDialog from './OrderDetailsDialog';

export default function OrdersTable({ orders, loading, onUpdateStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const statusOptions = [
    { value: 'Pending', label: 'Pending', icon: ChevronDown },
    { value: 'Processing', label: 'Processing', icon: Package },
    { value: 'Shipped', label: 'Shipped', icon: Truck },
    { value: 'Delivered', label: 'Delivered', icon: Check },
    { value: 'Cancelled', label: 'Cancelled', icon: X }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium">#{order.orderId}</TableCell>
                <TableCell>{order.user?.username || 'Guest'}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.orderItems?.length || 0} items</TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.orderStatus} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Status <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenu>
                          {statusOptions.map((option) => (
                            <DropdownMenuItem 
                              key={option.value}
                              onClick={() => onUpdateStatus(order.id, option.value)}
                              disabled={order.orderStatus === option.value}
                            >
                              <option.icon className="h-4 w-4 mr-2" />
                              {option.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenu>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </>
  );
}