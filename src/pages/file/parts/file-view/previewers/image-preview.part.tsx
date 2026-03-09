import { Box, alpha } from '@mui/material'
import { StackRowAlignCenterJustCenter } from '../../../../../components/mui-custom/stack/stack.mui-custom'

interface ImagePreviewProps {
    url: string
    name: string
}

export const ImagePreview = ({ url, name }: ImagePreviewProps) => {
    return (
        <StackRowAlignCenterJustCenter
            sx={{
                height: '100%',
                minHeight: 400,
                bgcolor: (theme) => alpha(theme.palette.common.black, 0.05),
                borderRadius: 2
            }}
        >
            <Box
                component="img"
                src={url}
                alt={name}
                sx={{
                    maxWidth: '100%',
                    maxHeight: 'calc(100vh - 200px)',
                    objectFit: 'contain'
                }}
            />
        </StackRowAlignCenterJustCenter>
    )
}