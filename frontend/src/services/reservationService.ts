import api from './axiosConfig';
import { handleApiError } from './errorHandler';
import { config } from '../config';
import { ReservationData } from '../types';

export interface Reservation extends Omit<ReservationData, 'status'> {
  _id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ReservationsResponse {
  success: boolean;
  data: {
    reservations: Reservation[];
  };
  message?: string;
}

export interface ReservationResponse {
  success: boolean;
  data: {
    reservation: Reservation;
  };
  message?: string;
}

// User routes (cần đăng nhập)
export const createReservation = async (data: Omit<ReservationData, 'userId'>): Promise<ReservationResponse> => {
  try {
    const response = await api.post<ReservationResponse>(config.endpoints.reservations.create, data);
    if (!response.data.success) {
      throw new Error('Không thể tạo đặt bàn');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể tạo đặt bàn');
  }
};

export const getMyReservations = async (): Promise<ReservationResponse> => {
  try {
    const response = await api.get<ReservationResponse>(config.endpoints.reservations.myReservations);
    if (!response.data.success) {
      throw new Error('Không thể tải danh sách đặt bàn');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể tải danh sách đặt bàn');
  }
};

export const getReservationById = async (id: string): Promise<ReservationResponse> => {
  try {
    const response = await api.get<ReservationResponse>(config.endpoints.reservations.details(id));
    if (!response.data.success) {
      throw new Error('Không thể tải thông tin đặt bàn');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể tải thông tin đặt bàn');
  }
};

// Admin routes (chỉ admin)
export const getAllReservations = async (): Promise<ReservationsResponse> => {
  try {
    console.log('Calling getAllReservations API...');
    const response = await api.get<ReservationsResponse>(config.endpoints.reservations.list);
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    if (!response.data.success) {
      console.error('API returned failure:', response.data);
      throw new Error(response.data.message || 'Không thể tải danh sách đặt bàn');
    }
    return response.data;
  } catch (error) {
    console.error('Error in getAllReservations:', {
      error,
      config: api.defaults,
      endpoint: config.endpoints.reservations.list
    });
    throw handleApiError(error, 'Không thể tải danh sách đặt bàn');
  }
};

export const getAdminReservationById = async (id: string): Promise<ReservationResponse> => {
  try {
    const response = await api.get<ReservationResponse>(config.endpoints.reservations.adminDetails(id));
    if (!response.data.success) {
      throw new Error('Không thể tải thông tin đặt bàn');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể tải thông tin đặt bàn');
  }
};

export const updateReservation = async (id: string, data: Partial<ReservationData>): Promise<ReservationResponse> => {
  try {
    const response = await api.put<ReservationResponse>(config.endpoints.reservations.update(id), data);
    if (!response.data.success) {
      throw new Error('Không thể cập nhật đặt bàn');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể cập nhật đặt bàn');
  }
};

export const deleteReservation = async (id: string): Promise<ReservationResponse> => {
  try {
    const response = await api.delete<ReservationResponse>(config.endpoints.reservations.delete(id));
    if (!response.data.success) {
      throw new Error('Không thể xóa đặt bàn');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể xóa đặt bàn');
  }
};