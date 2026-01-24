import { BaseEntity, PaginationParams } from '../common/common.interface'

export interface FileResponse extends BaseEntity {
    name: string
    originalName: string
    mimeType: string
    size: number
    path: string
    workspaceId: string
    ownerId: string
    itemCount?: number
}

export interface FileQuery extends PaginationParams {
}
