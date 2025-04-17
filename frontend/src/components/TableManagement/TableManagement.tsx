import React, { useState, useCallback, memo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTable } from '@/contexts/TableContext';
import { Table, OrderItem, TableOrder, CustomerInfo, TableStatus } from '@/types/table';

// Helper functions
const getStatusColor = (status: TableStatus): 'error' | 'warning' | 'success' => {
  switch (status) {
    case 'occupied':
      return 'error';
    case 'reserved':
      return 'warning';
    default:
      return 'success';
  }
};

const getStatusText = (status: TableStatus): string => {
  switch (status) {
    case 'occupied':
      return 'Đang sử dụng';
    case 'reserved':
      return 'Đã đặt trước';
    default:
      return 'Trống';
  }
};

interface TableCardProps {
  table: Table;
  onClick: (table: Table) => void;
}

const TableCard = memo<TableCardProps>(({ table, onClick }) => {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }} 
      onClick={() => onClick(table)}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Bàn {table.number}
        </Typography>
        <Chip 
          label={getStatusText(table.status)} 
          color={getStatusColor(table.status)}
          sx={{ mb: 1 }}
        />
        {table.customerInfo && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              Khách hàng: {table.customerInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {table.customerInfo.email}
            </Typography>
            {table.customerInfo.phone && (
              <Typography variant="body2" color="text.secondary">
                SĐT: {table.customerInfo.phone}
              </Typography>
            )}
          </Box>
        )}
        {table.currentOrder && (
          <Box mt={1}>
            <Typography variant="body2" color="text.secondary">
              Tổng tiền: {table.currentOrder.totalAmount.toLocaleString('vi-VN')}đ
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

interface TableDetailsDialogProps {
  open: boolean;
  table: Table | null;
  onClose: () => void;
}

const TableDetailsDialog: React.FC<TableDetailsDialogProps> = ({ open, table, onClose }) => {
  const { freeTable } = useTable();
  const [loading, setLoading] = useState(false);

  const handleFreeTable = async () => {
    if (!table) return;
    setLoading(true);
    try {
      await freeTable(table.number);
      onClose();
    } catch (error) {
      console.error('Error freeing table:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!table) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chi tiết bàn {table.number}</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="h6">Thông tin khách hàng</Typography>
          {table.customerInfo ? (
            <>
              {table.customerInfo.name && (
                <Typography>
                  Tên khách hàng: {table.customerInfo.name}
                </Typography>
              )}
              {table.customerInfo.phone && (
                <Typography>
                  Số điện thoại: {table.customerInfo.phone}
                </Typography>
              )}
            </>
          ) : (
            <Typography color="text.secondary">Chưa có thông tin khách hàng</Typography>
          )}
        </Box>

        <Box mb={2}>
          <Typography variant="h6">Đơn hàng hiện tại</Typography>
          {table.currentOrder ? (
            <>
              <Typography variant="h6" gutterBottom>
                Đơn hàng hiện tại
              </Typography>
              {table.currentOrder.items && table.currentOrder.items.length > 0 ? (
                <>
                  {table.currentOrder.items.map((item, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography>
                        {item.name} - {item.quantity} x {item.price.toLocaleString('vi-VN')}đ
                      </Typography>
                    </Box>
                  ))}
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Tổng tiền: {table.currentOrder.totalAmount?.toLocaleString('vi-VN')}đ
                  </Typography>
                </>
              ) : (
                <Typography color="text.secondary">Chưa có món ăn nào được đặt</Typography>
              )}
            </>
          ) : (
            <Typography color="text.secondary">Chưa có đơn hàng</Typography>
          )}
        </Box>

        <Box>
          <Typography variant="h6">Lịch sử đơn hàng</Typography>
          {table.orderHistory.length > 0 ? (
            table.orderHistory.map((order: TableOrder, index: number) => (
              <Box key={index} mb={2}>
                <Typography>
                  Đơn hàng #{index + 1} - {order.totalAmount.toLocaleString('vi-VN')}đ
                </Typography>
                <Typography variant="subtitle2">Các món:</Typography>
                {order.items.map((item: OrderItem, itemIndex: number) => (
                  <Typography key={itemIndex}>
                    {item.name} x{item.quantity} - {item.price.toLocaleString('vi-VN')}đ
                  </Typography>
                ))}
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">Chưa có lịch sử đơn hàng</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
        {(table.status === 'occupied' || table.status === 'reserved') && (
          <Button 
            onClick={handleFreeTable} 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Trả bàn'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export const TableManagement: React.FC = () => {
  const { tables, loading, error, freeTable } = useTable();
  const [selectedTable, setSelectedTable] = useState<TableCardProps['table'] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleTableClick = useCallback((table: TableCardProps['table']) => {
    setSelectedTable(table);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedTable(null);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý bàn
      </Typography>
      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            key={`table-${table.number}-${table._id}`}
          >
            <TableCard table={table} onClick={handleTableClick} />
          </Grid>
        ))}
      </Grid>

      <TableDetailsDialog
        open={dialogOpen}
        table={selectedTable}
        onClose={handleCloseDialog}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TableManagement;