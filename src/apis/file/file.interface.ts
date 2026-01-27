import { BaseEntity, PaginationParams, PaginatedResponse } from '../common/common.interface'

export interface FileResponse extends BaseEntity {
    name: string
    mimeType: string
    size: number
    url: string
    workspaceId: string
    ownerId: string
    pubicId?: string
    status: string
}

export type FileListResponse = PaginatedResponse<FileResponse>

export interface FileQuery extends PaginationParams {
    search?: string
    type?: string
    startDate?: string
    endDate?: string
    parentId?: string
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
}

export interface UpdateFileRequest {
    name?: string
    parentId?: string
}
