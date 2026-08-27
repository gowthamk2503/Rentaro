import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors and handle status codes
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected server error occurred.';
    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.response = error.response;
    return Promise.reject(customError);
  }
);

// 1. Authentication & Profile API
export const authApi = {
  login: (email, password) => api.post('/users/login', { email, password }),
  adminLogin: (email, password) => api.post('/users/admin-login', { email, password }),
  register: (userData) => api.post('/users/register', userData),
  googleLogin: (credentialPayload) => api.post('/users/google-login', credentialPayload),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// 2. Cars / Fleet API
export const carsApi = {
  getAll: (params) => api.get('/cars', { params }),
  getById: (id) => api.get(`/cars/${id}`),
  add: (carData) => api.post('/cars/add', carData),
  update: (id, carData) => api.put(`/cars/${id}`, carData),
  delete: (id) => api.delete(`/cars/${id}`),
  toggleAvailability: (id) => api.patch(`/cars/${id}/availability`),
};

// 3. Bookings API
export const bookingsApi = {
  create: (bookingData) => api.post('/bookings/create', bookingData),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  getByEmail: (email) => api.get(`/bookings/user/${email}`),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  updateStatus: (id, status, paymentStatus) => api.put(`/bookings/${id}`, { status, paymentStatus }),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  delete: (id) => api.delete(`/bookings/${id}`),
};

// 4. Payments API (Razorpay Integration)
export const paymentsApi = {
  createOrder: (bookingId) => api.post('/payments/create-order', { bookingId }),
  verifyPayment: (payload) => api.post('/payments/verify', payload),
  getBookingPayment: (bookingId) => api.get(`/payments/booking/${bookingId}`),
};

// 5. Dashboard & Analytics Stats API
export const statsApi = {
  getDashboardStats: () => api.get('/stats/dashboard'),
};

// 6. Admin User Management API
export const adminUsersApi = {
  getAll: () => api.get('/users/admin/all'),
  updateStatus: (id, data) => api.patch(`/users/admin/${id}/status`, data),
  delete: (id) => api.delete(`/users/admin/${id}`),
};

export default api;
