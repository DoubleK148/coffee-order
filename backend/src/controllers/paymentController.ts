import { Request, Response } from 'express';
import crypto from 'crypto';
import Order from '../models/Order';

// Lấy thông tin cấu hình MoMo từ biến môi trường
const {
  MOMO_PARTNER_CODE,
  MOMO_ACCESS_KEY,
  MOMO_SECRET_KEY,
  MOMO_ENDPOINT,
  FRONTEND_URL,
  API_URL
} = process.env;

export const createMomoPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body;

    const requestId = `${Date.now()}_${orderId}`;
    const orderInfo = `Thanh toan don hang #${orderId}`;
    const redirectUrl = `${FRONTEND_URL}/payment/result`;
    const ipnUrl = `${API_URL}/api/payment/momo/notify`;
    const requestType = 'captureWallet';
    const extraData = '';

    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', MOMO_SECRET_KEY || '')
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: MOMO_PARTNER_CODE,
      accessKey: MOMO_ACCESS_KEY,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      requestType: requestType,
      extraData: extraData,
      lang: 'vi',
      signature: signature
    };

    const response = await fetch(MOMO_ENDPOINT || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    console.log('MoMo response:', responseData);

    if (responseData.payUrl) {
      // Cập nhật order với requestId của MoMo
      await Order.findByIdAndUpdate(orderId, {
        'paymentDetails.requestId': requestId
      });

      res.json({
        payUrl: responseData.payUrl,
        orderId: orderId,
        message: 'Tạo link thanh toán thành công',
        status: 1
      });
    } else {
      throw new Error(responseData.message || 'Không thể tạo link thanh toán');
    }
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    res.status(500).json({
      message: 'Không thể tạo thanh toán MoMo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const handleMomoIPN = async (req: Request, res: Response) => {
  try {
    const { 
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;

    console.log('Received MoMo IPN:', req.body);

    // Verify signature
    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const checkSignature = crypto
      .createHmac('sha256', MOMO_SECRET_KEY || '')
      .update(rawSignature)
      .digest('hex');

    if (checkSignature !== signature) {
      console.error('Invalid MoMo signature');
      return res.status(400).json({
        message: 'Invalid signature',
        status: 1
      });
    }

    // Kiểm tra và cập nhật trạng thái đơn hàng
    const order = await Order.findById(orderId);
    if (!order) {
      console.error('Order not found:', orderId);
      return res.status(404).json({
        message: 'Order not found',
        status: 1
      });
    }

    if (resultCode === '0') {
      // Thanh toán thành công
      await Order.findByIdAndUpdate(orderId, {
        status: 'paid',
        paymentStatus: 'completed',
        'paymentDetails.transId': transId,
        'paymentDetails.payType': payType,
        'paymentDetails.responseTime': responseTime,
        'paymentDetails.message': message,
        'paymentDetails.resultCode': resultCode
      });

      res.json({
        message: 'Success',
        status: 0
      });
    } else {
      // Thanh toán thất bại
      await Order.findByIdAndUpdate(orderId, {
        status: 'payment_failed',
        paymentStatus: 'failed',
        'paymentDetails.resultCode': resultCode,
        'paymentDetails.message': message
      });

      res.json({
        message: 'Failed',
        status: 1
      });
    }
  } catch (error) {
    console.error('Error handling MoMo IPN:', error);
    res.status(500).json({
      message: 'Internal server error',
      status: 1
    });
  }
};

export const verifyMomoPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, resultCode, amount } = req.body;
    console.log('Verifying MoMo payment:', { orderId, resultCode, amount });

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (resultCode === '0') {
      // Thanh toán thành công
      await Order.findByIdAndUpdate(orderId, {
        status: 'paid',
        paymentStatus: 'completed'
      });

      res.json({
        success: true,
        message: 'Thanh toán thành công'
      });
    } else {
      // Thanh toán thất bại
      await Order.findByIdAndUpdate(orderId, {
        status: 'payment_failed',
        paymentStatus: 'failed'
      });

      res.json({
        success: false,
        message: 'Thanh toán thất bại'
      });
    }
  } catch (error) {
    console.error('Error verifying MoMo payment:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể xác thực thanh toán',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 