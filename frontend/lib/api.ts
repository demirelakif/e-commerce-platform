import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

console.log("API Base URL:", baseURL);
console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage to avoid circular dependency
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (credentials: { email: string; password: string }) => api.post("/auth/login", credentials),

  register: (userData: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post("/auth/register", userData),

  getCurrentUser: () => api.get("/auth/me"),

  updateProfile: (profileData: { firstName?: string; lastName?: string; phone?: string }) =>
    api.put("/auth/profile", profileData),

  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),

  resetPassword: (data: { token: string; password: string }) => api.post("/auth/reset-password", data),
};

export const productsAPI = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    sort?: string;
    order?: string;
    search?: string;
  }) => api.get("/products", { params }),

  getProduct: (id: string) => api.get(`/products/${id}`),

  getFeaturedProducts: () => api.get("/products/featured"),

  getPopularProducts: () => api.get("/products/popular"),

  getRelatedProducts: (id: string) => api.get(`/products/${id}/related`),

  searchProducts: (query: string, limit?: number) => api.get("/products/search", { params: { q: query, limit } }),
};

export const categoriesAPI = {
  getCategories: () => api.get("/categories"),

  getCategory: (id: string) => api.get(`/categories/${id}`),
};

export const ordersAPI = {
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    sort?: string;
    order?: string;
  }) => api.get("/orders", { params }),

  getUserOrders: (params?: { page?: number; limit?: number; status?: string }) => api.get("/orders/my-orders", { params }),

  getOrder: (id: string) => api.get(`/orders/${id}`),

  createOrder: (orderData: {
    items: Array<{
      product: string;
      quantity: number;
      variant?: { size?: string; color?: string };
    }>;
    shippingAddress: {
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone: string;
    };
    paymentMethod: string;
    notes?: string;
  }) => api.post("/orders", orderData),

  updateOrderStatus: (
    id: string,
    data: {
      status: string;
      trackingNumber?: string;
    }
  ) => api.put(`/orders/${id}/status`, data),
};

export const reviewsAPI = {
  getProductReviews: (
    productId: string,
    params?: {
      page?: number;
      limit?: number;
      rating?: number;
    }
  ) => api.get(`/reviews/product/${productId}`, { params }),

  createReview: (reviewData: { product: string; rating: number; title?: string; comment: string }) =>
    api.post("/reviews", reviewData),

  updateReview: (
    id: string,
    reviewData: {
      rating?: number;
      title?: string;
      comment?: string;
    }
  ) => api.put(`/reviews/${id}`, reviewData),

  deleteReview: (id: string) => api.delete(`/reviews/${id}`),

  approveReview: (id: string) => api.put(`/reviews/${id}/approve`),

  getUserReviews: (params?: { page?: number; limit?: number }) => api.get("/reviews/my-reviews", { params }),
};

export const usersAPI = {
  updateProfile: (profileData: { firstName?: string; lastName?: string; phone?: string }) =>
    api.put("/users/profile", profileData),

  addAddress: (addressData: {
    type: "shipping" | "billing";
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    isDefault?: boolean;
  }) => api.post("/users/addresses", addressData),

  updateAddress: (
    id: string,
    addressData: {
      type: "shipping" | "billing";
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country?: string;
      isDefault?: boolean;
    }
  ) => api.put(`/users/addresses/${id}`, addressData),

  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),

  setDefaultAddress: (id: string) => api.put(`/users/addresses/${id}/default`),

  updatePreferences: (preferences: { favoriteCategories?: string[]; newsletterSubscription?: boolean }) =>
    api.put("/users/preferences", preferences),

  getWishlist: () => api.get("/users/wishlist"),

  addToWishlist: (productId: string) => api.post(`/users/wishlist/${productId}`),

  removeFromWishlist: (productId: string) => api.delete(`/users/wishlist/${productId}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard"),

  getRecentOrders: () => api.get("/admin/recent-orders"),

  getPopularProducts: () => api.get("/admin/popular-products"),

  getSalesStats: (period?: string) => api.get("/admin/sales-stats", { params: { period } }),

  getCustomerStats: () => api.get("/admin/customer-stats"),

  getProductStats: () => api.get("/admin/product-stats"),

  getOrderStats: () => api.get("/admin/order-stats"),

  getReviewStats: () => api.get("/admin/review-stats"),
};
