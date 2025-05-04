'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus } from 'lucide-react'

export default function ProductDetailPage({ params }) {
  const { id } = params
  const router = useRouter()
  
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      
      try {
        // Fetch product details
        const response = await fetch(`http://localhost:5000/api/products/${id}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        
        const data = await response.json()
        setProduct(data)
        
        // Fetch related products from the same category
        if (data.categoryId) {
          const relatedResponse = await fetch(
            `http://localhost:5000/api/products?categoryId=${data.categoryId}&limit=4&exclude=${id}`
          )
          const relatedData = await relatedResponse.json()
          setRelatedProducts(relatedData.items || relatedData)
        }
        
        // Check if product is in favorites
        const token = localStorage.getItem('token')
        if (token) {
          const favResponse = await fetch(`http://localhost:5000/api/favorites/check/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          
          if (favResponse.ok) {
            const favData = await favResponse.json()
            setIsFavorite(favData.isFavorite)
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error)
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchProductDetails()
  }, [id, toast])
  
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to add items to your cart',
          variant: 'destructive',
        })
        router.push('/login')
        return
      }
      
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id,
          quantity: quantity
        })
      })
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Product added to cart',
        })
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: 'Error',
        description: 'Failed to add product to cart',
        variant: 'destructive',
      })
    }
  }
  
  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to add items to favorites',
          variant: 'destructive',
        })
        router.push('/login')
        return
      }
      
      const method = isFavorite ? 'DELETE' : 'POST'
      const url = isFavorite 
        ? `http://localhost:5000/api/favorites/${id}`
        : 'http://localhost:5000/api/favorites'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: !isFavorite ? JSON.stringify({ productId: id }) : undefined
      })
      
      if (response.ok) {
        setIsFavorite(!isFavorite)
        toast({
          title: 'Success',
          description: isFavorite 
            ? 'Product removed from favorites'
            : 'Product added to favorites',
        })
      } else {
        throw new Error('Failed to update favorites')
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      })
    }
  }
  
  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10)) // Limit to 10 items
  }
  
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1)) // Minimum 1 item
  }
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-1/3" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-4">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
      </div>
      
      {/* Product details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product image */}
        <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
          {/* Replace with actual image when available */}
          <div className="text-3xl text-gray-400 font-light">Product Image</div>
        </div>
        
        {/* Product information */}
        <div className="space-y-4">
          <div>
            <Badge>{product.categoryName}</Badge>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={star <= (product.rating || 4) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.numReviews || 0} reviews</span>
          </div>
          
          <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
          
          <div className="py-2">
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {product.stock > 0 ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              In Stock ({product.stock})
            </Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
          
          {/* Quantity selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= 10 || quantity >= product.stock}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </Button>
            
            <Button
              variant={isFavorite ? "secondary" : "outline"}
              size="icon"
              onClick={toggleFavorite}
              className="h-12 w-12"
            >
              <Heart size={18} className={isFavorite ? "fill-current" : ""} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product details tabs */}
      <Tabs defaultValue="description" className="mt-8">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="p-4">
          <div className="prose max-w-none">
            <p>{product.description}</p>
            {/* Add more detailed description here */}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">Brand</td>
                <td>{product.brand || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Model</td>
                <td>{product.model || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Dimensions</td>
                <td>{product.dimensions || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Weight</td>
                <td>{product.weight || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Color</td>
                <td>{product.color || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Material</td>
                <td>{product.material || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
        
        <TabsContent value="reviews" className="p-4">
          <div className="space-y-4">
            {/* This would be populated with actual reviews */}
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden">
                <div className="relative h-40 bg-gray-100">
                  {/* Replace with actual image when available */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Product Image
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1 truncate">{relatedProduct.name}</h3>
                  <p className="font-bold mb-2">${relatedProduct.price.toFixed(2)}</p>
                  <Link href={`/products/${relatedProduct.id}`} className="w-full">
                    <Button size="sm" variant="secondary" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}