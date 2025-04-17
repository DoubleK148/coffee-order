import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useTable } from '@/contexts/TableContext';
import { useAuth } from '@/contexts/AuthContext';
import { TableStatus } from '@/types/table';

interface TableDialogProps {
  open: boolean;
  onClose: () => void;
}

const TableDialog: React.FC<TableDialogProps> = ({ open, onClose }) => {
  const [tableNumber, setTableNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { occupyTable, tables, loading } = useTable();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      setTableNumber('');
      setError('');
    }
  }, [open]);

  // Helper function to check if a table is available
  const isTableAvailable = (number: number) => {
    const table = tables.find(t => t.number === number);
    return table?.status === 'available';
  };

  const handleSubmit = async () => {
    if (!tableNumber || !user) return;

    try {
      setError('');
      const number = parseInt(tableNumber);
      
      // Validate table exists
      const table = tables.find(t => t.number === number);
      if (!table) {
        setError(`Không tìm thấy bàn số ${number}`);
        return;
      }

      // Check if table is available
      if (!isTableAvailable(number)) {
        setError('Bàn này đã có người đặt hoặc đang có khách. Vui lòng chọn bàn khác.');
        return;
      }

      // Create CustomerInfo object
      const customerInfo = {
        name: user.fullName,
        email: user.email,
        phone: user.phone || undefined
      };

      await occupyTable(number, customerInfo);
      localStorage.setItem('hasSelectedTable', 'true');
      onClose();
    } catch (error: any) {
      console.error('Error occupying table:', error);
      setError(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi chọn bàn. Vui lòng thử lại.');
    }
  };

  // Get available table numbers for validation
  const availableTableNumbers = tables
    .filter(t => t.status === 'available')
    .map(t => t.number)
    .sort((a, b) => a - b);

  const minTableNumber = tables.length > 0 ? Math.min(...tables.map(t => t.number)) : 1;
  const maxTableNumber = tables.length > 0 ? Math.max(...tables.map(t => t.number)) : 20;

  const isValidTableNumber = tableNumber !== '' && 
    !isNaN(parseInt(tableNumber)) && 
    availableTableNumbers.includes(parseInt(tableNumber));

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>Chọn bàn của bạn</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Vui lòng nhập số bàn bạn đang ngồi:
          </Typography>
          {availableTableNumbers.length > 0 ? (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Các bàn trống: {availableTableNumbers.join(', ')}
            </Typography>
          ) : (
            <Typography variant="body2" color="error" gutterBottom>
              Hiện tại không có bàn trống
            </Typography>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Số bàn"
            type="number"
            fullWidth
            value={tableNumber}
            onChange={(e) => {
              setTableNumber(e.target.value);
              setError('');
            }}
            inputProps={{ 
              min: minTableNumber,
              max: maxTableNumber
            }}
            error={!!error}
            helperText={error || `Số bàn từ ${minTableNumber} đến ${maxTableNumber}`}
            disabled={availableTableNumbers.length === 0}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!isValidTableNumber || availableTableNumbers.length === 0}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableDialog;