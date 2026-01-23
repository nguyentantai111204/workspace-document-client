import axiosInstance from '../../common/config/axios.config'
import { FileResponse, FileQuery } from './file.interface'

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

export const listFilesApi = async (workspaceId: string, query?: FileQuery): Promise<FileResponse[]> => {
    const response = await axiosInstance.get<FileResponse[]>(`/workspaces/${workspaceId}/files`, { params: query })
    return response.data
}

export const deleteFileApi = async (workspaceId: string, fileId: string): Promise<void> => {
    await axiosInstance.delete(`/workspaces/${workspaceId}/files/${fileId}`)
}
