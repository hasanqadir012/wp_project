'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { API_BASE_URL, IMAGE_BASE_URL, productApi } from '@/lib/api'
import { useCart } from '@/providers/CartProvider'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { MinusIcon, PlusIcon, ShoppingCart, Heart, Share2 } from 'lucide-react'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { addToCart, cart, updateQuantity } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [productImages, setProductImages] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return
      
      setLoading(true)
      try {
        const product = (await productApi.getProduct(params.id))[0]
        
        if (!product) {
          setError('Product not found')
          return
        }
        
        setProduct(product)

          try {
            const imagesData = await productApi.getProductImages(params.id)
            const allImages = []
            
            // Add main image if exists
            if (imagesData.mainImage) {
              allImages.push(imagesData.mainImage)
            }
            
            // Add additional images
            if (imagesData.additionalImages && imagesData.additionalImages.length > 0) {
              allImages.push(...imagesData.additionalImages)
            }
            
            setProductImages(allImages)
          } catch (err) {
            console.error('Failed to fetch product images:', err)
          }
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

  // Use useCallback to prevent recreation of this function on each render
  const handleAddToCart = () => {
    if (product) {
      const item = cart.find(item => item.id === product.id)
      
      if (item) {
        const newQuantity = item.quantity + quantity
        if (newQuantity > 0) {
          updateQuantity(product.id, newQuantity)
        }
      } else {
        addToCart(product, quantity)
      }
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
          <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
            {productImages.length > 0 ? (
              <div className="relative w-full h-full">
                <img 
                  src={`${API_BASE_URL}${productImages[activeImage]}`} 
                  alt={product.name}
                  className="object-contain w-full h-full"
                />
              </div>
            ) : (
              <div className="text-gray-400 text-xl">No Image Available</div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`bg-gray-100 h-20 rounded cursor-pointer border-2 relative overflow-hidden
                    ${activeImage === index ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                    alt={`${product.name} - thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
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
              <ShoppingCart className="mr-2 h-5 w-5" /> 
              Add to Cart
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
            </ul>
          </div>
        </div>
      </div>
      
      {/* Tabs for Additional Information */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            {/* <TabsTrigger value="details">Details</TabsTrigger> */}
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4">
            <p className="text-gray-600">{product.description}</p>
          </TabsContent>
          {/* <TabsContent value="details" className="p-4">
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
          </TabsContent> */}
          <TabsContent value="reviews" className="p-4">
            <p className="text-gray-600">No reviews yet for this product.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}