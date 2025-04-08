import { Box, Container, Typography } from '@mui/material'
import './Blog.css'

const Blog = () => {
  return (
    <Box id="blog" className="blog-container">
      <Container>
        <Typography variant="h2" component="h1" gutterBottom>
          Blog
        </Typography>
        {/* Thêm nội dung blog */}
      </Container>
    </Box>
  )
}

export default Blog 