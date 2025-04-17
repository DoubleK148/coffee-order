import React from 'react';
import { Box, Typography, IconButton, Card, CardMedia } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

interface CartItemProps {
  item: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <Card sx={{ 
      display: 'flex', 
      mb: 2, 
      p: 2, 
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <CardMedia
        component="img"
        sx={{ 
          width: 100, 
          height: 100, 
          objectFit: 'cover',
          borderRadius: '8px'
        }}
        image={item.image}
        alt={item.name}
      />
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        ml: 2,
        justifyContent: 'space-between',
        alignItems: 'center' 
      }}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>{item.name}</Typography>
          <Typography 
            variant="body1" 
            color="primary" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            {item.price.toLocaleString()}đ
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            border: '1px solid rgba(0,0,0,0.12)', 
            borderRadius: '20px',
            px: 1
          }}>
            <IconButton 
              size="small" 
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
              sx={{ color: 'primary.main' }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ 
              mx: 2,
              minWidth: '20px',
              textAlign: 'center'
            }}>
              {item.quantity}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              sx={{ color: 'primary.main' }}
            >
              <AddIcon />
            </IconButton>
          </Box>
          
          <IconButton 
            color="error"
            onClick={onRemove}
            sx={{ 
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.04)'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};