import { ReactNode, ChangeEvent } from 'react'

export interface TableColumn<T> {
    id: string
    label: string
    width?: string | number
    minWidth?: string | number
    align?: 'left' | 'center' | 'right'
    render?: (row: T) => ReactNode
}

export interface TablePaginationProps {
    count: number
    page: number
    rowsPerPage: number
    onPageChange: (event: unknown, newPage: number) => void
    onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void
    rowsPerPageOptions?: number[]
}

export interface TableSelectionProps<T> {
    selectedIds: string[]
    onSelect: (id: string) => void
    onSelectAll: (checked: boolean, ids: string[]) => void
    onRowClick?: (row: T) => void
}

export interface TableProps<T> {
    data: T[]
    columns: TableColumn<T>[]
    selection?: TableSelectionProps<T>
    pagination?: TablePaginationProps
    loading?: boolean
}
