
export interface FileResponse {
    id: string
    name: string
    originalName: string
    mimeType: string
    size: number
    path: string
    workspaceId: string
    ownerId: string
    createdAt: string
    updatedAt: string
}

export interface FileQuery {
    page?: number
    limit?: number
    search?: string
}
