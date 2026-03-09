import { Outlet } from 'react-router-dom'
import { Box, Container } from '@mui/material'

import { AuthCard } from './auth.card'
import { StackRowAlignStartJustCenter } from '../../components/mui-custom/stack/stack.mui-custom'

export const AuthLayout = (): React.ReactElement => {
  return (
    <StackRowAlignStartJustCenter
      sx={{
        width: '100vw',
        height: '100vh',
        background: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[50]
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
    </StackRowAlignStartJustCenter>
  )
}
