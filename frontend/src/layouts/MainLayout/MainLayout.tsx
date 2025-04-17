import { Box } from '@mui/material'
import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const hasHeader = isHomePage || location.pathname === '/profile';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '70vh' }}>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          paddingTop: hasHeader ? '100px' : '0px',
          minHeight: 'calc(100vh - 50px)' 
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default MainLayout 