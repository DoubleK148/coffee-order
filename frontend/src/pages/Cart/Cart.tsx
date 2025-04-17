import { useState } from 'react';
import { Box, Typography, Button, Container, Divider, Paper } from '@mui/material';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from '../../components/Cart/CartItem';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { state: cartState, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity < 1) return;
      updateQuantity(productId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <Box sx={{ mt: '64px' }}>
        <Container maxWidth="md" sx={{ 
          py: 8,
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography variant="h5" gutterBottom>
            Giỏ hàng trống
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/menu')}
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              borderRadius: '8px'
            }}
          >
            Xem Menu
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: '64px' }}>
      <Container maxWidth="md" sx={{ 
        py: 8,
        minHeight: 'calc(100vh - 64px)'
      }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            mb: 4,
            fontWeight: 'bold'
          }}
        >
          Giỏ hàng
        </Typography>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3,
            mb: 4,
            borderRadius: '12px',
            backgroundColor: 'background.default'
          }}
        >
          <Box sx={{ mb: 3 }}>
            {cartState.items.map((item) => (
              <CartItem
                key={item.productId}
                item={{
                  ...item,
                  image: item.image || ''
                }}
                onUpdateQuantity={(quantity: number) => handleUpdateQuantity(item.productId, quantity)}
                onRemove={() => removeFromCart(item.productId)}
              />
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography 
              variant="h5"
              sx={{ fontWeight: 'bold' }}
            >
              Tổng cộng:
            </Typography>
            <Typography 
              variant="h5" 
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              {cartState.total.toLocaleString()}đ
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2 
          }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/menu')}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: '8px'
              }}
            >
              Tiếp tục mua hàng
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/checkout')}
              disabled={cartState.items.length === 0}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '8px'
              }}
            >
              Thanh toán
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Cart;