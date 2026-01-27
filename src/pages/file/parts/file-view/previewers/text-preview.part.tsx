import { Box, CircularProgress, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'

interface TextPreviewProps {
    url: string
}

export const TextPreview = ({ url }: TextPreviewProps) => {
    const theme = useTheme()
    const [content, setContent] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(url)
                const text = await response.text()
                setContent(text)
            } catch (err) {
                console.error('Text preview error:', err)
                setError('Không thể tải bản xem trước văn bản.')
            } finally {
                setLoading(false)
            }
        }

        loadContent()
    }, [url])

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{
            p: 2,
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: 'calc(100vh - 200px)',
            border: `1px solid ${theme.palette.divider}`
        }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                {content}
            </pre>
        </Box>
    )
}
