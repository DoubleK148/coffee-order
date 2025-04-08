import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { verifyMomoPayment } from '../../services/momoService';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const orderId = params.get('orderId');
        const resultCode = params.get('resultCode');
        const amount = params.get('amount');

        if (!orderId || !resultCode || !amount) {
          throw new Error('Thiếu thông tin thanh toán');
        }

        const response = await verifyMomoPayment(orderId, resultCode, Number(amount));
        setSuccess(response);
      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err instanceof Error ? err.message : 'Không thể xác thực thanh toán');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <CircularProgress />
          <Typography>Đang xác thực thanh toán...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        {error ? (
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        ) : success ? (
          <>
            <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h5" align="center">
              Thanh toán thành công!
            </Typography>
            <Typography align="center" color="text.secondary">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ được xử lý ngay.
            </Typography>
          </>
        ) : (
          <>
            <ErrorIcon color="error" sx={{ fontSize: 60 }} />
            <Typography variant="h5" align="center">
              Thanh toán thất bại
            </Typography>
            <Typography align="center" color="text.secondary">
              Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.
            </Typography>
          </>
        )}

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/orders')}
          >
            Xem đơn hàng
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/menu')}
          >
            Tiếp tục mua hàng
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentResult; 