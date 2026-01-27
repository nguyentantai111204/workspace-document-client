import { Box, Typography, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import mammoth from 'mammoth'
import DOMPurify from 'dompurify'

interface DocxPreviewProps {
    url: string
}

export const DocxPreview = ({ url }: DocxPreviewProps) => {
    const [content, setContent] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(url)
                const arrayBuffer = await response.arrayBuffer()
                const result = await mammoth.convertToHtml({ arrayBuffer })
                setContent(DOMPurify.sanitize(result.value))
            } catch (err) {
                console.error('Docx preview error:', err)
                setError('Không thể tải bản xem trước của tài liệu này.')
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

    if (!content) return null

    return (
        <Box
            sx={{
                fontFamily: 'Times New Roman, serif',
                lineHeight: 1.6,
                '& p': { mb: 2 },
                '& h1, & h2, & h3': { mt: 3, mb: 1, fontWeight: 'bold' },
                '& table': { width: '100%', borderCollapse: 'collapse', mb: 2 },
                '& td, & th': { border: '1px solid #ccc', p: 1 }
            }}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    )
}
