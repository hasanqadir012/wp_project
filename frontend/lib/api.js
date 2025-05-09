// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://k224084-001-site1.qtempurl.com/api';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wpbackend.convult.com/api';
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
  
  const config = {
    ...options,
    credentials: 'include',
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    // Handle successful response
    if (response.ok) {
      if (response.headers.get('content-type')?.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    }
    
    // Handle error response
    const errorData = await response.json().catch(() => ({}));
    
    // Create more descriptive error with validation messages
    const errorMessage = createErrorMessage(errorData);
    const error = new Error(errorMessage);
    error.statusCode = response.status;
    error.data = errorData;
    throw error;
  } catch (error) {
    throw error;
  }
}

// Helper function to create a meaningful error message from the API response
function createErrorMessage(errorData) {
  // If there's no error data, return a generic message
  if (!errorData || Object.keys(errorData).length === 0) {
    return 'An error occurred while processing your request';
  }

  // If the response contains validation errors
  if (errorData.errors && typeof errorData.errors === 'object') {
    // Collect all validation error messages
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

  // If there's a title or message in the response, use that
  if (errorData.title) return errorData.title;
  if (errorData.message) return errorData.message;
  
  // Fallback to a generic error message
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
  getProducts: () => fetchAPI('/Admin/products', {
    credentials: 'include',
  }),
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
      credentials: 'include',
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
      body: formData,
      credentials: 'include',
    });
  },
  deleteProduct: (id) => fetchAPI(`/Admin/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  }),
  getOrders: () => fetchAPI('/Admin/orders', {
    credentials: 'include',
  }),
  updateOrderStatus: (orderId, newStatus) => fetchAPI(`/Admin/orders/${orderId}/status?newStatus=${newStatus}`, {
    method: 'PUT',
    credentials: 'include',
  }),
  getInventoryReport: () => fetchAPI('/Admin/inventory-report', {
    credentials: 'include',
  }),
  getDashboard: () => fetchAPI('/Admin/dashboard', {
    credentials: 'include',
  })
};

export default {
  home: homeApi,
  product: productApi,
  auth: authApi,
  admin: adminApi
};