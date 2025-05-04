'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Filter } from 'lucide-react';
import ProductsTable from './ProductsTable';
import ProductFormDialog from './ProductFormDialog';
import { toast } from 'sonner';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler for creating a new product
  const handleCreateProduct = async (productData) => {
    try {
      await adminApi.createProduct(productData);
      fetchProducts(); // Refresh products list
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handler for deleting a product
  const handleDeleteProduct = async (productId) => {
    try {
      await adminApi.deleteProduct(productId);
      fetchProducts(); // Refresh products list
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      {/* Products Table */}
      <ProductsTable 
        products={filteredProducts} 
        loading={loading} 
        onDelete={handleDeleteProduct}
        onRefresh={fetchProducts}
      />
      
      {/* Product Form Dialog */}
      <ProductFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
}