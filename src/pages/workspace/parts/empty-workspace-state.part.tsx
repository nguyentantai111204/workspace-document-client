import { Box, Typography, Button, Container, alpha, useTheme } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import { motion } from 'framer-motion'

interface EmptyWorkspaceStateProps {
    onCreateWorkspace: () => void
}

export const EmptyWorkspaceState = ({ onCreateWorkspace }: EmptyWorkspaceStateProps) => {
    const theme = useTheme()

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 200px)',
                    textAlign: 'center',
                    py: { xs: 4, md: 8 },
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box
                        sx={{
                            width: { xs: 120, md: 160 },
                            height: { xs: 120, md: 160 },
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 4,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: -2,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                opacity: 0.2,
                                filter: 'blur(10px)',
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src="/favicon.ico"
                            alt="Logo"
                            sx={{
                                width: { xs: 60, md: 80 },
                                height: { xs: 60, md: 80 },
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{
                            fontSize: { xs: '1.75rem', md: '2.125rem' },
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Chào mừng đến với DocWorkspace
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                            maxWidth: 500,
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            px: { xs: 2, md: 0 },
                        }}
                    >
                        Bạn chưa có workspace nào. Hãy tạo workspace đầu tiên để bắt đầu quản lý tài liệu và cộng tác với đội nhóm của bạn.
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={onCreateWorkspace}
                        sx={{
                            px: { xs: 3, md: 4 },
                            py: { xs: 1.5, md: 1.75 },
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            '&:hover': {
                                boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                            },
                        }}
                    >
                        Tạo Workspace Đầu Tiên
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    style={{ width: '100%' }}
                >
                    <Box
                        sx={{
                            mt: 6,
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                            gap: { xs: 2, md: 3 },
                            px: { xs: 2, md: 0 },
                        }}
                    >
                        {[
                            { icon: '/assets/icons/navbar/ic-blog.svg', title: 'Quản lý tài liệu', desc: 'Tổ chức file hiệu quả' },
                            { icon: '/assets/icons/glass/ic-glass-users.svg', title: 'Cộng tác nhóm', desc: 'Làm việc cùng đội nhóm' },
                            { icon: '/assets/icons/navbar/ic-lock.svg', title: 'Bảo mật cao', desc: 'Dữ liệu được mã hóa' },
                        ].map((feature, index) => (
                            <Box
                                key={index}
                                sx={{
                                    p: { xs: 2, md: 3 },
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    transition: theme.transitions.create(['transform', 'box-shadow']),
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                                        border: `1px solid ${theme.palette.primary.main}`,
                                    },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={feature.icon}
                                    alt={feature.title}
                                    sx={{
                                        width: { xs: 40, md: 48 },
                                        height: { xs: 40, md: 48 },
                                        mb: 2,
                                        objectFit: 'contain',
                                    }}
                                />
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    gutterBottom
                                    sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                                >
                                    {feature.desc}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </motion.div>
            </Box>
        </Container>
    )
}
