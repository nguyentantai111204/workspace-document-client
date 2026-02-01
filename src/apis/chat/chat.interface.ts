import { BaseEntity, PaginatedResponse, PaginationParams } from '../common/common.interface'

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

export interface Conversation extends BaseEntity {
    workspaceId: string
    type: ConversationType
    name?: string
    avatarUrl?: string
    lastMessageId?: string
    lastMessageAt?: string
}

export interface Message extends BaseEntity {
    conversationId: string
    senderId: string
    content: string
    attachments: Attachment[]
}

export interface Participant extends BaseEntity {
    conversationId: string
    userId: string
    role: ParticipantRole
    joinedAt: string
    leftAt?: string
    lastReadAt?: string
    isMuted: boolean
}

export interface ConversationListQuery extends PaginationParams { }

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

export interface ConversationListResponse extends PaginatedResponse<ConversationWithUnread> { }


export interface MessageListResponse {
    data: Message[]
    nextCursor?: string
    hasMore: boolean
}

export interface UnreadCountResponse {
    unreadCount: number
}
