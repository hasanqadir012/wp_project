const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5022/api';

// Common fetch function with auth handling
// Updated fetchAPI function to properly handle validation errors
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  let headers = {};
  if (!options.body || !(options.body instanceof FormData)) {
    headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  } else {
    // For FormData, use any custom headers but don't set Content-Type
    headers = { ...options.headers };
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    if (response.ok) {
      if (response.headers.get('content-type')?.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    }
    
    const errorData = await response.json().catch(() => ({}));
    
    const errorMessage = createErrorMessage(errorData);
    const error = new Error(errorMessage);
    error.statusCode = response.status;
    error.data = errorData;
    throw error;
  } catch (error) {
    throw error;
  }
}

function createErrorMessage(errorData) {
  if (!errorData || Object.keys(errorData).length === 0) {
    return 'An error occurred while processing your request';
  }

  if (errorData.errors && typeof errorData.errors === 'object') {
    const validationErrors = [];
    Object.entries(errorData.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        messages.forEach(message => {
          validationErrors.push(message);
        });
      }
    });

    if (validationErrors.length > 0) {
      return validationErrors.join('\n');
    }
  }

  if (errorData.title) return errorData.title;
  if (errorData.message) return errorData.message;
  
  return 'Something went wrong. Please try again.';
}

// Home API
export const homeApi = {
  getHomeData: () => fetchAPI('/Home/index'),
  getAbout: () => fetchAPI('/Home/about'),
  getContact: () => fetchAPI('/Home/contact'),
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
      body: formData,
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
      headers: {},
      body: formData,
    });
  },
  deleteProduct: (id) => fetchAPI(`/Admin/products/${id}`, {
    method: 'DELETE',
  }),
  getOrders: () => fetchAPI('/Admin/orders'),
  updateOrderStatus: (orderId, newStatus) => fetchAPI(`/Admin/orders/${orderId}/status?newStatus=${newStatus}`, {
    method: 'PUT',
  }),
  getInventoryReport: () => fetchAPI('/Admin/inventory-report'),
  getDashboard: () => fetchAPI('/Admin/dashboard')
};

export const checkoutApi = {
  placeOrder: (orderData) => fetchAPI('/Checkout/place-order', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  getOrderHistory: () => fetchAPI('/Checkout/order-history'),

  getOrderDetails: (orderId) => fetchAPI(`/Checkout/order/${orderId}`),

  getSavedAddresses: () => fetchAPI('/Checkout/addresses'),

  addAddress: (addressData) => fetchAPI('/Checkout/addresses', {
    method: 'POST',
    body: JSON.stringify(addressData),
  }),

  updateAddress: (addressId, addressData) => fetchAPI(`/Checkout/addresses/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(addressData),
  }),

  deleteAddress: (addressId) => fetchAPI(`/Checkout/addresses/${addressId}`, {
    method: 'DELETE',
  }),

  setDefaultAddress: (addressId) => fetchAPI(`/Checkout/addresses/${addressId}/default`, {
    method: 'PUT',
  }),
};

export default {
  home: homeApi,
  product: productApi,
  auth: authApi,
  checkout: checkoutApi,
  admin: adminApi
};