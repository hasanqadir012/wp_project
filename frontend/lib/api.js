const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5022/api';

// Common fetch function with auth handling
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    credentials: 'include',
    ...options.headers,
  };
  
  const config = {
    ...options,
    credentials: 'include',
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return null;
      }
    }
    
    // Handle successful response
    if (response.ok) {
      if (response.headers.get('content-type')?.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    }
    
    // Handle error response
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Home API
export const homeApi = {
  getHomeData: () => fetchAPI('/Home/index'),
  getAbout: () => fetchAPI('/Home/about'),
  getContact: () => fetchAPI('/Home/contact'),
  getShop: (category = null, page = 1) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('page', page);
    return fetchAPI(`/Home/shop?${params.toString()}`);
  }
};

// Product API
export const productApi = {
  getAllProducts: () => fetchAPI('/Product'),
  getProduct: (id) => fetchAPI(`/Product/${id}`),
  getPopularProducts: () => fetchAPI('/Product/popular'),
  getCategories: () => fetchAPI('/Product/category-list'),
  searchProducts: (searchTerm, category = 'all collections', priceLow, priceHigh) => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (category) params.append('category', category);
    if (priceLow !== undefined) params.append('priceLow', priceLow);
    if (priceHigh !== undefined) params.append('priceHigh', priceHigh);
    return fetchAPI(`/Product/search?${params.toString()}`);
  }
};

// Auth API
export const authApi = {
  login: (credentials) => fetchAPI('/Login/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    credentials: 'include',
  }),
  logout: () => fetchAPI('/Login/logout', {
    method: 'POST'
  }),
  register: (userData) => fetchAPI('/Login/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
};

// Admin API
export const adminApi = {
  getProducts: () => fetchAPI('/Admin/products'),
  createProduct: (productData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(productData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, productData[key]);
      }
    });
    
    // Append images
    if (productData.images && productData.images.length) {
      for (let i = 0; i < productData.images.length; i++) {
        formData.append('images', productData.images[i]);
      }
    }
    
    return fetchAPI('/Admin/products', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData
    });
  },
  updateProduct: (id, productData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(productData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, productData[key]);
      }
    });
    
    // Append images
    if (productData.images && productData.images.length) {
      for (let i = 0; i < productData.images.length; i++) {
        formData.append('images', productData.images[i]);
      }
    }
    
    return fetchAPI(`/Admin/products/${id}`, {
      method: 'PUT',
      headers: {}, // Let browser set content-type for FormData
      body: formData
    });
  },
  deleteProduct: (id) => fetchAPI(`/Admin/products/${id}`, {
    method: 'DELETE'
  }),
  getOrders: () => fetchAPI('/Admin/orders'),
  updateOrderStatus: (orderId, newStatus) => fetchAPI(`/Admin/orders/${orderId}/status?newStatus=${newStatus}`, {
    method: 'PUT'
  }),
  getInventoryReport: () => fetchAPI('/Admin/inventory-report'),
  getDashboard: () => fetchAPI('/Admin/dashboard')
};

export default {
  home: homeApi,
  product: productApi,
  auth: authApi,
  admin: adminApi
};