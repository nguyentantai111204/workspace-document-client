import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

interface PdfPreviewProps {
    url: string
}

export const PdfPreview = ({ url }: PdfPreviewProps) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        let objectUrl: string | null = null

        const loadContent = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(url)
                const blob = await response.blob()
                if (active) {
                    objectUrl = window.URL.createObjectURL(blob)
                    setBlobUrl(objectUrl)
                }
            } catch (err) {
                console.error('Pdf preview error:', err)
                if (active) setError('Không thể tải bản xem trước PDF.')
            } finally {
                if (active) setLoading(false)
            }
        }

        loadContent()

        return () => {
            active = false
            if (objectUrl) {
                window.URL.revokeObjectURL(objectUrl)
            }
        }
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

    if (!blobUrl) return null

    return (
        <Box sx={{ width: '100%', height: 'calc(100vh - 150px)', minHeight: 500 }}>
            <iframe
                src={blobUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="File Preview"
            />
        </Box>
    )
}
