import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { createOrder } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import type { Order as OrderType } from '../../types/order';
import { CartItem } from '../../types/cart';

interface OrderData {
  items: {
    productId: string;
    quantity: number;
    price: number;
    note?: string;
  }[];
  totalAmount: number;
  paymentMethod: string;
}

const Order = () => {
  const { state: cartState, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const orderData: OrderData = {
        items: cartState.items.map((item: CartItem) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          note: item.note
        })),
        totalAmount: cartState.total,
        paymentMethod: 'cash' // Có thể cho người dùng chọn
      };

      await createOrder(orderData as OrderType);
      // Clear cart và chuyển hướng
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Xác nhận đơn hàng
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mb: 3 }}>
          {cartState.items.map((item: CartItem) => (
            <Box key={item.productId} sx={{ mb: 2 }}>
              <Typography>
                {item.name} x {item.quantity} = {(item.price * item.quantity).toLocaleString()}đ
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">
            Tổng tiền: {cartState.total.toLocaleString()}đ
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/cart')}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Xác nhận đặt hàng'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Order;