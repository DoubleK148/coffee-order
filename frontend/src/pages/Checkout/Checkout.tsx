import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useCart } from '../../contexts/CartContext';
import { createOrder } from '../../services/orderService';
import { createMomoPayment, verifyMomoPayment } from '../../services/momoService';
import { useNavigate, useLocation } from 'react-router-dom';
import { Order } from '../../types/order';

const Checkout = () => {
  const { state: cartState, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [note, setNote] = useState('');
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [openDialog, setOpenDialog] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');

  useEffect(() => {
    if (!user?._id) {
      navigate('/login', { state: { from: '/checkout' } });
    }

    // Xử lý callback từ MoMo
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');
    const resultCode = searchParams.get('resultCode');
    const amount = searchParams.get('amount');

    if (orderId && resultCode && amount) {
      handleMomoCallback(orderId, resultCode, Number(amount));
    }
  }, [user, navigate, location]);

  const handleMomoCallback = async (orderId: string, resultCode: string, amount: number) => {
    try {
      setLoading(true);
      const success = await verifyMomoPayment(orderId, resultCode, amount);
      
      if (success) {
        clearCart();
        navigate('/order-success', { 
          state: { 
            orderId: orderId,
            paymentMethod: 'momo'
          } 
        });
      } else {
        setError('Thanh toán MoMo thất bại');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xác thực thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartState.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          note: item.note
        })),
        totalAmount: cartState.total,
        paymentMethod,
        note,
        status: 'pending'
      };

      const response = await createOrder(orderData as unknown as Order);
      
      if (response && response._id) {
        setCurrentOrderId(response._id);

        if (paymentMethod === 'momo') {
          const momoResponse = await createMomoPayment(response._id, cartState.total);
          if (momoResponse.payUrl) {
            window.location.href = momoResponse.payUrl;
            return;
          } else {
            throw new Error('Không thể tạo link thanh toán MoMo');
          }
        } else {
          clearCart();
          navigate('/order-success', { 
            state: { 
              orderId: response._id,
              paymentMethod: 'cash'
            } 
          });
        }
      } else {
        throw new Error('Không thể tạo đơn hàng');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (cartState.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Xác nhận đơn hàng
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Đơn hàng của bạn
          </Typography>
          {cartState.items.map((item) => (
            <Box 
              key={item.productId} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 1 
              }}
            >
              <Typography>
                {item.name} x {item.quantity}
              </Typography>
              <Typography>
                {(item.price * item.quantity).toLocaleString()}đ
              </Typography>
            </Box>
          ))}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mt: 2,
            borderTop: 1,
            borderColor: 'divider',
            pt: 1
          }}>
            <Typography variant="h6">Tổng cộng:</Typography>
            <Typography variant="h6">
              {cartState.total.toLocaleString()}đ
            </Typography>
          </Box>
        </Box>

        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel>Phương thức thanh toán</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel 
              value="cash" 
              control={<Radio />} 
              label="Tiền mặt" 
            />
            <FormControlLabel 
              value="momo" 
              control={<Radio />} 
              label="MoMo" 
            />
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Ghi chú"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/cart')}
          >
            Quay lại
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Đặt hàng'}
          </Button>
        </Box>
      </Box>

      <Dialog open={openDialog}>
        <DialogTitle>Đang xử lý thanh toán</DialogTitle>
        <DialogContent>
          <CircularProgress />
          <Typography>
            Vui lòng không đóng cửa sổ này...
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default Checkout;