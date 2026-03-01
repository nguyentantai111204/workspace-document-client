import { MemberResponse, WorkspaceRole } from '../../../apis/workspace/workspace.interface'

export interface MemberPermissions {
    canInvite: boolean
    canChangeRoleToAdmin: boolean
    canChangeRole: boolean
    canDelete: boolean
    canActOn: boolean
}

export const getMemberPermissions = (
    myRole: WorkspaceRole | undefined,
    targetMember: MemberResponse,
    myUserId: string | undefined
): MemberPermissions => {
    const isSelf = targetMember.userId === myUserId
    const targetIsOwner = targetMember.role === WorkspaceRole.OWNER

    const isOwner = myRole === WorkspaceRole.OWNER
    const isAdmin = myRole === WorkspaceRole.ADMIN
    const hasManageAccess = isOwner || isAdmin

    return {
        canInvite: hasManageAccess,

        canChangeRoleToAdmin: isOwner && !isSelf && !targetIsOwner,

        canChangeRole: hasManageAccess && !isSelf && !targetIsOwner,

        canDelete: hasManageAccess && !isSelf && !targetIsOwner,

        canActOn: hasManageAccess && !isSelf && !targetIsOwner,
    }
}

export const canInviteMembers = (myRole: WorkspaceRole | undefined): boolean =>
    myRole === WorkspaceRole.OWNER || myRole === WorkspaceRole.ADMIN
