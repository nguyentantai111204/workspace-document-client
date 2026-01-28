import useSWR from 'swr'
import { listFilesApi, updateFileApi, deleteFileApi } from '../apis/file/file.api'
import { FileQuery, UpdateFileRequest } from '../apis/file/file.interface'

export const useFiles = (workspaceId?: string, query?: FileQuery) => {
    const key = workspaceId ? [`/workspaces/${workspaceId}/files`, query] : null

    const { data, error, isLoading, mutate } = useSWR(
        key,
        ([, query]: [string, FileQuery | undefined]) => listFilesApi(workspaceId!, query),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
        }
    )

    const updateFile = async (fileId: string, data: UpdateFileRequest) => {
        try {
            await updateFileApi(workspaceId!, fileId, data)
            await mutate()
        } catch (error) {
            throw error
        }
    }

    const deleteFile = async (fileId: string) => {
        try {
            await deleteFileApi(workspaceId!, fileId)
            await mutate()
        } catch (error) {
            throw error
        }
    }

    return {
        files: data?.data || [],
        meta: data?.meta,
        isLoading,
        error,
        mutate,
        updateFile,
        deleteFile
    }
}
