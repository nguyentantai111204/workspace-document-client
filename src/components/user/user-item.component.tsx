import { Box, Stack, Typography, alpha, useTheme, SxProps, Theme, BoxProps } from '@mui/material'
import React from 'react'

interface UserItemComponentProps extends BoxProps {
    avatarUrl?: string | null
    fullName: string
    email: string
    action?: React.ReactNode
    sx?: SxProps<Theme>
    onClick?: () => void
}

export const UserItemComponent = ({
    avatarUrl,
    fullName,
    email,
    action,
    sx,
    onClick,
    ...rest
}: UserItemComponentProps) => {
    const theme = useTheme()

    return (
        <Box
            onClick={onClick}
            {...rest}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: { xs: 0.75, sm: 1 },
                px: { xs: 1, sm: 1 },
                borderRadius: 1,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s',
                '&:hover': onClick ? {
                    bgcolor: alpha(theme.palette.grey[500], 0.08)
                } : {},
                ...sx
            }}
        >
            <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                {avatarUrl ? (
                    <Box
                        component="img"
                        src={avatarUrl}
                        sx={{
                            width: { xs: 28, sm: 32 },
                            height: { xs: 28, sm: 32 },
                            borderRadius: '50%',
                            objectFit: 'cover',
                            flexShrink: 0
                        }}
                    />
                ) : (
                    <Box sx={{
                        width: { xs: 28, sm: 32 },
                        height: { xs: 28, sm: 32 },
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'common.white',
                        fontSize: { xs: 12, sm: 14 },
                        flexShrink: 0
                    }}>
                        {fullName.charAt(0).toUpperCase()}
                    </Box>
                )}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="body2"
                        fontWeight={500}
                        noWrap
                        sx={{
                            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                            lineHeight: 1.2
                        }}
                    >
                        {fullName}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            display: 'block'
                        }}
                    >
                        {email}
                    </Typography>
                </Box>
            </Stack>
            {action && (
                <Box sx={{ ml: 1, flexShrink: 0 }}>
                    {action}
                </Box>
            )}
        </Box>
    )
}
