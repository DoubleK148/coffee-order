import { useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    localStorage.removeItem('selectedTable');
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
      
      <Typography variant="h4" gutterBottom>
        Đặt hàng thành công!
      </Typography>
      
      {orderId && (
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Mã đơn hàng: {orderId}
        </Typography>
      )}
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/menu')}
        >
          Tiếp tục mua hàng
        </Button>
        <Button 
          variant="contained" 
          onClick={() => navigate('/profile')}
        >
          Xem đơn hàng
        </Button>
      </Box>
    </Container>
  );
};

export default OrderSuccess; 