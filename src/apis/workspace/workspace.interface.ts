
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

export interface WorkspaceResponse {
    id: string
    name: string
    ownerId: string
    createdAt: string
    updatedAt: string
}

export interface WorkspaceQuery {
    page?: number
    limit?: number
    search?: string
}

export interface InviteMemberRequest {
    email: string
    role: WorkspaceRole
}

export interface AcceptInviteRequest {
    token: string
}

export interface InviteResponse {
    id: string
    email: string
    role: WorkspaceRole
    status: string
    inviterId: string
    workspaceId: string
    createdAt: string
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

export interface MemberQuery {
    page?: number
    limit?: number
}

export interface UpdateRoleRequest {
    userId: string
    role: WorkspaceRole
}
