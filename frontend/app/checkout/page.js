'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/providers/CartProvider'
import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { checkoutApi } from '@/lib/api'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, totalItems, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [sameAsBilling, setSameAsBilling] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    billing: {
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    shipping: {
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }
  })

  // Shipping cost logic
  const shippingCost = totalPrice > 50 ? 0 : 10
  const tax = totalPrice * 0.08 // 8% tax
  const orderTotal = totalPrice + shippingCost + tax

  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  // Handle same as billing checkbox
  const handleSameAsBillingChange = (checked) => {
    setSameAsBilling(checked)
    if (checked) {
      setFormData(prev => ({
        ...prev,
        shipping: { ...prev.billing }
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      setOrderError('Your cart is empty')
      return
    }

    try {
      setIsSubmitting(true)
      setOrderError(null)

      // Create payload for API
      const payload = {
        totalAmount: orderTotal,
        cartItems: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        billingAddress: {
          ...formData.billing,
          id: 0 // The backend will generate a real ID
        },
        shippingAddress: sameAsBilling 
          ? { ...formData.billing, id: 0 } 
          : { ...formData.shipping, id: 0 }
      }

      // Call the API
      const response = await checkoutApi.placeOrder(payload)
      
      // Handle success
      setOrderSuccess(true)
      setOrderId(response.orderId)
      
      // Clear the cart
      clearCart()

    } catch (error) {
      console.error('Checkout failed:', error)
      setOrderError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/login?redirect=checkout')
    return null
  }

  // Show success page after order is complete
  if (orderSuccess) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-10 pb-10 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-gray-600 mb-6">
              Your order #{orderId} has been placed successfully.
            </p>
            <p className="text-gray-600 mb-8">
              We've sent a confirmation email with your order details.
            </p>
            <div className="flex flex-col gap-4">
              <Button asChild size="lg">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main checkout form
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Billing Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billing-name">Full Name</Label>
                    <Input 
                      id="billing-name" 
                      required
                      value={formData.billing.fullName}
                      onChange={(e) => handleInputChange('billing', 'fullName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-phone">Phone Number</Label>
                    <Input 
                      id="billing-phone" 
                      type="tel" 
                      required
                      value={formData.billing.phoneNumber}
                      onChange={(e) => handleInputChange('billing', 'phoneNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-address1">Address Line 1</Label>
                  <Input 
                    id="billing-address1" 
                    required
                    value={formData.billing.addressLine1}
                    onChange={(e) => handleInputChange('billing', 'addressLine1', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-address2">Address Line 2 (Optional)</Label>
                  <Input 
                    id="billing-address2"
                    value={formData.billing.addressLine2}
                    onChange={(e) => handleInputChange('billing', 'addressLine2', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billing-city">City</Label>
                    <Input 
                      id="billing-city" 
                      required
                      value={formData.billing.city}
                      onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-state">State/Province</Label>
                    <Input 
                      id="billing-state" 
                      required
                      value={formData.billing.state}
                      onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billing-postal">Postal Code</Label>
                    <Input 
                      id="billing-postal" 
                      required
                      value={formData.billing.postalCode}
                      onChange={(e) => handleInputChange('billing', 'postalCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-country">Country</Label>
                    <Input 
                      id="billing-country" 
                      required
                      value={formData.billing.country}
                      onChange={(e) => handleInputChange('billing', 'country', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Shipping Information</CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="same-as-billing" 
                    checked={sameAsBilling}
                    onCheckedChange={handleSameAsBillingChange}
                  />
                  <Label htmlFor="same-as-billing">Same as billing address</Label>
                </div>
              </CardHeader>
              
              {!sameAsBilling && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-name">Full Name</Label>
                      <Input 
                        id="shipping-name" 
                        required
                        value={formData.shipping.fullName}
                        onChange={(e) => handleInputChange('shipping', 'fullName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping-phone">Phone Number</Label>
                      <Input 
                        id="shipping-phone" 
                        type="tel" 
                        required
                        value={formData.shipping.phoneNumber}
                        onChange={(e) => handleInputChange('shipping', 'phoneNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping-address1">Address Line 1</Label>
                    <Input 
                      id="shipping-address1" 
                      required
                      value={formData.shipping.addressLine1}
                      onChange={(e) => handleInputChange('shipping', 'addressLine1', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping-address2">Address Line 2 (Optional)</Label>
                    <Input 
                      id="shipping-address2"
                      value={formData.shipping.addressLine2}
                      onChange={(e) => handleInputChange('shipping', 'addressLine2', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-city">City</Label>
                      <Input 
                        id="shipping-city" 
                        required
                        value={formData.shipping.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping-state">State/Province</Label>
                      <Input 
                        id="shipping-state" 
                        required
                        value={formData.shipping.state}
                        onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-postal">Postal Code</Label>
                      <Input 
                        id="shipping-postal" 
                        required
                        value={formData.shipping.postalCode}
                        onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping-country">Country</Label>
                      <Input 
                        id="shipping-country" 
                        required
                        value={formData.shipping.country}
                        onChange={(e) => handleInputChange('shipping', 'country', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Payment Method */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="cash-on-delivery">
                  <div className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                    <Label htmlFor="cash-on-delivery">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Error Message */}
            {orderError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-red-700">
                <AlertTriangle className="mt-0.5 h-5 w-5" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <Button 
                type="submit" 
                size="lg" 
                className="sm:flex-1"
                disabled={isSubmitting || cart.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/cart')}
              >
                Return to Cart
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <div className="flex items-start">
                      <span className="bg-gray-100 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
                        {item.quantity}
                      </span>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 mb-4">
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
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(orderTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}