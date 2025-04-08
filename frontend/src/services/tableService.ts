import api from './axiosConfig';
import { config } from '../config';
import { handleApiError } from './errorHandler';
import { Table } from '../types';

export interface TablesResponse {
  success: boolean;
  data: {
    tables: Table[];
  };
  message?: string;
}

export interface TableResponse {
  success: boolean;
  data: {
    table: Table;
  };
  message?: string;
}

export const getTables = async (): Promise<TablesResponse> => {
  try {
    const response = await api.get<TablesResponse>(config.endpoints.tables.list);
    if (!response.data.success) {
      throw new Error('Không thể tải danh sách bàn');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể tải danh sách bàn');
  }
};

export const getTableById = async (id: string): Promise<TableResponse> => {
  try {
    const response = await api.get<TableResponse>(config.endpoints.tables.details(id));
    if (!response.data.success) {
      throw new Error('Không thể tải thông tin bàn');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể tải thông tin bàn');
  }
};

export const createTable = async (data: Omit<Table, '_id'>): Promise<TableResponse> => {
  try {
    const response = await api.post<TableResponse>(config.endpoints.tables.create, data);
    if (!response.data.success) {
      throw new Error('Không thể tạo bàn mới');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể tạo bàn mới');
  }
};

export const updateTable = async (id: string, data: Partial<Table>): Promise<TableResponse> => {
  try {
    const response = await api.put<TableResponse>(config.endpoints.tables.update(id), data);
    if (!response.data.success) {
      throw new Error('Không thể cập nhật thông tin bàn');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể cập nhật thông tin bàn');
  }
};

export const deleteTable = async (id: string): Promise<TableResponse> => {
  try {
    const response = await api.delete<TableResponse>(config.endpoints.tables.delete(id));
    if (!response.data.success) {
      throw new Error('Không thể xóa bàn');
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Không thể xóa bàn');
  }
};

export const resetTables = async (): Promise<void> => {
  try {
    const response = await api.post(config.endpoints.tables.reset);
    if (!response.data.success) {
      throw new Error('Không thể reset bàn');
    }
  } catch (error) {
    throw handleApiError(error, 'Không thể reset bàn');
  }
}; 