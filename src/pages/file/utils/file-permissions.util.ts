import { WorkspaceRole } from '../../../apis/workspace/workspace.interface'

export interface FilePermissions {
    canEdit: boolean
    canDelete: boolean
    canShare: boolean
    canUpload: boolean
}

const ROLE_PERMISSIONS: Record<WorkspaceRole, { canEdit: boolean; canDelete: boolean; canShare: boolean; canUpload: boolean }> = {
    OWNER: { canEdit: true, canDelete: true, canShare: true, canUpload: true },
    ADMIN: { canEdit: true, canDelete: true, canShare: true, canUpload: true },
    MEMBER: { canEdit: true, canDelete: true, canShare: true, canUpload: true },
    VIEWER: { canEdit: false, canDelete: false, canShare: false, canUpload: false },
}

export const getFilePermissions = (role: WorkspaceRole | undefined): FilePermissions => {
    if (!role) return { canEdit: false, canDelete: false, canShare: false, canUpload: false }
    return ROLE_PERMISSIONS[role]
}
