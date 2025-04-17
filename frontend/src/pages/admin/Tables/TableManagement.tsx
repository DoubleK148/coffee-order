import React, { useState, useCallback } from 'react';
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
  ListItem,
  ListItemText,
} from '@mui/material';
import { useTable } from '@/contexts/TableContext';
import { Table, OrderItem, TableOrder } from '@/types/table';
import './TableManagement.css';

const getStatusColor = (status: string): 'error' | 'warning' | 'success' => {
  switch (status) {
    case 'occupied':
      return 'error';
    case 'reserved':
      return 'warning';
    default:
      return 'success';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'occupied':
      return 'Đang sử dụng';
    case 'reserved':
      return 'Đã đặt trước';
    default:
      return 'Trống';
  }
};

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN');
};

const TableCard = React.memo(({ table, onClick }: { table: Table; onClick: (table: Table) => void }) => {
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease'
        }
      }} 
      onClick={() => onClick(table)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div">
            Bàn {table.number}
          </Typography>
          <Chip 
            label={getStatusText(table.status)} 
            color={getStatusColor(table.status)}
            size="small"
          />
        </Box>

        {table.customerInfo && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Thông tin khách hàng:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {table.customerInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {table.customerInfo.email}
            </Typography>
            {table.customerInfo.phone && (
              <Typography variant="body2" color="text.secondary">
                SĐT: {table.customerInfo.phone}
              </Typography>
            )}
          </Box>
        )}

        {table.currentOrder && table.currentOrder.createdAt && (
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Đơn hàng hiện tại:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Số món: {table.currentOrder.items.length}
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="primary">
                {table.currentOrder.totalAmount.toLocaleString('vi-VN')}đ
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Đơn hiện tại: {formatDateTime(table.currentOrder.createdAt)}
            </Typography>
          </Box>
        )}

        {table.orderHistory.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Lịch sử: {table.orderHistory.length} đơn hàng
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

const TableDetailsDialog = ({ 
  open, 
  table, 
  onClose 
}: { 
  open: boolean; 
  table: Table | null; 
  onClose: () => void;
}) => {
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
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h6">
            Bàn {table.number}
          </Typography>
          <Chip 
            label={getStatusText(table.status)} 
            color={getStatusColor(table.status)}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box mb={3}>
          <Typography variant="h6" color="primary" gutterBottom>
            Thông tin khách hàng
          </Typography>
          {table.customerInfo ? (
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography><strong>Tên:</strong> {table.customerInfo.name}</Typography>
              <Typography><strong>Email:</strong> {table.customerInfo.email}</Typography>
              {table.customerInfo.phone && (
                <Typography><strong>SĐT:</strong> {table.customerInfo.phone}</Typography>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary">Chưa có thông tin khách hàng</Typography>
          )}
        </Box>

        <Box mb={3}>
          <Typography variant="h6" color="primary" gutterBottom>
            Đơn hàng hiện tại
          </Typography>
          {table.currentOrder ? (
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">
                  <strong>Thời gian:</strong> {formatDateTime(table.currentOrder.createdAt)}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  <strong>Tổng tiền:</strong> {table.currentOrder.totalAmount.toLocaleString('vi-VN')}đ
                </Typography>
              </Box>
              <Typography variant="subtitle1" gutterBottom><strong>Các món:</strong></Typography>
              {table.currentOrder.items.map((item: OrderItem, index: number) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: index < table.currentOrder!.items.length - 1 ? '1px solid rgba(0,0,0,0.12)' : 'none'
                }}>
                  <Typography>
                    {item.name} x{item.quantity}
                  </Typography>
                  <Typography>
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">Chưa có đơn hàng</Typography>
          )}
        </Box>

        <Box>
          <Typography variant="h6" color="primary" gutterBottom>
            Lịch sử đơn hàng
          </Typography>
          {table.orderHistory.length > 0 ? (
            table.orderHistory.map((order: TableOrder, index: number) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Đơn #${index + 1}`}
                  secondary={`Thời gian: ${formatDateTime(order.createdAt)}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography color="text.secondary">Chưa có lịch sử đơn hàng</Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(0,0,0,0.12)', p: 2 }}>
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

const TableManagement = () => {
  const { tables, loading, error } = useTable();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleTableClick = useCallback((table: Table) => {
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
            key={table._id}
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