import { WorkspaceRole } from '../../apis/workspace/workspace.interface'

export const WORKSPACE_ROLE_CONFIG = {
    [WorkspaceRole.OWNER]: { label: 'Owner', color: 'error' as const },
    [WorkspaceRole.ADMIN]: { label: 'Admin', color: 'warning' as const },
    [WorkspaceRole.MEMBER]: { label: 'Editor', color: 'primary' as const },
    [WorkspaceRole.VIEWER]: { label: 'Viewer', color: 'default' as const },
}

export const WORKSPACE_ROLE_OPTIONS = [
    { value: '', label: 'Tất cả vai trò' },
    { value: WorkspaceRole.ADMIN, label: 'Admin' },
    { value: WorkspaceRole.OWNER, label: 'Owner' },
    { value: WorkspaceRole.MEMBER, label: 'Editor' },
    { value: WorkspaceRole.VIEWER, label: 'Viewer' },
]
