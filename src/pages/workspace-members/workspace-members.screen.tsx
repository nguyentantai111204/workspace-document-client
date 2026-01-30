import { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useWorkspace } from '../../contexts/workspace.context'
import { useWorkspaceMembers } from '../../hooks/use-workspace-member.hook'
import { MemberResponse, WorkspaceRole } from '../../apis/workspace/workspace.interface'
import { updateMemberRoleApi } from '../../apis/workspace/workspace.api'
import { useAppDispatch } from '../../redux/store.redux'
import { showSnackbar } from '../../redux/system/system.slice'
import { InviteMemberDialog } from '../workspace/components/invite-member-dialog.component'
import { MemberList } from './parts/member-list.part'
import { MemberFilters } from './components/member-filters.component'
import { MemberDeleteDialog } from './components/member-delete-dialog.component'

export const WorkspaceMembersPage = () => {
    const dispatch = useAppDispatch()
    const { currentWorkspace } = useWorkspace()
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<WorkspaceRole | ''>('')
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<MemberResponse | null>(null)

    const { members, mutate } = useWorkspaceMembers(currentWorkspace?.id, {
        search: searchQuery || undefined,
        role: roleFilter || undefined,
    })

    const handleUpdateRole = async (member: MemberResponse, newRole: WorkspaceRole) => {
        if (!currentWorkspace) return

        try {
            await updateMemberRoleApi(currentWorkspace.id, {
                userId: member.userId,
                role: newRole
            })
            await mutate()
            dispatch(showSnackbar({
                message: 'Đã cập nhật vai trò thành công',
                severity: 'success'
            }))
        } catch (error) {
            dispatch(showSnackbar({
                message: 'Không thể cập nhật vai trò',
                severity: 'error'
            }))
        }
    }

    const handleDeleteClick = (member: MemberResponse) => {
        setSelectedMember(member)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!currentWorkspace || !selectedMember) return

        try {
            // TODO: Add remove member API
            // await removeMemberApi(currentWorkspace.id, selectedMember.userId)
            await mutate()
            dispatch(showSnackbar({
                message: 'Đã xóa thành viên',
                severity: 'success'
            }))
        } catch (error) {
            dispatch(showSnackbar({
                message: 'Không thể xóa thành viên',
                severity: 'error'
            }))
        } finally {
            setDeleteDialogOpen(false)
            setSelectedMember(null)
        }
    }

    if (!currentWorkspace) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Không tìm thấy workspace</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Thành viên
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Quản lý thành viên trong workspace
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setInviteDialogOpen(true)}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        borderRadius: 2
                    }}
                >
                    Mời thành viên
                </Button>
            </Stack>

            {/* Search & Filter */}
            <Box sx={{ mb: 3 }}>
                <MemberFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    roleFilter={roleFilter}
                    onRoleFilterChange={setRoleFilter}
                />
            </Box>

            {/* Table */}
            <Box sx={{ flex: 1 }}>
                <MemberList
                    members={members}
                    onUpdateRole={handleUpdateRole}
                    onDelete={handleDeleteClick}
                />
            </Box>

            {/* Delete Confirmation Dialog */}
            <MemberDeleteDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                member={selectedMember}
                onConfirm={handleDeleteConfirm}
            />

            {/* Invite Dialog */}
            <InviteMemberDialog
                open={inviteDialogOpen}
                onClose={() => setInviteDialogOpen(false)}
                workspaceId={currentWorkspace.id}
                onSuccess={() => mutate()}
            />
        </Box>
    )
}
