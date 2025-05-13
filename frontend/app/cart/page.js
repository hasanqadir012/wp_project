'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/providers/CartProvider'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AlertCircle, MinusIcon, PlusIcon, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { API_BASE_URL } from '@/lib/api'

export default function CartPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart()
  const { isAuthenticated } = useAuth()
  const [couponCode, setCouponCode] = useState('')

  // Shipping cost could be calculated dynamically based on location or order size
  const shippingCost = totalPrice > 50 ? 0 : 10
  const tax = totalPrice * 0.08 // 8% tax
  const orderTotal = totalPrice + shippingCost + tax

  const handleQuantityChange = (productId, change) => {
    const item = cart.find(item => item.id === productId)
    if (item) {
      const newQuantity = item.quantity + change
      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity)
      }
    }
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
  }

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push('/checkout')
    } else {
      router.push('/login?redirect=checkout')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-6 gap-4 font-medium text-sm mb-4 text-gray-500">
                  <div className="col-span-3">PRODUCT</div>
                  <div className="text-center">PRICE</div>
                  <div className="text-center">QUANTITY</div>
                  <div className="text-right">TOTAL</div>
                </div>
                
                <Separator className="mb-4" />
                
                {cart.map((item) => (
                  <div key={item.id} className="mb-6">
                    <div className="grid grid-cols-6 gap-4 items-center">
                      {/* Product */}
                      <div className="col-span-3 flex items-center space-x-4">
                        <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                          <img
                            src={`${API_BASE_URL}${item.imageUrl}`} 
                            alt={item.name}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-500 text-sm">{item.category?.name || 'Perfume'}</p>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="text-center">
                        {formatCurrency(item.price)}
                      </div>
                      
                      {/* Quantity */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <MinusIcon size={14} />
                          </Button>
                          <div className="w-8 text-center">{item.quantity}</div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <PlusIcon size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Total + Remove */}
                      <div className="flex items-center justify-end">
                        <span className="mr-3">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Item separator */}
                    {cart.indexOf(item) < cart.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {shippingCost === 0 
                        ? 'Free' 
                        : formatCurrency(shippingCost)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(orderTotal)}</span>
                  </div>
                </div>
                
                {/* Coupon Code */}
                <div className="flex gap-2 mb-6">
                  <Input 
                    placeholder="Coupon code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline">Apply</Button>
                </div>
                
                {/* Checkout Button */}
                <Button 
                  className="w-full mb-2" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                
                {/* Free shipping notification */}
                {totalPrice < 50 && (
                  <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
                    <AlertCircle size={18} className="mt-0.5" />
                    <p className="text-sm">
                      Add {formatCurrency(50 - totalPrice)} more to get free shipping!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}