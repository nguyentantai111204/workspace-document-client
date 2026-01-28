import useSWR from 'swr'
import { listFilesApi } from '../apis/file/file.api'
import { FileQuery } from '../apis/file/file.interface'

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

    return {
        files: data?.data || [],
        meta: data?.meta,
        isLoading,
        error,
        mutate,
    }
}
