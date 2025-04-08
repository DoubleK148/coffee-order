import api from './axiosConfig';
import { config } from '../config';

export interface MomoPaymentResponse {
  payUrl: string;
  orderId: string;
  message: string;
  status: number;
}

export const createMomoPayment = async (orderId: string, amount: number): Promise<MomoPaymentResponse> => {
  try {
    const response = await api.post(`${config.endpoints.payment.momo}`, {
      orderId,
      amount
    });

    if (!response.data.payUrl) {
      throw new Error('Không thể tạo link thanh toán MoMo');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    throw new Error('Không thể tạo thanh toán MoMo');
  }
};

export const verifyMomoPayment = async (
  orderId: string, 
  resultCode: string, 
  amount: number
): Promise<boolean> => {
  try {
    const response = await api.post(`${config.endpoints.payment.momoVerify}`, {
      orderId,
      resultCode,
      amount
    });
    
    return response.data.success;
  } catch (error) {
    console.error('Error verifying MoMo payment:', error);
    throw new Error('Không thể xác thực thanh toán MoMo');
  }
}; 