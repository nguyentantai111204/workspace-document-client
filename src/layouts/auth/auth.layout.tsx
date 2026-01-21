import { Outlet } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { AuthBackground } from './auth-background.layout'
import { AuthCard } from './auth.card'

export const AuthLayout = (): React.ReactElement => {
  return (
    <Box position="relative">
      <AuthBackground />

      <Container
        maxWidth="sm"
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <AuthCard>
          <Outlet />
        </AuthCard>
      </Container>
    </Box>
  )
}
