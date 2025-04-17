import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import { getOrderById } from '../../services/orderService';
import { Order } from '../../types/order';
import { CheckCircle } from '@mui/icons-material';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = location.state?.orderId;
        if (!orderId) {
          setError('Không tìm thấy thông tin đơn hàng');
          return;
        }

        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        setError('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.state]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Về trang chủ
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Đặt hàng thành công!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Mã đơn hàng: {order?._id}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Chi tiết đơn hàng
          </Typography>
          {order?.items.map((item) => (
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
          <Typography variant="h6" sx={{ mt: 2 }}>
            Tổng tiền: {order?.totalAmount.toLocaleString()}đ
          </Typography>
          <Typography>
            Phương thức thanh toán: {order?.paymentMethod === 'cash' ? 'Tiền mặt' : 
                                   order?.paymentMethod === 'momo' ? 'Momo' : 'Thẻ'}
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Về trang chủ
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/orders')}
          >
            Xem đơn hàng của tôi
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderSuccess; 