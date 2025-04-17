import Order from '../models/Order';

export const createOrder = async (userId: string, orderData: any) => {
  try {
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    
    const order = new Order({
      userId,
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'cash',
      note: orderData.note,
      status: 'pending',
      paymentStatus: 'pending'
    });

    console.log('Saving order to database:', JSON.stringify(order, null, 2));
    const savedOrder = await order.save();
    return savedOrder;
  } catch (error) {
    console.error('Error in createOrder service:', error);
    throw error;
  }
}; 