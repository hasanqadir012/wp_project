'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_BASE_URL, productApi } from '@/lib/api'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { CloudCog, Search } from 'lucide-react'

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('searchTerm') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Collections')
  const [priceRange, setPriceRange] = useState([0, 1000])
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productApi.getCategories();
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      
      try {
        const data = await productApi.searchProducts();
        
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    params.set('searchTerm', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    params.set('priceLow', priceRange[0])
    params.set('priceHigh', priceRange[1])
    router.push(`/products?${params.toString()}`)
    const fetchProducts = async () => {
      setLoading(true)
      
      try {
        const data = await productApi.searchProducts(searchQuery, selectedCategory, priceRange[0], priceRange[1]);
        
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters sidebar */}
      <div className="bg-white p-4 border">
        <h2 className="font-bold text-lg mb-4">Filters</h2>
        
        {/* Search */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" size="icon">
              <Search size={18} />
            </Button>
          </div>
        </form>
        
        {/* Categories */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category}`} 
                  checked={selectedCategory === category.toString()} 
                  onCheckedChange={() => handleCategoryChange(category.toString())}
                />
                <label 
                  htmlFor={`category-${category}`} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Price Range</h3>
          <div className="mb-2">
            <Slider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/*Submit Filter*/}
        <div className="mb-4 text-right">
          <Button onClick={handleSubmit}>
            Search
          </Button>
        </div>
        
        {/* Sort */}
        {/* <div>
          <h3 className="font-medium mb-2">Sort By</h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="priceLow">Price: Low to High</SelectItem>
              <SelectItem value="priceHigh">Price: High to Low</SelectItem>
              <SelectItem value="nameAsc">Name: A to Z</SelectItem>
              <SelectItem value="nameDesc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>
      
      {/* Product listing */}
      <div className="md:col-span-3">
        <h1 className="text-2xl font-bold mb-4 mt-4 ml-4">Products</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-5 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All Collections')
              setPriceRange([0, 1000])
              router.push('/products')
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 bg-gray-100">
                    {/* Replace with actual image when available */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <img 
                        src={`${API_BASE_URL}${product.imageUrl}`} 
                        alt={product.name}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <Badge className="mb-2">{product.categoryName}</Badge>
                    <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">
                      {product.description?.substring(0, 80)}...
                    </p>
                    <p className="font-bold text-lg">${product.price?.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/products/${product.id}`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}