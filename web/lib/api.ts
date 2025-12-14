import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Example API call
export const getHello = async () => {
  const response = await apiClient.get('/');
  return response.data;
};

// Re-export all API services from api subdirectory
export { ridesApi } from './api/rides';
export { bookingsApi } from './api/bookings';
export { ratingsApi } from './api/ratings';
export { notificationsApi } from './api/notifications';
export { driversApi } from './api/drivers';
export { ridersApi } from './api/riders';
export { vehiclesApi } from './api/vehicles';
