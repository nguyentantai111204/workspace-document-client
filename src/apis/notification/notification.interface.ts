import { BaseEntity, PaginationParams } from '../common/common.interface'

export const NotificationType = {
    SYSTEM: 'system',
    INVITE: 'invite',
    WORKSPACE: 'workspace',
    FILE: 'file'
} as const

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

export interface NotificationData {
    // For INVITE type
    workspaceId?: string
    workspaceName?: string
    inviteToken?: string
    role?: string
    inviterName?: string
    inviterId?: string

    // For WORKSPACE type
    memberId?: string
    memberName?: string

    // For FILE type
    fileId?: string
    fileName?: string
    action?: string

    // Generic data
    [key: string]: any
}

export interface Notification extends BaseEntity {
    recipientId: string
    senderId: string | null
    type: NotificationType
    title: string
    body: string
    data: NotificationData | null
    isRead: boolean
}

export interface NotificationListResponse {
    success: boolean
    data: Notification[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
    unreadCount: number
    message: string
}

export interface NotificationQuery extends PaginationParams {
}

export interface RegisterDeviceRequest {
    token: string
    deviceId: string
    deviceType: 'web' | 'android' | 'ios'
}
