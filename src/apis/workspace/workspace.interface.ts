import { BaseEntity, PaginationParams, PaginatedResponse } from '../common/common.interface'

export const WorkspaceRole = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER',
    VIEWER: 'VIEWER',
} as const

export type WorkspaceRole = (typeof WorkspaceRole)[keyof typeof WorkspaceRole]

export interface CreateWorkspaceRequest {
    name: string
}

export interface WorkspaceResponse extends BaseEntity {
    name: string
    ownerId: string
}

export type WorkspaceListResponse = PaginatedResponse<WorkspaceResponse>

export interface WorkspaceQuery extends PaginationParams {
}

export interface InviteMemberRequest {
    email: string
    role: WorkspaceRole
}

export interface AcceptInviteRequest {
    token: string
}

export interface InviteResponse extends Omit<BaseEntity, 'updatedAt'> {
    email: string
    role: WorkspaceRole
    status: string
    inviterId: string
    workspaceId: string
}

export interface MemberResponse {
    id: string
    workspaceId: string
    userId: string
    role: WorkspaceRole
    joinedAt: string
    user: {
        id: string
        email: string
        fullName: string
        avatarUrl: string | null
    }
}

export interface MemberQuery extends PaginationParams {
}

export interface UpdateRoleRequest {
    userId: string
    role: WorkspaceRole
}
