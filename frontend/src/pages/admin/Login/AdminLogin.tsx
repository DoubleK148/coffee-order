import React, { useState } from 'react'
import { Box, Container, TextField, Button, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement admin login logic
    console.log('Admin login:', { email, password })
    navigate('/admin/dashboard')
  }

  return (
    <Box className="admin-login-page">
      <Container maxWidth="xs">
        <Paper elevation={3} className="login-form">
          <Typography variant="h5" component="h1" gutterBottom>
            Admin Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default AdminLogin 