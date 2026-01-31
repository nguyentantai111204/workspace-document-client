import { ReactNode } from 'react'

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
    onChange: (event: unknown, newPage: number) => void
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
    loading?: boolean
}
