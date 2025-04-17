import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  return (
    <Box className="admin-dashboard">
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box className="dashboard-card">
              <Typography variant="h6">Products</Typography>
              {/* Add product management content */}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className="dashboard-card">
              <Typography variant="h6">Orders</Typography>
              {/* Add order management content */}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className="dashboard-card">
              <Typography variant="h6">Users</Typography>
              {/* Add user management content */}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard 