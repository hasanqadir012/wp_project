import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { productApi } from '@/lib/api';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

export default function ProductFormDialog({ open, onOpenChange, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryName: '',
    stockQuantity: '',
    isAvailable: true,
    images: []
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Set initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        categoryName: initialData.categoryName || '',
        stockQuantity: initialData.stockQuantity || '',
        isAvailable: initialData.isAvailable ?? true,
        images: []
      });
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const fetchCategories = async () => {
    try {
      const categoryList = await productApi.getCategories();
      const formattedCategories = categoryList
        .filter(category => !['All Collections', 'Best Selling', 'New Arrivals'].includes(category))
        .map(category => ({
          id: category.toLowerCase().replace(/\s+/g, '-'),
          name: category
        }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryName: '',
      stockQuantity: '',
      isAvailable: true,
      images: []
    });
    setSelectedFiles([]);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Price must be a positive number';
    if (!formData.categoryName) newErrors.categoryName = 'Category is required';
    if (!formData.stockQuantity) newErrors.stockQuantity = 'Stock quantity is required';
    if (isNaN(formData.stockQuantity) || Number(formData.stockQuantity) < 0) newErrors.stockQuantity = 'Stock quantity must be a non-negative number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryName: formData.categoryName,
        stockQuantity: Number(formData.stockQuantity),
        isAvailable: formData.isAvailable,
        images: formData.images
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Update product information in your inventory' 
              : 'Add a new product to your inventory'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="col-span-2">
              <Label htmlFor="name" className="mb-1">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            {/* Description */}
            <div className="col-span-2">
              <Label htmlFor="description" className="mb-1">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            
            {/* Price & Category */}
            <div>
              <Label htmlFor="price" className="mb-1">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            
            <div>
              <Label htmlFor="category" className="mb-1">Category</Label>
              <Select
                value={formData.categoryName}
                onValueChange={(value) => handleSelectChange('categoryName', value)}
              >
                <SelectTrigger className={errors.categoryName ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>
            
            {/* Stock Quantity */}
            <div>
              <Label htmlFor="stockQuantity" className="mb-1">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleChange}
                className={errors.stockQuantity ? 'border-red-500' : ''}
              />
              {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
            </div>
            
            {/* Available Switch */}
            <div className="flex items-center justify-end space-x-2">
              <Label htmlFor="isAvailable" className="cursor-pointer">Available</Label>
              <Switch
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) => handleSelectChange('isAvailable', checked)}
              />
            </div>
            
            {/* Image Upload */}
            <div className="col-span-2">
              <Label htmlFor="images" className="mb-1">Product Images</Label>
              <div className="flex items-center">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="py-2 px-4 border rounded-md border-dashed border-gray-300 flex items-center space-x-2 hover:bg-gray-50 transition-colors">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Upload images</span>
                  </div>
                  <input
                    id="file-upload"
                    name="images"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                
                {selectedFiles.length > 0 && (
                  <span className="ml-3 text-sm text-gray-500">
                    {selectedFiles.length} file(s) selected
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}