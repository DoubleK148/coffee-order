import api from './axiosConfig';
import { config } from '../config';
import { handleApiError } from './errorHandler';
import { Order } from '../types/order';

interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
  message?: string;
}

// Admin order routes
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get<OrdersResponse>(config.endpoints.orders.list);
    if (!response.data.success) {
      throw new Error('Không thể tải danh sách đơn hàng');
    }
    return response.data.orders;
  } catch (error) {
    throw handleApiError(error, 'Không thể tải danh sách đơn hàng');
  }
};

export const getAdminOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await api.get<OrderResponse>(config.endpoints.orders.adminDetails(id));
    if (!response.data.success) {
      throw new Error('Không thể tải thông tin đơn hàng');
    }
    return response.data.order;
  } catch (error) {
    throw handleApiError(error, 'Không thể tải thông tin đơn hàng');
  }
};

// User order routes
export const createOrder = async (data: Partial<Order>): Promise<Order> => {
  try {
    const response = await api.post<OrderResponse>(config.endpoints.orders.create, data);
    if (!response.data.success) {
      throw new Error('Không thể tạo đơn hàng');
    }
    return response.data.order;
  } catch (error) {
    throw handleApiError(error, 'Không thể tạo đơn hàng');
  }
};

export const getMyOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get<OrdersResponse>(config.endpoints.orders.myOrders);
    if (!response.data.success) {
      throw new Error('Không thể tải danh sách đơn hàng');
    }
    return response.data.orders;
  } catch (error) {
    throw handleApiError(error, 'Không thể tải danh sách đơn hàng');
  }
};

export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await api.get<OrderResponse>(config.endpoints.orders.details(id));
    if (!response.data.success) {
      throw new Error('Không thể tải thông tin đơn hàng');
    }
    return response.data.order;
  } catch (error) {
    throw handleApiError(error, 'Không thể tải thông tin đơn hàng');
  }
};

export const updateOrder = async (id: string, data: Partial<Order>): Promise<Order> => {
  try {
    const response = await api.put<OrderResponse>(config.endpoints.orders.update(id), data);
    if (!response.data.success) {
      throw new Error('Không thể cập nhật đơn hàng');
    }
    return response.data.order;
  } catch (error) {
    throw handleApiError(error, 'Không thể cập nhật đơn hàng');
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(config.endpoints.orders.delete(id));
    if (!response.data.success) {
      throw new Error('Không thể xóa đơn hàng');
    }
  } catch (error) {
    throw handleApiError(error, 'Không thể xóa đơn hàng');
  }
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  try {
    const response = await api.put<OrderResponse>(config.endpoints.orders.updateStatus(id), { status });
    if (!response.data.success) {
      throw new Error('Không thể cập nhật trạng thái đơn hàng');
    }
    return response.data.order;
  } catch (error) {
    throw handleApiError(error, 'Không thể cập nhật trạng thái đơn hàng');
  }
}; 