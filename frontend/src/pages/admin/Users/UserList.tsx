import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import type { User } from '../../../services/userService'
import { getUsers, deleteUser } from '../../../services/userService'

const UserList = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError(error instanceof Error ? error.message : 'Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEditClick = (user: User) => {
    navigate(`/admin/users/${user._id}/edit`)
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return

    try {
      setIsDeleting(true)
      setError(null)
      await deleteUser(selectedUser._id)
      await fetchUsers()
      setSuccess(`Đã xóa người dùng ${selectedUser.fullName} thành công`)
      setDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      setError(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi xóa người dùng')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const handleCloseSuccess = () => {
    setSuccess(null)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Danh sách người dùng
      </Typography>

      {error && (
        <Box mb={2}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      {users.length === 0 ? (
        <Box m={2}>
          <Alert severity="info">Không có người dùng nào</Alert>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>{user.address || '-'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(user)}>
                      <EditIcon />
                    </IconButton>
                    {user.role !== 'admin' && (
                      <IconButton onClick={() => handleDeleteClick(user)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog 
        open={deleteDialogOpen} 
        onClose={!isDeleting ? handleDeleteCancel : undefined}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa người dùng {selectedUser?.fullName}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Hủy
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        message={success}
      />
    </Box>
  )
}

export default UserList