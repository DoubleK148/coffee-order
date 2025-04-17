import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { createOrder, CreateOrderData } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CartItem } from '../../types/cart';
import { toast } from 'react-toastify';

const Order = () => {
  const { state: cartState, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      if (cartState.items.length === 0) {
        setError('Giỏ hàng trống');
        return;
      }

      setLoading(true);

      // Log cart state để kiểm tra
      console.log('Cart state before creating order:', {
        items: cartState.items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: cartState.total
      });

      // Thêm trường name vào dữ liệu đơn hàng
      const orderData: CreateOrderData = {
        items: cartState.items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartState.total,
        paymentMethod
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      const order = await createOrder(orderData);
      
      clearCart();
      toast.success('Đặt hàng thành công!');
      navigate('/order-success', { state: { orderId: order._id } });
    } catch (err) {
      console.error('Order error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể tạo đơn hàng';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Giỏ hàng trống
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/menu')}
          >
            Xem Menu
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Xác nhận đơn hàng
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          {cartState.items.map((item) => (
            <Box key={item.productId} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="h6">
                {item.name}
              </Typography>
              <Typography>
                Số lượng: {item.quantity}
              </Typography>
              <Typography>
                Giá: {(item.price * item.quantity).toLocaleString()}đ
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">
            Tổng tiền: {cartState.total.toLocaleString()}đ
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Phương thức thanh toán</InputLabel>
            <Select
              value={paymentMethod}
              label="Phương thức thanh toán"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="cash">Tiền mặt</MenuItem>
              <MenuItem value="momo">Momo</MenuItem>
              <MenuItem value="card">Thẻ</MenuItem>
            </Select>
          </FormControl>
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
            {loading ? <CircularProgress size={24} /> : 'Đặt hàng'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Order;