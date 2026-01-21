import { Outlet } from 'react-router-dom'
import { Box, Container } from '@mui/material'

import { AuthCard } from './auth.card'

export const AuthLayout = (): React.ReactElement => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => theme.palette.grey[50]
      }}
    >
      <Container
        maxWidth="sm"
        disableGutters
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <AuthCard>
          <Outlet />
        </AuthCard>
      </Container>
    </Box>
  )
}
