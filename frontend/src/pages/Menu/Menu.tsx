import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Button,
  TextField,
  InputAdornment
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SearchIcon from '@mui/icons-material/Search'
import './Menu.css'
import { getProducts } from '../../services/productService'
import { useNavigate } from 'react-router-dom'
import { MenuItem } from './MenuItem'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  discountPrice?: number
  status: 'available' | 'unavailable' | 'coming_soon'
  isBestSeller: boolean
  ingredients?: string[]
  preparationTime?: number
  calories?: number
}

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả')
  const [products, setProducts] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const categories = [
    'Tất cả',
    'Cà phê',
    'Trà/Trà sữa',
    'Thức uống khác'
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      console.log('Fetched products:', data)
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        console.error('Invalid products data:', data)
        throw new Error('Dữ liệu sản phẩm không hợp lệ')
      }
    } catch (err) {
      console.error('Error in Menu:', err)
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const mapCategory = (dbCategory: string): string => {
    switch (dbCategory) {
      case 'coffee': return 'Cà phê'
      case 'tea': return 'Trà/Trà sữa'
      default: return 'Thức uống khác'
    }
  }

  const filterAndSortItems = (items: MenuItem[]) => {
    let filteredItems = items
    
    if (selectedCategory !== 'Tất cả') {
      filteredItems = items.filter(item => 
        mapCategory(item.category) === selectedCategory
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
    }

    return filteredItems.sort((a, b) => {
      if (a.isBestSeller && !b.isBestSeller) return -1
      if (!a.isBestSeller && b.isBestSeller) return 1
      return 0
    })
  }

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  const filteredProducts = filterAndSortItems(products)

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Navigation buttons - Ẩn đi */}
      {/* <Box sx={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ 
            padding: '10px 20px', 
            bgcolor: '#582F0E',
            minWidth: '120px',
            '&:hover': {
              bgcolor: '#936639',
            }
          }}
        >
          Trang chủ
        </Button>
      </Box> */}

      {/* Search Box */}
      <Box sx={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: '300px'
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#fff',
              borderRadius: '20px',
              '&:hover fieldset': {
                borderColor: '#936639',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#582F0E',
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#582F0E' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Cart button - Ẩn đi */}
      {/* <Box sx={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <IconButton
          onClick={() => navigate('/cart')}
          sx={{
            bgcolor: '#fff',
            '&:hover': {
              bgcolor: '#f0f0f0'
            }
          }}
        >
          <Badge badgeContent={cartItemCount} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box> */}

      <Box className="menu-page" sx={{ bgcolor: '#FDF8F5', pt: 8 }}>
        <Container maxWidth="xl">
          {/* Toast container với vị trí mới */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ marginTop: '100px' }} // Thêm margin-top để không bị header che
          />
          <Grid container spacing={3}>
            {/* Sidebar Categories */}
            <Grid item xs={12} md={3}>
              <Box className="menu-sidebar">
                <Typography variant="h6" className="menu-title">
                  MENU
                </Typography>

                <List component="nav">
                  {categories.map((category) => (
                    <ListItemButton
                      key={category}
                      selected={selectedCategory === category}
                      onClick={() => setSelectedCategory(category)}
                      sx={{
                        borderRadius: '8px',
                        mb: 1,
                        '&.Mui-selected': {
                          bgcolor: '#EADCD1',
                          color: '#582F0E',
                          '&:hover': {
                            bgcolor: '#DBC1AC',
                          }
                        },
                        '&:hover': {
                          bgcolor: '#F4EDE7',
                        }
                      }}
                    >
                      <ListItemText 
                        primary={category} 
                        primaryTypographyProps={{
                          sx: { 
                            fontWeight: selectedCategory === category ? 600 : 400
                          }
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>

                <Box className="special-offers">
                  <Typography variant="h6">
                    Special Offers
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Menu Items Grid */}
            <Grid item xs={12} md={9}>
              <Typography 
                variant="h4" 
                sx={{
                  color: '#582F0E',
                  fontWeight: 700,
                  mb: 4,
                  textAlign: 'center',
                  fontFamily: "'Playfair Display', serif",
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '3px',
                    bgcolor: '#936639'
                  }
                }}
              >
                {selectedCategory}
              </Typography>
              
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    placeholder="Tìm kiếm món..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#936639' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor: 'white',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#DBC1AC'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#936639'
                        }
                      }
                    }}
                  />
                </Box>
                
                <Grid container spacing={3}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                      <MenuItem product={product} />
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default Menu 