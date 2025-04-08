/* eslint-disable @typescript-eslint/no-unused-vars */
import api from './axiosConfig';
import { handleApiError } from './errorHandler';

export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  discountPrice?: number;
  status: 'available' | 'unavailable' | 'coming_soon';
  ingredients: string[];
  preparationTime?: number;
  calories?: number;
  isBestSeller: boolean;
}

export interface ProductResponse {
  success: boolean;
  product?: Product;
  data?: {
    product: Product;
  };
  message?: string;
}

export interface ProductsResponse {
  success: boolean;
  products?: Product[];
  data?: {
    products: Product[];
  };
  message?: string;
}

// Public product routes
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ProductsResponse>('/api/products');
    console.log('Products response:', response.data);
    
    // Check if response has products directly
    if (response.data.products) {
      return response.data.products;
    }
    
    // Check if response has nested data structure
    if (response.data.data?.products) {
      return response.data.data.products;
    }

    // If no products found, return empty array
    console.warn('No products found in response:', response.data);
    return [];
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw handleApiError(error, 'Không thể tải danh sách sản phẩm');
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<ProductResponse>(`/api/products/${id}`);
    console.log('Product detail response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể tải thông tin sản phẩm');
    }
    if (!response.data.data?.product) {
      throw new Error('Không tìm thấy thông tin sản phẩm');
    }
    return response.data.data.product;
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw handleApiError(error, 'Không thể tải thông tin sản phẩm');
  }
};

// Admin product routes
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ProductsResponse>('/api/admin/products');
    console.log('Admin products response:', response.data);
    
    // Check if response has products directly
    if (response.data.products) {
      return response.data.products;
    }
    
    // Check if response has nested data structure
    if (response.data.data?.products) {
      return response.data.data.products;
    }

    // If no products found, return empty array
    console.warn('No products found in response:', response.data);
    return [];
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw handleApiError(error, 'Không thể tải danh sách sản phẩm');
  }
};

export const getAdminProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<ProductResponse>(`/api/admin/products/${id}`);
    console.log('Admin product detail response:', response.data);
    
    // Check if product exists directly in response
    if (response.data.product) {
      return response.data.product;
    }
    
    // Check if product exists in nested data structure
    if (response.data.data?.product) {
      return response.data.data.product;
    }
    
    throw new Error('Không tìm thấy thông tin sản phẩm');
  } catch (error) {
    console.error('Error in getAdminProductById:', error);
    throw handleApiError(error, 'Không thể tải thông tin sản phẩm');
  }
};

export const createProduct = async (data: FormData): Promise<Product> => {
  try {
    console.log('Creating product with FormData...');
    // Log FormData entries for debugging
    for (const [key, value] of data.entries()) {
      console.log(`FormData field - ${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }

    const response = await api.post<ProductResponse>('/api/admin/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Create product response:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể tạo sản phẩm');
    }
    
    const product = response.data.data?.product || response.data.product;
    if (!product) {
      throw new Error('Không nhận được thông tin sản phẩm sau khi tạo');
    }
    
    return product;
  } catch (error) {
    console.error('Error in createProduct:', error);
    if (error instanceof Error) {
      throw new Error(`Không thể tạo sản phẩm: ${error.message}`);
    }
    throw new Error('Không thể tạo sản phẩm');
  }
};

export const updateProduct = async (id: string, data: FormData): Promise<Product> => {
  try {
    // Log FormData entries for debugging
    console.log('Updating product with FormData:');
    for (const [key, value] of data.entries()) {
      console.log(`FormData field - ${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }

    const response = await api.put<ProductResponse>(`/api/admin/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Update product response:', response.data);
    
    // Check if product exists directly in response
    if (response.data.product) {
      return response.data.product;
    }
    
    // Check if product exists in nested data structure
    if (response.data.data?.product) {
      return response.data.data.product;
    }
    
    throw new Error('Không nhận được thông tin sản phẩm sau khi cập nhật');
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw handleApiError(error, 'Không thể cập nhật sản phẩm');
  }
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log('Deleting product:', id);
    const response = await api.delete<{ success: boolean; message?: string }>(`/api/admin/products/${id}`);
    console.log('Delete product response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể xóa sản phẩm');
    }
    return response.data;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw handleApiError(error, 'Không thể xóa sản phẩm');
  }
}; 