export interface BaseEntity {
    id: string
    createdAt: string
    updatedAt: string
}

export interface PaginationParams {
    page?: number
    take?: number
    search?: string
}

export interface PageMeta {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}

export interface ListResponse<T> {
    data: T[]
    meta: PageMeta
}
