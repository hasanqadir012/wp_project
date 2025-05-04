'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { productApi } from '@/lib/api'
import { useCart } from '@/providers/CartProvider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { MinusIcon, PlusIcon, ShoppingCart, Heart, Share2 } from 'lucide-react'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return
      
      setLoading(true)
      try {
        const product = (await productApi.getProduct(params.id))[0]
        console.log('Fetched product:', product);
        
        
        if (!product) {
          setError('Product not found')
          return
        }
        
        setProduct(product)
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError('Failed to load product. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [params.id])

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount))
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      // Show success notification or feedback
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-md" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <Button onClick={() => router.push('/products')}>
          Return to Products
        </Button>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center mb-4">
            {/* Placeholder for main product image */}
            <div className="text-gray-400 text-xl">Product Image</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {/* Thumbnail Images */}
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`bg-gray-100 h-20 rounded cursor-pointer border-2 
                  ${activeImage === index ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <Badge className="mb-2">{product.category?.name || 'Perfume'}</Badge>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-primary mb-4">
            {formatCurrency(product.price)}
          </p>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-3 font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <MinusIcon size={16} />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border-0"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleQuantityChange(1)}
              >
                <PlusIcon size={16} />
              </Button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Heart size={20} />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Share2 size={20} />
            </Button>
          </div>
          
          {/* Product Details */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Product Details:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Category: {product.category?.name || 'Perfume'}</li>
              <li>SKU: {product.id}</li>
              <li>Availability: {product.isAvailable ? 'In Stock' : 'Out of Stock'}</li>
              <li>Stock: {product.stockQuantity} units</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Tabs for Additional Information */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4">
            <p className="text-gray-600">{product.description}</p>
          </TabsContent>
          <TabsContent value="details" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Product Specifications:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Volume: 100ml</li>
                  <li>Family: Oriental</li>
                  <li>Concentration: Eau de Parfum</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Key Notes:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Top: Bergamot, Lemon</li>
                  <li>Heart: Jasmine, Rose</li>
                  <li>Base: Vanilla, Musk</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            <p className="text-gray-600">No reviews yet for this product.</p>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      {/* {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <Card key={item.id} className="overflow-hidden cursor-pointer" 
                onClick={() => router.push(`/products/${item.id}`)}>
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-400">Product Image</div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="font-bold mt-1">{formatCurrency(item.price)}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )} */}
    </div>
  )
}