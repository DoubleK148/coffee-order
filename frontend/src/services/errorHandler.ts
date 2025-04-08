import axios from 'axios';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public type: string = 'APP_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return error.message;
  }
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Lỗi từ server
      const message = error.response.data?.message || error.message;
      const status = error.response.status;
      
      switch (status) {
        case 401:
          return 'Vui lòng đăng nhập để tiếp tục';
        case 403:
          return 'Bạn không có quyền thực hiện thao tác này';
        case 404:
          return 'Không tìm thấy dữ liệu yêu cầu';
        default:
          return message || 'Lỗi kết nối server';
      }
    }
    if (error.request) {
      // Lỗi không nhận được response
      return 'Không thể kết nối đến server';
    }
    // Lỗi khi setup request
    return error.message || 'Lỗi kết nối';
  }
  // Lỗi không xác định
  return 'Đã có lỗi xảy ra';
};

export const handleApiError = (error: unknown, defaultMessage: string): never => {
  console.error('API Error:', error);
  
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || defaultMessage;
    
    throw new AppError(message, status);
  }
  
  throw new AppError(defaultMessage);
}; 