import axiosInstance from '../../common/config/axios.config'
import {
    Conversation,
    Message,
    Participant,
    CreateConversationRequest,
    SendMessageRequest,
    ConversationListQuery,
    MessageQuery,
    UpdateConversationRequest,
    ConversationListResponse,
    MessageListResponse,
    UnreadCountResponse
} from './chat.interface'

const BASE_PATH = '/api'

// ==================== Conversations ====================

export const listConversationsApi = async (
    workspaceId: string,
    query?: ConversationListQuery
): Promise<ConversationListResponse> => {
    const response = await axiosInstance.get(
        `${BASE_PATH}/workspaces/${workspaceId}/conversations`,
        { params: query }
    )
    return response.data
}

export const getConversationApi = async (id: string): Promise<Conversation> => {
    const response = await axiosInstance.get(`${BASE_PATH}/conversations/${id}`)
    return response.data
}

export const createConversationApi = async (
    workspaceId: string,
    data: CreateConversationRequest
): Promise<Conversation> => {
    const response = await axiosInstance.post(
        `${BASE_PATH}/workspaces/${workspaceId}/conversations`,
        data
    )
    return response.data
}

export const updateConversationApi = async (
    id: string,
    data: UpdateConversationRequest
): Promise<Conversation> => {
    const response = await axiosInstance.patch(
        `${BASE_PATH}/conversations/${id}`,
        data
    )
    return response.data
}

export const leaveConversationApi = async (id: string): Promise<void> => {
    await axiosInstance.delete(`${BASE_PATH}/conversations/${id}/leave`)
}

// ==================== Participants ====================

export const getParticipantsApi = async (
    conversationId: string
): Promise<Participant[]> => {
    const response = await axiosInstance.get(
        `${BASE_PATH}/conversations/${conversationId}/participants`
    )
    return response.data
}

export const addParticipantApi = async (
    conversationId: string,
    userId: string
): Promise<Participant> => {
    const response = await axiosInstance.post(
        `${BASE_PATH}/conversations/${conversationId}/participants`,
        { userId }
    )
    return response.data
}

// ==================== Messages ====================

export const getMessagesApi = async (
    conversationId: string,
    query?: MessageQuery
): Promise<MessageListResponse> => {
    const response = await axiosInstance.get(
        `${BASE_PATH}/conversations/${conversationId}/messages`,
        { params: query }
    )
    return response.data
}

export const sendMessageApi = async (
    conversationId: string,
    data: SendMessageRequest
): Promise<Message> => {
    const response = await axiosInstance.post(
        `${BASE_PATH}/conversations/${conversationId}/messages`,
        data
    )
    return response.data
}

export const markMessageAsReadApi = async (messageId: string): Promise<void> => {
    await axiosInstance.patch(`${BASE_PATH}/messages/${messageId}/read`)
}

export const markAllAsReadApi = async (conversationId: string): Promise<void> => {
    await axiosInstance.patch(
        `${BASE_PATH}/conversations/${conversationId}/read-all`
    )
}

export const getUnreadCountApi = async (
    conversationId: string
): Promise<UnreadCountResponse> => {
    const response = await axiosInstance.get(
        `${BASE_PATH}/conversations/${conversationId}/unread-count`
    )
    return response.data
}

// ==================== Search ====================

export const searchMessagesApi = async (
    workspaceId: string,
    query: string,
    limit: number = 20
): Promise<Message[]> => {
    const response = await axiosInstance.get(
        `${BASE_PATH}/workspaces/${workspaceId}/messages/search`,
        { params: { q: query, limit } }
    )
    return response.data
}
