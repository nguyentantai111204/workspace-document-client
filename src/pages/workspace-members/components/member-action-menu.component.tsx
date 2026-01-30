import { Menu, MenuItem, Divider } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { MemberResponse, WorkspaceRole } from '../../../apis/workspace/workspace.interface'

interface MemberActionMenuProps {
    anchorEl: HTMLElement | null
    onClose: () => void
    member: MemberResponse
    onUpdateRole: (member: MemberResponse, role: WorkspaceRole) => void
    onDelete: (member: MemberResponse) => void
}

export const MemberActionMenu = ({
    anchorEl,
    onClose,
    member,
    onUpdateRole,
    onDelete
}: MemberActionMenuProps) => {
    const handleUpdateRole = (role: WorkspaceRole) => {
        onUpdateRole(member, role)
        onClose()
    }

    const handleDelete = () => {
        onDelete(member)
        onClose()
    }

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MenuItem onClick={() => handleUpdateRole(WorkspaceRole.ADMIN)}>
                Đặt làm Admin
            </MenuItem>
            <MenuItem onClick={() => handleUpdateRole(WorkspaceRole.MEMBER)}>
                Đặt làm Editor
            </MenuItem>
            <MenuItem onClick={() => handleUpdateRole(WorkspaceRole.VIEWER)}>
                Đặt làm Viewer
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={handleDelete}
                sx={{ color: 'error.main' }}
            >
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Xóa thành viên
            </MenuItem>
        </Menu>
    )
}
