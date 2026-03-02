import useSWR from 'swr'
import { listConversationsApi } from '../apis/chat/chat.api'
import { ConversationListQuery, ConversationWithUnread } from '../apis/chat/chat.interface'

export const useConversations = (
    workspaceId: string | null | undefined,
    query?: ConversationListQuery
) => {
    const key = workspaceId
        ? [`/workspaces/${workspaceId}/conversations`, query]
        : null

    const { data, error, isLoading, mutate } = useSWR(
        key,
        ([, q]: [string, ConversationListQuery | undefined]) =>
            listConversationsApi(workspaceId!, q),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            refreshInterval: 30000
        }
    )

    return {
        conversations: (data?.data || []) as ConversationWithUnread[],
        meta: data?.meta,
        isLoading,
        error,
        mutate
    }
}
