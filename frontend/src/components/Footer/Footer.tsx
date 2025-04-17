import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
  marginTop: 'auto',
}));

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">
            © {new Date().getFullYear()} E Coffee. All rights reserved.
          </Typography>
          <Box>
            
          </Box>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer; 