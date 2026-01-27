import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

interface TextPreviewProps {
    url: string
}

export const TextPreview = ({ url }: TextPreviewProps) => {
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
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                {content}
            </pre>
        </Box>
    )
}
