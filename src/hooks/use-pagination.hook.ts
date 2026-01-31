import { useState, useMemo } from 'react'
import { PAGE_LIMIT_DEFAULT } from '../common/constant/page-take.constant'

export interface UsePaginationProps {
    initialPage?: number
    totalPages?: number
}

export interface UsePaginationReturn {
    page: number
    setPage: (page: number) => void
    resetPage: () => void
    paginationProps: {
        count: number
        page: number
        onChange: (event: unknown, newPage: number) => void
    } | undefined
}

export const usePagination = ({
    initialPage = PAGE_LIMIT_DEFAULT.page,
    totalPages
}: UsePaginationProps = {}): UsePaginationReturn => {
    const [page, setPage] = useState(initialPage)

    const handlePageChange = (_event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const resetPage = () => {
        setPage(PAGE_LIMIT_DEFAULT.page)
    }

    const paginationProps = useMemo(() => {
        return totalPages && totalPages > 0 ? {
            count: totalPages,
            page: page,
            onChange: handlePageChange
        } : undefined
    }, [totalPages, page])

    return {
        page,
        setPage,
        resetPage,
        paginationProps
    }
}
