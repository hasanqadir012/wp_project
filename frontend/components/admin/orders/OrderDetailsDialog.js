import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Separator } from "@/components/ui/separator";
  import OrderStatusBadge from "./OrderStatusBadge";
  import OrderStatusSelector from "./OrderStatusSelector";
  import { formatDate, formatCurrency } from "@/lib/utils";
  
  export default function OrderDetailsDialog({ order, open, onClose, onUpdateStatus }) {
    if (!order) return null;
  
    const handleStatusChange = (newStatus) => {
      onUpdateStatus(order.orderId, newStatus);
    };
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogDescription>
            Order details for order #{order.orderId}
          </DialogDescription>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Order #{order.orderId}</span>
              <OrderStatusBadge status={order.orderStatus} />
            </DialogTitle>
          </DialogHeader>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div>
              <h3 className="font-medium mb-2">Customer Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {order.user?.firstName} {order.user?.lastName}</p>
                <p><span className="font-medium">Email:</span> {order.user?.email || 'N/A'}</p>
                <p><span className="font-medium">Phone:</span> {order.user?.phoneNumber || 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Order Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Date:</span> {formatDate(order.createdAt)}</p>
                <p>
                  <span className="font-medium">Status:</span>
                  <OrderStatusSelector 
                    currentStatus={order.orderStatus} 
                    onStatusChange={handleStatusChange} 
                  />
                </p>
              </div>
            </div>
          </div>
  
          <div className="mt-4">
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <p className="text-sm">{order.shippingAddress || 'No shipping address provided'}</p>
          </div>
  
          <Separator className="my-4" />
  
          <div>
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems?.map((item) => (
                    <tr key={item.orderItemId}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {item.product?.imageUrl && (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-10 w-10 object-cover rounded-md mr-3"
                            />
                          )}
                          <div>
                            <div className="font-medium">{item.product?.name}</div>
                            <div className="text-gray-500">{item.product?.category?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium">
                      Subtotal
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium">
                      Shipping
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      {formatCurrency(order.shippingCost || 0)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right text-sm font-semibold">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      {formatCurrency((order.totalAmount || 0) + (order.shippingCost || 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
  
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              Print Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }