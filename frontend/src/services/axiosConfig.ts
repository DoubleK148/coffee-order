import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Log token for debugging
      console.log('Using token:', token.substring(0, 10) + '...');
    } else {
      console.warn('No token found in storage');
    }
    
    // For FormData requests, let the browser set the Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      delete config.headers['Accept'];
      config.headers['Accept'] = 'application/json';
    }
    
    // Log the complete request for debugging
    console.log('🚀 Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? 'Bearer ...' : 'None'
      },
      data: config.data instanceof FormData 
        ? Object.fromEntries(config.data.entries())
        : config.data
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', {
      url: `${response.config.baseURL}${response.config.url}`,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Log detailed error information
    console.error('❌ Response error:', {
      url: `${error.config?.baseURL}${error.config?.url}`,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.config?.headers ? {
        ...error.config.headers,
        Authorization: error.config.headers.Authorization ? 'Bearer ...' : 'None'
      } : 'No headers'
    });

    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.error('No refresh token found, redirecting to login');
          window.location.href = '/login';
          return Promise.reject(new Error('No refresh token available'));
        }

        console.log('🔄 Refreshing token...');
        
        // Call refresh token endpoint
        const response = await api.post('/api/auth/refresh-token', {
          refreshToken
        });

        if (!response.data?.success) {
          throw new Error(response.data?.message || 'Token refresh failed');
        }

        const { accessToken } = response.data.data;
        localStorage.setItem('token', accessToken);
        console.log('✅ Token refreshed successfully');

        // Update Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Refresh token error:', refreshError);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // If error response contains a message, use it
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

export default api;