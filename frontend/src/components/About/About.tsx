import { Box, Container, Typography, Grid } from '@mui/material'
import './About.css'
import aboutImage1 from '../../assets/Background_2.jpg'

const About = () => {
  return (
    <Box id="about" className="about-container">
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box className="about-image-container">
              <img src={aboutImage1} alt="About E Coffee" className="about-image" />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box className="about-text">
              <Typography variant="h2" className="about-title" gutterBottom>
                About Us
              </Typography>
              
              <Typography variant="body1" className="about-description" paragraph>
                Chào mừng bạn đến với E Coffee - nơi mà hương vị cà phê truyền thống hòa quyện với không gian hiện đại.
              </Typography>
              
              <Typography variant="body1" className="about-description" paragraph>
                Được thành lập từ năm 2020, chúng tôi tự hào mang đến cho khách hàng những tách cà phê thơm ngon nhất, 
                được chọn lọc từ những hạt cà phê chất lượng cao của Việt Nam.
              </Typography>
              
              <Typography variant="body1" className="about-description" paragraph>
                Với đội ngũ barista chuyên nghiệp và đam mê, chúng tôi cam kết mỗi tách cà phê đều là một tác phẩm nghệ thuật.
                Chúng tôi không ngừng học hỏi và sáng tạo để mang đến những trải nghiệm cà phê độc đáo nhất.
              </Typography>

              <Box className="about-features">
                <Box className="feature-item">
                  <Typography variant="h6" className="feature-title">
                    Chất Lượng
                  </Typography>
                  <Typography variant="body2" className="feature-text">
                    100% hạt cà phê Arabica và Robusta chất lượng cao từ Tây Nguyên
                  </Typography>
                </Box>

                <Box className="feature-item">
                  <Typography variant="h6" className="feature-title">
                    Không Gian
                  </Typography>
                  <Typography variant="body2" className="feature-text">
                    Thiết kế hiện đại, ấm cúng và thoải mái
                  </Typography>
                </Box>

                <Box className="feature-item">
                  <Typography variant="h6" className="feature-title">
                    Dịch Vụ
                  </Typography>
                  <Typography variant="body2" className="feature-text">
                    Đội ngũ nhân viên chuyên nghiệp, thân thiện
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default About 