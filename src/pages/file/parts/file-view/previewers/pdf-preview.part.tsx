import { Document, Page } from 'react-pdf'
import { Box, IconButton, Stack, Typography, CircularProgress } from '@mui/material'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useState, useEffect } from 'react'

interface PdfPreviewProps {
    url: string
}

export const PdfPreview = ({ url }: PdfPreviewProps) => {
    const [numPages, setNumPages] = useState<number>(0)
    const [page, setPage] = useState(1)
    const [scale, setScale] = useState(1.0)
    const [pdfData, setPdfData] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true

        const fetchPdf = async () => {
            try {
                const response = await fetch(url)
                if (!response.ok) throw new Error('Network response was not ok')
                const blob = await response.blob()
                if (active) {
                    const objectUrl = URL.createObjectURL(blob)
                    setPdfData(objectUrl)
                }
            } catch (err) {
                console.error('Error fetching PDF blob:', err)
                if (active) setError('Không thể tải file PDF. Vui lòng thử tải xuống.')
            }
        }

        fetchPdf()

        return () => {
            active = false
            if (pdfData) URL.revokeObjectURL(pdfData)
        }
    }, [url])

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        )
    }

    if (!pdfData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%', height: '100%', textAlign: 'center' }}>
            {/* Toolbar */}
            <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 1 }}
            >
                <IconButton onClick={() => setScale(s => Math.max(0.6, s - 0.2))}>
                    <ZoomOutIcon />
                </IconButton>

                <IconButton onClick={() => setScale(s => Math.min(2.5, s + 0.2))}>
                    <ZoomInIcon />
                </IconButton>

                <IconButton
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    <ChevronLeftIcon />
                </IconButton>

                <Typography>
                    {page} / {numPages}
                </Typography>

                <IconButton
                    disabled={page >= numPages}
                    onClick={() => setPage(p => p + 1)}
                >
                    <ChevronRightIcon />
                </IconButton>
            </Stack>

            {/* PDF */}
            <Box
                sx={{
                    overflow: 'auto',
                    height: 'calc(100vh - 260px)',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Document
                    file={pdfData}
                    loading={<CircularProgress />}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    onLoadError={(err) => console.error('PDF load error:', err)}
                >
                    <Page
                        pageNumber={page}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                </Document>
            </Box>
        </Box>
    )
}
