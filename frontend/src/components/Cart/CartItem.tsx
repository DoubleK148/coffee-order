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
    <Card sx={{ display: 'flex', mb: 2, p: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, objectFit: 'cover' }}
        image={item.image}
        alt={item.name}
      />
      <Box sx={{ display: 'flex', flexGrow: 1, ml: 2, alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{item.name}</Typography>
          <Typography variant="body1" color="text.secondary">
            {item.price.toLocaleString()}đ
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <RemoveIcon />
          </IconButton>
          <Typography>{item.quantity}</Typography>
          <IconButton 
            size="small" 
            onClick={() => onUpdateQuantity(item.quantity + 1)}
          >
            <AddIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={onRemove}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};