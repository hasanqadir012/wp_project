import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/utils';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ExternalLink, 
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { adminApi } from '@/lib/api';

export default function ProductsTable({ products, loading, onDelete, onRefresh }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleUpdateAvailability = async (productId, isAvailable) => {
    setActionLoading(true);
    try {
      await adminApi.updateProduct(productId, { isAvailable: !isAvailable });
      onRefresh();
      toast({
        title: 'Success',
        description: `Product ${isAvailable ? 'hidden' : 'shown'} successfully`,
      });
    } catch (error) {
      console.error('Error updating product availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product availability',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No products found</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedProducts.length === products.length && products.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all products"
              />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={(checked) => handleSelectProduct(product.id, checked)}
                  aria-label={`Select ${product.name}`}
                />
              </TableCell>
              <TableCell>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {product.description}
                </div>
              </TableCell>
              <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell className="text-center">
                {product.stockQuantity}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={product.isAvailable ? "success" : "secondary"}>
                  {product.isAvailable ? 'Active' : 'Hidden'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/admin/products/${product.id}`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => handleUpdateAvailability(product.id, product.isAvailable)}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {product.isAvailable ? 'Hide' : 'Show'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={() => onDelete(product.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}