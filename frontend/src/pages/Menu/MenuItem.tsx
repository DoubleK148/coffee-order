import React, { useState } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  IconButton,
  Box,
  CircularProgress
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-toastify';

// Thêm interface cho product
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  status: string;
}

export const MenuItem: React.FC<{ product: Product }> = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (loading || product.status !== 'available') return;

    setLoading(true);
    try {
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        note: ''
      });
      
      // Toast sẽ được hiển thị từ CartContext
    } catch (error) {
      toast.error('Không thể thêm vào giỏ hàng');
      console.error('Add to cart error:', error);
    } finally {
      setTimeout(() => setLoading(false), 500); // Thêm delay nhỏ để thấy hiệu ứng loading
    }
  };

  return (
    <Card sx={{ 
      position: 'relative',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image || '/default-image.jpg'}
        alt={product.name}
        onError={(e) => {
          console.error(`Failed to load image: ${product.name}`);
          e.currentTarget.src = '/default-image.jpg';
        }}
      />
      <CardContent sx={{ 
        p: 3,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Box>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div"
            sx={{
              color: '#582F0E',
              fontWeight: 600,
              fontSize: '1.2rem',
              mb: 1
            }}
          >
            {product.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{
              color: '#666',
              mb: 2,
              minHeight: '40px'
            }}
          >
            {product.description}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography 
            variant="h6" 
            sx={{
              color: '#936639',
              fontWeight: 700,
              fontSize: '1.3rem'
            }}
          >
            {product.price.toLocaleString('vi-VN')}đ
          </Typography>
          <IconButton 
            onClick={handleAddToCart}
            disabled={loading || product.status !== 'available'}
            sx={{ 
              bgcolor: loading ? 'action.disabledBackground' : '#582F0E',
              color: 'white',
              '&:hover': {
                bgcolor: '#936639',
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <AddShoppingCartIcon />
            )}
          </IconButton>
        </Box>
      </CardContent>

      {product.status !== 'available' && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bgcolor: 'error.main',
            color: 'white',
            px: 2,
            py: 0.5,
            borderBottomLeftRadius: 8
          }}
        >
          Hết hàng
        </Box>
      )}
    </Card>
  );
};

export default MenuItem;