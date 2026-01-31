import { Pagination, Box, useMediaQuery, useTheme } from '@mui/material'

export interface PaginationComponentProps {
    count: number
    page: number
    onChange: (event: unknown, newPage: number) => void
}

export const PaginationComponent = ({ count, page, onChange }: PaginationComponentProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    if (count <= 0) return null

    return (
        <Box sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
                count={count}
                page={page}
                onChange={onChange}
                color="primary"
                shape="rounded"
                size={isMobile ? 'small' : 'medium'}
                siblingCount={isMobile ? 0 : 1}
            />
        </Box>
    )
}
