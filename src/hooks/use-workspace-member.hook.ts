import useSWR from 'swr'
import { listMembersApi } from '../apis/workspace/workspace.api'
import { MemberQuery, MemberResponse } from '../apis/workspace/workspace.interface'

export const useWorkspaceMembers = (workspaceId: string | null | undefined, query?: MemberQuery) => {
    const key = workspaceId ? [`/workspaces/${workspaceId}/members`, query] : null

    const { data, error, isLoading, mutate } = useSWR(
        key,
        ([, q]: [string, MemberQuery | undefined]) => listMembersApi(workspaceId!, q),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
        }
    )

    return {
        members: (data?.data || []) as MemberResponse[],
        meta: data?.meta,
        isLoading,
        error,
        mutate,
    }
}
