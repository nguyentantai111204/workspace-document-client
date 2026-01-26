import axiosInstance from '../../common/config/axios.config'
import { FileResponse, FileQuery, FileListResponse } from './file.interface'

export const uploadFileApi = async (workspaceId: string, file: File): Promise<FileResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosInstance.post<FileResponse>(`/workspaces/${workspaceId}/files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const uploadFilesApi = async (workspaceId: string, files: File[]): Promise<{ successful: FileResponse[], failed: { file: File, error: any }[] }> => {
    const uploadPromises = files.map(async (file) => {
        try {
            const result = await uploadFileApi(workspaceId, file)
            return { status: 'fulfilled' as const, value: result, file }
        } catch (error) {
            return { status: 'rejected' as const, reason: error, file }
        }
    })

    const results = await Promise.all(uploadPromises)

    const successful: FileResponse[] = []
    const failed: { file: File, error: any }[] = []

    results.forEach((result) => {
        if (result.status === 'fulfilled') {
            successful.push(result.value)
        } else {
            failed.push({ file: result.file, error: result.reason })
        }
    })

    return { successful, failed }
}

export const listFilesApi = async (workspaceId: string, query?: FileQuery): Promise<FileListResponse> => {
    const response = await axiosInstance.get<FileListResponse>(`/workspaces/${workspaceId}/files`, { params: query })
    return response.data
}

export const deleteFileApi = async (workspaceId: string, fileId: string): Promise<void> => {
    await axiosInstance.delete(`/workspaces/${workspaceId}/files/${fileId}`)
}

export const updateFileApi = async (workspaceId: string, fileId: string, data: any): Promise<void> => {
    await axiosInstance.patch(`/workspaces/${workspaceId}/files/${fileId}`, data)
}
