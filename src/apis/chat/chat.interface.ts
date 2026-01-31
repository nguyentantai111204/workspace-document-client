export type ConversationType = 'DIRECT' | 'GROUP'
export type ParticipantRole = 'ADMIN' | 'MEMBER'
export type AttachmentType = 'image' | 'file'

export interface Attachment {
    type: AttachmentType
    url: string
    name: string
    size: number
    mimeType: string
}

export interface Conversation {
    id: string
    workspaceId: string
    type: ConversationType
    name?: string
    avatarUrl?: string
    lastMessageId?: string
    lastMessageAt?: string
    createdAt: string
}

export interface Message {
    id: string
    conversationId: string
    senderId: string
    content: string
    attachments: Attachment[]
    createdAt: string
}

export interface Participant {
    id: string
    conversationId: string
    userId: string
    role: ParticipantRole
    joinedAt: string
    leftAt?: string
    lastReadAt?: string
    isMuted: boolean
}

export interface ConversationListQuery {
    page?: number
    limit?: number
}

export interface MessageQuery {
    limit?: number
    cursor?: string
}

export interface CreateConversationRequest {
    type: ConversationType
    name?: string
    participantIds: string[]
}

export interface SendMessageRequest {
    content: string
    attachments?: Attachment[]
}

export interface UpdateConversationRequest {
    name?: string
    avatarUrl?: string
}

export interface ConversationWithUnread extends Conversation {
    unreadCount: number
    participants?: Participant[]
    lastMessage?: Message
}

export interface ConversationListResponse {
    items: ConversationWithUnread[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface MessageListResponse {
    messages: Message[]
    hasMore: boolean
    nextCursor?: string
}

export interface UnreadCountResponse {
    unreadCount: number
}
