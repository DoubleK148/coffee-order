import { config } from '../config';
import api from './axiosConfig';
import { handleApiError } from './errorHandler';

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    _id: string;
    email: string;
    fullName: string;
    role: string;
    phone?: string;
    address?: string;
  };
  message?: string;
}

export interface TokenResponse {
  success: boolean;
  accessToken: string;
  message?: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(config.endpoints.auth.register, data);
    if (!response.data.success) {
      throw new Error('Đăng ký thất bại');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Đăng ký thất bại');
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(config.endpoints.auth.login, data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Đăng nhập thất bại');
    }
    
    if (response.data && response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } else {
      throw new Error('Invalid response format from server');
    }
    
    return response.data;
  } catch (error) {
    localStorage.clear(); // Clear any partially saved data
    throw handleApiError(error, 'Đăng nhập thất bại');
  }
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await api.post(config.endpoints.auth.logout, { refreshToken });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.clear();
    window.location.href = '/login';
  }
};

export const refreshToken = async (): Promise<TokenResponse> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token found');

    const response = await api.post<TokenResponse>(config.endpoints.auth.refreshToken, {
      refreshToken
    });

    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }

    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Refresh token expired. Please login again');
  }
}; 
