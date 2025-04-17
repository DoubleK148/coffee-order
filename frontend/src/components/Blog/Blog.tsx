import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material'
import './Blog.css'

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Nghệ Thuật Pha Cà Phê',
      description: 'Khám phá bí quyết pha cà phê hoàn hảo từ các barista chuyên nghiệp của chúng tôi.',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      date: '10/04/2024'
    },
    {
      id: 2,
      title: 'Lịch Sử Cà Phê Việt Nam',
      description: 'Hành trình thú vị của cà phê từ khi du nhập vào Việt Nam đến nay.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
      date: '09/04/2024'
    },
    {
      id: 3,
      title: 'Cà Phê và Sức Khỏe',
      description: 'Những lợi ích sức khỏe bất ngờ từ việc uống cà phê đúng cách.',
      image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13',
      date: '08/04/2024'
    }
  ]

  return (
    <Box id="blog" className="blog-container">
      <Container>
        <Typography variant="h2" component="h1" className="blog-title" gutterBottom>
          Blog & Tin Tức
        </Typography>
        <Typography variant="subtitle1" className="blog-subtitle" gutterBottom>
          Khám phá thế giới cà phê cùng chúng tôi
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {blogPosts.map((post) => (
            <Grid item xs={12} md={4} key={post.id}>
              <Card className="blog-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                  className="blog-image"
                />
                <CardContent className="blog-content">
                  <Typography variant="caption" className="blog-date">
                    {post.date}
                  </Typography>
                  <Typography variant="h5" component="h2" className="blog-post-title">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" className="blog-description">
                    {post.description}
                  </Typography>
                  <Button className="read-more-button">
                    Đọc thêm
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            variant="contained"
            className="view-all-button"
          >
            Xem Tất Cả Bài Viết
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default Blog 