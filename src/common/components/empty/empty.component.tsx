import { Box, Typography } from '@mui/material'

interface Props {
    title?: string
    description?: string
}

export function AppEmpty({
    title = 'Không có dữ liệu',
    description = 'Hiện chưa có dữ liệu về mục này',
}: Props) {
    return (
        <Box textAlign="center" py={6}>
            <Typography variant="subtitle1" fontWeight={600}>
                {title}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
            >
                {description}
            </Typography>
        </Box>
    )
}
