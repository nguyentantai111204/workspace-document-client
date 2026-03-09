import { Menu, MenuItem, Divider, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { MemberResponse, WorkspaceRole } from '../../../apis/workspace/workspace.interface'
import { MemberPermissions } from '../utils/member-permissions.util'

interface MemberActionMenuProps {
    anchorEl: HTMLElement | null
    onClose: () => void
    member: MemberResponse
    onUpdateRole: (member: MemberResponse, role: WorkspaceRole) => void
    onDelete: (member: MemberResponse) => void
    permissions: MemberPermissions
}

export const MemberActionMenu = ({
    anchorEl,
    onClose,
    member,
    onUpdateRole,
    onDelete,
    permissions,
}: MemberActionMenuProps) => {
    const handleUpdateRole = (role: WorkspaceRole) => {
        onUpdateRole(member, role)
        onClose()
    }

    const handleDelete = () => {
        onDelete(member)
        onClose()
    }

    const hasAnyAction =
        permissions.canChangeRoleToAdmin ||
        permissions.canChangeRole ||
        permissions.canDelete

    if (!hasAnyAction) return null

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            {/* Role change section */}
            {(permissions.canChangeRoleToAdmin || permissions.canChangeRole) && (
                <MenuItem disabled sx={{ opacity: 1, cursor: 'default', py: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Đổi vai trò
                    </Typography>
                </MenuItem>
            )}

            {permissions.canChangeRoleToAdmin && (
                <MenuItem
                    onClick={() => handleUpdateRole(WorkspaceRole.ADMIN)}
                    disabled={member.role === WorkspaceRole.ADMIN}
                >
                    <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                    Đặt làm Admin
                </MenuItem>
            )}

            {permissions.canChangeRole && (
                <MenuItem
                    onClick={() => handleUpdateRole(WorkspaceRole.MEMBER)}
                    disabled={member.role === WorkspaceRole.MEMBER}
                >
                    <EditIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    Đặt làm Editor
                </MenuItem>
            )}

            {permissions.canChangeRole && (
                <MenuItem
                    onClick={() => handleUpdateRole(WorkspaceRole.VIEWER)}
                    disabled={member.role === WorkspaceRole.VIEWER}
                >
                    <VisibilityIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    Đặt làm Viewer
                </MenuItem>
            )}

            {/* Delete section */}
            {permissions.canDelete && (permissions.canChangeRoleToAdmin || permissions.canChangeRole) && (
                <Divider />
            )}

            {permissions.canDelete && (
                <MenuItem
                    onClick={handleDelete}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Xóa thành viên
                </MenuItem>
            )}
        </Menu>
    )
}
