import { Box, Typography, keyframes } from '@mui/material'

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
`

interface TypingIndicatorProps {
    userNames?: string[]
}

export const TypingIndicator = ({ userNames = [] }: TypingIndicatorProps) => {
    if (userNames.length === 0) return null

    const displayText = userNames.length === 1
        ? `${userNames[0]} đang nhập...`
        : userNames.length === 2
            ? `${userNames[0]} và ${userNames[1]} đang nhập...`
            : `${userNames.length} người đang nhập...`

    return (
        <Box
            sx={{
                px: { xs: 1, sm: 2 },
                py: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 0.5,
                    alignItems: 'center'
                }}
            >
                {[0, 1, 2].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: 'text.secondary',
                            animation: `${bounce} 1.4s ease-in-out ${i * 0.2}s infinite`
                        }}
                    />
                ))}
            </Box>

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
            >
                {displayText}
            </Typography>
        </Box>
    )
}
