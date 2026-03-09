import { Pagination, useMediaQuery, useTheme } from '@mui/material'
import { StackRowAlignCenterJustEnd } from '../mui-custom/stack/stack.mui-custom'

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
        <StackRowAlignCenterJustEnd sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
                count={count}
                page={page}
                onChange={onChange}
                color="primary"
                shape="rounded"
                size={isMobile ? 'small' : 'medium'}
                siblingCount={isMobile ? 0 : 1}
            />
        </StackRowAlignCenterJustEnd>
    )
}
