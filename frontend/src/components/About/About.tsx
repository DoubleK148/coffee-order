import { Box, Container, Typography, Grid } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import './About.css'
import aboutImage1 from '../../assets/Background_2.jpg'
import aboutImage2 from '../../assets/imghome2.jpg'
import aboutImage3 from '../../assets/imghome3.jpg'

const About = () => {
  const aboutItems = [
    {
      image: aboutImage1,
      title: "Câu chuyện của chúng tôi",
      description: [
        "Chào mừng bạn đến với E Coffee - nơi mà hương vị cà phê truyền thống hòa quyện với không gian hiện đại.",
        "Được thành lập từ năm 2020, chúng tôi tự hào mang đến cho khách hàng những tách cà phê thơm ngon nhất, được chọn lọc từ những hạt cà phê chất lượng cao của Việt Nam.",
        "Với đội ngũ barista chuyên nghiệp và đam mê, chúng tôi cam kết mỗi tách cà phê đều là một tác phẩm nghệ thuật."
      ],
      caption: "Không gian ấm cúng và hiện đại tại E Coffee"
    },
    {
      image: aboutImage2,
      title: "Đội ngũ của chúng tôi",
      description: [
        "Đằng sau mỗi tách cà phê hoàn hảo là những người thợ pha chế tài năng và đầy nhiệt huyết.",
        "Các barista của chúng tôi không ngừng học hỏi và sáng tạo để mang đến những trải nghiệm cà phê độc đáo nhất.",
        "Chúng tôi tin rằng cà phê không chỉ là đồ uống, mà còn là nghệ thuật và đam mê."
      ],
      caption: "Đội ngũ barista chuyên nghiệp của E Coffee"
    },
    {
      image: aboutImage3,
      title: "Chất lượng hàng đầu",
      description: [
        "Chúng tôi cam kết sử dụng 100% hạt cà phê Arabica và Robusta chất lượng cao từ Tây Nguyên.",
        "Quy trình rang xay được kiểm soát nghiêm ngặt để đảm bảo chất lượng tuyệt hảo cho từng tách cà phê.",
        "Mỗi ngày, chúng tôi đều nỗ lực để mang đến những trải nghiệm cà phê tuyệt vời nhất."
      ],
      caption: "Hạt cà phê chất lượng cao tại E Coffee"
    }
  ]

  return (
    <Box id="about" className="about-container">
      <Container>
        <Box className="about-content">
          <Typography variant="h2" component="h1" gutterBottom>
            About Us
          </Typography>
          
          <Carousel
            animation="fade"
            interval={6000}
            indicators={true}
            navButtonsAlwaysInvisible={true}
            className="about-carousel"
            indicatorContainerProps={{
              style: {
                marginTop: '20px',
                zIndex: 1
              }
            }}
            indicatorIconButtonProps={{
              style: {
                padding: '5px',
                color: '#cab09a'
              }
            }}
            activeIndicatorIconButtonProps={{
              style: {
                backgroundColor: '#cab09a',
                color: '#cab09a'
              }
            }}
          >
            {aboutItems.map((item, index) => (
              <Grid container spacing={4} alignItems="center" key={index}>
                <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                  <Box className="about-image-container">
                    <img src={item.image} alt={item.title} className="about-image" />
                    <Typography variant="subtitle1" className="image-caption">
                      {item.caption}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                  <Box className="about-text">
                    <Typography variant="h4" gutterBottom className="about-subtitle">
                      {item.title}
                    </Typography>
                    {item.description.map((text, i) => (
                      <Typography key={i} variant="body1" paragraph>
                        {text}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            ))}
          </Carousel>
        </Box>
      </Container>
    </Box>
  )
}

export default About 