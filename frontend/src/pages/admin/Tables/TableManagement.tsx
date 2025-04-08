import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { getTables } from '../../../services/tableService';
import { Table } from '../../../types';

const TableManagement = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await getTables();
      if (response.success) {
        setTables(response.data.tables);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4caf50';
      case 'occupied':
        return '#f44336';
      case 'reserved':
        return '#ff9800';
      default:
        return '#grey';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Trống';
      case 'occupied':
        return 'Đang sử dụng';
      case 'reserved':
        return 'Đã đặt trước';
      default:
        return status;
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setOpenDialog(true);
  };

  const handleStatusChange = (tableId: string, newStatus: 'available' | 'occupied' | 'reserved') => {
    setTables(tables.map(table => 
      table._id === tableId 
        ? { 
            ...table, 
            status: newStatus,
            isAvailable: newStatus === 'available'
          }
        : table
    ));
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Quản lý bàn</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Thêm bàn mới
        </Button>
      </Box>

      <Grid container spacing={2}>
        {tables.map(table => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={table._id}>
            <Paper
              sx={{
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                },
                border: '1px solid',
                borderColor: getStatusColor(table.status)
              }}
              onClick={() => handleTableClick(table)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">Bàn {table.tableNumber}</Typography>
                <Chip
                  label={getStatusText(table.status)}
                  sx={{ bgcolor: getStatusColor(table.status), color: 'white' }}
                  size="small"
                />
              </Box>
              <Typography variant="body2">
                Sức chứa: {table.capacity} người
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Dialog hiển thị chi tiết bàn */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedTable && (
          <>
            <DialogTitle>
              Quản lý Bàn {selectedTable.tableNumber}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle1" gutterBottom>
                Trạng thái hiện tại: {getStatusText(selectedTable.status)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Sức chứa: {selectedTable.capacity} người
              </Typography>
            </DialogContent>
            <DialogActions>
              {selectedTable.status !== 'available' && (
                <Button
                  onClick={() => handleStatusChange(selectedTable._id, 'available')}
                  color="primary"
                >
                  Đánh dấu trống
                </Button>
              )}
              {selectedTable.status !== 'occupied' && (
                <Button
                  onClick={() => handleStatusChange(selectedTable._id, 'occupied')}
                  color="error"
                >
                  Đánh dấu đang sử dụng
                </Button>
              )}
              {selectedTable.status !== 'reserved' && (
                <Button
                  onClick={() => handleStatusChange(selectedTable._id, 'reserved')}
                  color="warning"
                >
                  Đánh dấu đặt trước
                </Button>
              )}
              <Button onClick={() => setOpenDialog(false)}>
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TableManagement;