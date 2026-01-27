import { Box, useTheme, alpha } from '@mui/material'

interface ImagePreviewProps {
    url: string
    name: string
}

export const ImagePreview = ({ url, name }: ImagePreviewProps) => {
    const theme = useTheme()

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, bgcolor: alpha(theme.palette.common.black, 0.05), borderRadius: 2 }}>
            <img src={url} alt={name} style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 200px)', objectFit: 'contain' }} />
        </Box>
    )
}
