import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useTable } from '@/contexts/TableContext';
import { useNavigate } from 'react-router-dom';
import { TableOrder } from '@/types/table';

interface ReturnTableDialogProps {
  open: boolean;
  onClose: () => void;
}

const ReturnTableDialog: React.FC<ReturnTableDialogProps> = ({ open, onClose }) => {
  const { getCurrentUserTable, freeTable } = useTable();
  const navigate = useNavigate();
  const currentTable = getCurrentUserTable();

  const handleReturnTable = async () => {
    try {
      if (currentTable) {
        await freeTable(currentTable.number);
        localStorage.removeItem('hasSelectedTable');
        onClose();
        navigate('/');
      }
    } catch (error) {
      console.error('Error returning table:', error);
      alert('Có lỗi xảy ra khi trả bàn. Vui lòng thử lại.');
    }
  };

  if (!currentTable) {
    return null;
  }

  const calculateTotalAmount = (order: TableOrder) => {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const allOrders = [
    ...(currentTable.currentOrder ? [currentTable.currentOrder] : []),
    ...currentTable.orderHistory
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận trả bàn</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Bạn có chắc chắn muốn trả bàn số {currentTable.number}?
          </Typography>
          {allOrders.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                Tóm tắt đơn hàng:
              </Typography>
              {allOrders.map((order, orderIndex) => (
                <Box key={orderIndex} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Đơn hàng #{orderIndex + 1}
                  </Typography>
                  {order.items.map((item, itemIndex) => (
                    <Typography key={itemIndex} variant="body2">
                      {item.name} x {item.quantity} = {(item.price * item.quantity).toLocaleString()}đ
                    </Typography>
                  ))}
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    Tổng cộng: {calculateTotalAmount(order).toLocaleString()}đ
                  </Typography>
                  {order.createdAt && (
                    <Typography variant="body2" color="text.secondary">
                      Thời gian: {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              ))}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={handleReturnTable} variant="contained" color="primary">
          Xác nhận trả bàn
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnTableDialog; 