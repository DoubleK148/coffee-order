import { useState, useEffect } from 'react';
import api from '../../../services/axiosConfig';
import { handleError } from '../../../services/errorHandler';
import { config } from '../../../config';

interface Order {
  _id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
  message?: string;
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get<OrdersResponse>(config.endpoints.orders.list);
      if (!response.data.success) {
        throw new Error('Không thể tải danh sách đơn hàng');
      }
      setOrders(response.data.orders);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {orders.map(order => (
        <div key={order._id}>
          <h3>Order ID: {order._id}</h3>
          <p>Total: {order.total}</p>
          <p>Status: {order.status}</p>
          <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;