import api from './axiosConfig'
import { handleApiError } from './errorHandler'

export interface User {
  [x: string]: any
  _id: string
  email: string
  fullName: string
  phone?: string
  address?: string
  role: string
  createdAt?: string
  updatedAt?: string
}

export interface UpdateProfileData {
  fullName: string
  phone?: string
  address?: string
}

export interface UserResponse {
  success: boolean
  user?: User
  message?: string
}

export interface UsersResponse {
  success: boolean
  users?: User[]
  message?: string
}

// User profile routes
export const getProfile = async (): Promise<User> => {
  try {
    const response = await api.get<UserResponse>('/api/users/profile');
    console.log('Profile response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể tải thông tin người dùng');
    }
    if (!response.data.user) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }
    return response.data.user;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw handleApiError(error, 'Không thể tải thông tin người dùng');
  }
};

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  try {
    const response = await api.put<UserResponse>('/api/users/profile/update', data);
    console.log('Update profile response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể cập nhật thông tin');
    }
    if (!response.data.user) {
      throw new Error('Không nhận được thông tin người dùng sau khi cập nhật');
    }
    return response.data.user;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw handleApiError(error, 'Không thể cập nhật thông tin');
  }
};

// Admin user management routes
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<UsersResponse>('/api/users');
    console.log('Users response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể tải danh sách người dùng');
    }
    return response.data.users || [];
  } catch (error) {
    console.error('Error in getUsers:', error);
    throw handleApiError(error, 'Không thể tải danh sách người dùng');
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await api.get<UserResponse>(`/api/users/${id}`);
    console.log('User detail response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể tải thông tin người dùng');
    }
    if (!response.data.user) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }
    return response.data.user;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw handleApiError(error, 'Không thể tải thông tin người dùng');
  }
};

export const updateUser = async (id: string, data: UpdateProfileData): Promise<User> => {
  try {
    const response = await api.put<UserResponse>(`/api/users/${id}`, data);
    console.log('Update user response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể cập nhật thông tin người dùng');
    }
    if (!response.data.user) {
      throw new Error('Không nhận được thông tin người dùng sau khi cập nhật');
    }
    return response.data.user;
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw handleApiError(error, 'Không thể cập nhật thông tin người dùng');
  }
};

export const deleteUser = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message?: string }>(`/api/users/${id}`);
    console.log('Delete user response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể xóa người dùng');
    }
    return response.data;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw handleApiError(error, 'Không thể xóa người dùng');
  }
};