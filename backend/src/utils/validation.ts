export const validateOrder = (data: any): string | null => {
  try {
    // Validate items array
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return 'Đơn hàng phải có ít nhất một sản phẩm';
    }

    // Validate each item
    for (const item of data.items) {
      if (!item.productId || typeof item.productId !== 'string') {
        return 'Mỗi sản phẩm phải có ID hợp lệ';
      }
      if (!item.name || typeof item.name !== 'string') {
        return 'Mỗi sản phẩm phải có tên';
      }
      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        return 'Số lượng sản phẩm phải lớn hơn 0';
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        return 'Giá sản phẩm không hợp lệ';
      }
      // Note is optional
      if (item.note && typeof item.note !== 'string') {
        return 'Ghi chú sản phẩm không hợp lệ';
      }
    }

    // Validate total amount
    if (typeof data.totalAmount !== 'number' || data.totalAmount < 0) {
      return 'Tổng tiền không hợp lệ';
    }

    // Validate payment method
    if (!data.paymentMethod || !['cash', 'momo', 'card'].includes(data.paymentMethod)) {
      return 'Phương thức thanh toán không hợp lệ';
    }

    // Note is optional
    if (data.note && typeof data.note !== 'string') {
      return 'Ghi chú đơn hàng không hợp lệ';
    }

    return null;
  } catch (error) {
    console.error('Validation error:', error);
    return 'Dữ liệu đơn hàng không hợp lệ';
  }
}; 