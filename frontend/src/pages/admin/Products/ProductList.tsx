import { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { deleteProduct, getAllProducts, Product } from '../../../services/productService'

const ProductList = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const products = await getAllProducts()
      console.log('Fetched products:', products)
      if (!Array.isArray(products)) {
        console.error('Products is not an array:', products)
        setError('Dữ liệu sản phẩm không hợp lệ')
        return
      }
      setProducts(products)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return

    try {
      const response = await deleteProduct(selectedProduct._id)
      if (response.success) {
        setDeleteDialogOpen(false)
        fetchProducts()
      } else {
        setError(response.message || 'Xóa sản phẩm thất bại')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xóa sản phẩm thất bại')
    }
  }

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Danh sách sản phẩm</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/admin/products/add')}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {Array.isArray(products) && products.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Giá KM</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img
                      src={product.image || '/default-image.jpg'}
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${product.name}`);
                        e.currentTarget.src = '/default-image.jpg';
                      }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price.toLocaleString()}đ</TableCell>
                  <TableCell>
                    {product.discountPrice ? `${product.discountPrice.toLocaleString()}đ` : '-'}
                  </TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/admin/products/edit/${product._id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(product)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">Không có sản phẩm nào</Alert>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct?.name}" không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductList