import useSWR from 'swr'
import { listConversationsApi, getUnreadCountApi } from '../apis/chat/chat.api'
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
            refreshInterval: 30000 // Refresh every 30s
        }
    )

    // Optionally fetch unread counts for each conversation
    const fetchUnreadCounts = async (conversations: ConversationWithUnread[]) => {
        const promises = conversations.map(async (conv) => {
            try {
                const { unreadCount } = await getUnreadCountApi(conv.id)
                return { ...conv, unreadCount }
            } catch {
                return conv
            }
        })
        return Promise.all(promises)
    }

    return {
        conversations: (data?.data || []) as ConversationWithUnread[],
        meta: data?.meta,
        isLoading,
        error,
        mutate,
        fetchUnreadCounts
    }
}
