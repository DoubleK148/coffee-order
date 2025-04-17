import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error:', error);
      error.message = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối và đảm bảo server đang chạy.';
    } else if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data
      });

      switch (error.response.status) {
        case 401:
          // Clear user data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          error.message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          break;
        case 403:
          error.message = 'Bạn không có quyền thực hiện thao tác này.';
          break;
        case 404:
          error.message = 'Không tìm thấy tài nguyên yêu cầu.';
          break;
        default:
          error.message = error.response.data.message || 'Có lỗi xảy ra';
      }
    } else if (error.request) {
      console.error('Request error:', error.request);
      error.message = 'Không nhận được phản hồi từ server';
    }
    return Promise.reject(error);
  }
);

export default instance;
