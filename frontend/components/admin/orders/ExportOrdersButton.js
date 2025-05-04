import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { generateCSV } from '@/lib/utils';

export default function ExportOrdersButton({ orders }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);

    try {
      // Format orders data for CSV export
      const exportData = orders.map(order => ({
        'Order ID': order.id,
        'Customer': order.user?.username || 'Guest',
        'Customer Email': order.user?.email || 'N/A',
        'Date': new Date(order.createdAt).toLocaleString(),
        'Total Amount': order.totalAmount,
        'Status': order.orderStatus,
        'Items Count': order.orderItems?.length || 0,
        'Shipping Address': order.shippingAddress || 'N/A'
      }));

      // Generate and download CSV
      generateCSV(exportData, `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={exporting || !orders.length}>
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Export
        </>
      )}
    </Button>
  );
}