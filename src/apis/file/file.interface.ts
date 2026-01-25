import { BaseEntity, PaginationParams, PaginatedResponse } from '../common/common.interface'

export interface FileResponse extends BaseEntity {
    name: string
    originalName: string
    mimeType: string
    size: number
    path: string
    workspaceId: string
    ownerId: string
    itemCount?: number
    isPinned?: boolean
}

export type FileListResponse = PaginatedResponse<FileResponse>

export interface FileQuery extends PaginationParams {
    search?: string
    type?: string
    startDate?: string
    endDate?: string
    isPinned?: boolean
    parentId?: string
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
}

export interface UpdateFileRequest {
    name?: string
    isPinned?: boolean
    parentId?: string
}
