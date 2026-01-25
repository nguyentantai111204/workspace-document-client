import useSWR from 'swr'
import { listWorkspacesApi } from '../apis/workspace/workspace.api'
import { WorkspaceQuery } from '../apis/workspace/workspace.interface'

export const useWorkspaces = (query?: WorkspaceQuery) => {
    const key = ['/workspaces', query]

    const { data, error, isLoading, mutate } = useSWR(
        key,
        ([, q]: [string, WorkspaceQuery | undefined]) => listWorkspacesApi(q),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
        }
    )

    return {
        workspaces: data?.data || [],
        meta: data?.meta,
        isLoading,
        error,
        mutate,
    }
}
