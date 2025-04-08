import { useState } from 'react';
import { Box, Typography, Button, Container, Divider } from '@mui/material';
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
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Giỏ hàng trống
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/menu')}
        >
          Xem Menu
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Giỏ hàng
      </Typography>
      
      <Box sx={{ mb: 4 }}>
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

      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Tổng cộng:</Typography>
        <Typography variant="h6">{cartState.total.toLocaleString()}đ</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/menu')}
        >
          Tiếp tục mua hàng
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/checkout')}
          disabled={cartState.items.length === 0}
        >
          Thanh toán
        </Button>
      </Box>
    </Container>
  );
};

export default Cart;