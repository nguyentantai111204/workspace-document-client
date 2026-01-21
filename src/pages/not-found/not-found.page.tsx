
import { Box, Button, Container, Typography, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const NotFoundPage = () => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                width: '100vw',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 3,
            }}
        >
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                <Box
                    component="img"
                    src="/assets/illustrations/illustration-404.svg"
                    alt="404 Not Found"
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        height: 'auto',
                        mb: 4,
                        mx: 'auto',
                    }}
                />

                <Typography variant="h1" fontWeight={800} color="primary" sx={{ fontSize: { xs: '3rem', md: '5rem' }, mb: 1 }}>
                    Opps!!!
                </Typography>

                <Typography variant="h4" fontWeight={600} mb={2} color="text.primary">
                    Trang bạn tìm kiếm không tồn tại
                </Typography>

                <Typography variant="body1" color="text.secondary" mb={5} sx={{ maxWidth: 500, mx: 'auto' }}>
                    Có vẻ như bạn đã truy cập vào một liên kết hỏng hoặc trang này đã bị di chuyển.
                    Hãy quay lại trang chủ để tiếp tục.
                </Typography>

                <Button
                    component={RouterLink}
                    to="/"
                    variant="contained"
                    size="large"
                    sx={{
                        textTransform: 'none',
                        px: 5,
                        py: 1.5,
                        borderRadius: 3,
                        boxShadow: theme.shadows[10]
                    }}
                    startIcon={<ArrowBackIcon />}
                >
                    Về trang chủ
                </Button>
            </Container>
        </Box>
    )
}
