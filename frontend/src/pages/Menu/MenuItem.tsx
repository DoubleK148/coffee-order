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
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// Thêm interface cho product
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  status: string;
  isBestSeller?: boolean;
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
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'transform 0.3s ease-in-out',
      borderRadius: 2,
      bgcolor: 'white',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}>
      <Box sx={{ 
        position: 'relative', 
        pt: '120%',
        overflow: 'hidden'
      }}>
        <CardMedia
          component="img"
          image={product.image || '/default-image.jpg'}
          alt={product.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%'
          }}
          onError={(e) => {
            console.error(`Failed to load image: ${product.name}`);
            e.currentTarget.src = '/default-image.jpg';
          }}
        />
        {product.isBestSeller && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#FF6B6B',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '0.875rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              animation: 'pulse 2s infinite ease-in-out',
              zIndex: 1
            }}
          >
            <LocalFireDepartmentIcon sx={{ fontSize: '1rem' }} />
            Best Seller
          </Box>
        )}
      </Box>
      <CardContent sx={{ 
        p: 2,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Box>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div"
            sx={{
              color: '#582F0E',
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.4,
              height: '2.8em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1
            }}
          >
            {product.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{
              color: '#666',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              height: '3em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {product.description}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 1.5,
          mt: 'auto',
          borderTop: '1px solid rgba(0,0,0,0.08)'
        }}>
          <Typography 
            variant="h6" 
            sx={{
              color: '#936639',
              fontWeight: 700,
              fontSize: '1.1rem'
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
              transition: 'all 0.3s ease',
              width: 36,
              height: 36,
              minWidth: 36
            }}
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <AddShoppingCartIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </CardContent>

      {product.status !== 'available' && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'error.main',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 500,
            boxShadow: 2,
            zIndex: 1
          }}
        >
          Hết hàng
        </Box>
      )}
    </Card>
  );
};

export default MenuItem;