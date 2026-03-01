import { useState } from 'react'
import { Box, Button, Stack, Typography, Tooltip } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useWorkspace } from '../../contexts/workspace.context'
import { useWorkspaceMembers } from '../../hooks/use-workspace-member.hook'
import { useDebounce } from '../../hooks/use-debounce.hook'
import { MemberResponse, WorkspaceRole } from '../../apis/workspace/workspace.interface'
import { updateMemberRoleApi } from '../../apis/workspace/workspace.api'
import { useAppDispatch, useAppSelector } from '../../redux/store.redux'
import { showSnackbar } from '../../redux/system/system.slice'
import { InviteMemberDialog } from '../workspace/components/invite-member-dialog.component'
import { MemberList } from './parts/member-list.part'
import { MemberFilters } from './components/member-filters.component'
import { MemberDeleteDialog } from './components/member-delete-dialog.component'
import { PAGE_LIMIT_DEFAULT } from '../../common/constant/page-take.constant'
import { usePagination } from '../../hooks/use-pagination.hook'
import { PaginationComponent } from '../../components/pagination/pagination.component'
import { canInviteMembers } from './utils/member-permissions.util'
import { StackRow } from '../../components/mui-custom/stack/stack.mui-custom'

export const WorkspaceMembersPage = () => {
    const dispatch = useAppDispatch()
    const { currentWorkspace, currentMember } = useWorkspace()
    const currentUser = useAppSelector(state => state.account.user)
    const canInvite = canInviteMembers(currentMember?.role)
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [roleFilter, setRoleFilter] = useState<WorkspaceRole | ''>('')
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<MemberResponse | null>(null)

    const { page, resetPage } = usePagination()

    const { members, meta, mutate } = useWorkspaceMembers(currentWorkspace?.id, {
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
        page,
        limit: PAGE_LIMIT_DEFAULT.limit
    })

    const { paginationProps } = usePagination({ totalPages: meta?.totalPages })

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        resetPage()
    }

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
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Typography>Không tìm thấy workspace</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ flex: 1, overflow: 'hidden', p: { xs: 2, md: 3 } }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                        spacing={{ xs: 2, sm: 0 }}
                        sx={{ mb: 3 }}
                    >
                        <Box>
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                Thành viên
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Quản lý thành viên trong workspace
                            </Typography>
                        </Box>
                        {canInvite && (
                            <Tooltip title={!canInvite ? 'Bạn không có quyền mời thành viên' : ''} arrow>
                                <StackRow>
                                    <Button
                                        variant="contained"
                                        startIcon={<PersonAddIcon />}
                                        onClick={() => setInviteDialogOpen(true)}
                                        disabled={!canInvite}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: { xs: 2, sm: 3 },
                                            borderRadius: 2,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                            Mời thành viên
                                        </Box>
                                        <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                                            Mời
                                        </Box>
                                    </Button>
                                </StackRow>
                            </Tooltip>
                        )}
                    </Stack>

                    {/* Search & Filter */}
                    <Box sx={{ mb: 3 }}>
                        <MemberFilters
                            onSearchChange={handleSearchChange}
                            roleFilter={roleFilter}
                            onRoleFilterChange={setRoleFilter}
                        />
                    </Box>

                    {/* Table */}
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <MemberList
                            members={members}
                            onUpdateRole={handleUpdateRole}
                            onDelete={handleDeleteClick}
                            currentUserRole={currentMember?.role}
                            currentUserId={currentUser?.id}
                        />
                    </Box>

                    {/* Pagination */}
                    {paginationProps && (
                        <PaginationComponent {...paginationProps} />
                    )}
                </Box>
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
