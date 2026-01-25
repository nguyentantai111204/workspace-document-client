export interface BaseEntity {
    id: string
    createdAt: string
    updatedAt: string
}

export interface PaginationParams {
    page?: number
    limit?: number
    search?: string
}

export interface PageMeta {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface PaginatedResponse<T> {
    success: boolean
    data: T[]
    meta: PageMeta
    message: string
}
