import { Typography, IconButton, alpha, useTheme, useMediaQuery, Chip } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { TableComponent } from '../../../components/table/table.component'
import { UserItemComponent } from '../../../components/user/user-item.component'
import { TableColumn } from '../../../components/table/table.interface'
import { MemberResponse, WorkspaceRole } from '../../../apis/workspace/workspace.interface'
import React, { useState } from 'react'
import { MemberActionMenu } from '../components/member-action-menu.component'
import { WORKSPACE_ROLE_CONFIG } from '../constants'

interface MemberListProps {
    members: MemberResponse[]
    onUpdateRole: (member: MemberResponse, role: WorkspaceRole) => void
    onDelete: (member: MemberResponse) => void
}


const MemberActionCell = ({
    member,
    onUpdateRole,
    onDelete
}: {
    member: MemberResponse
    onUpdateRole: (member: MemberResponse, role: WorkspaceRole) => void
    onDelete: (member: MemberResponse) => void
}) => {
    const theme = useTheme()
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setMenuAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setMenuAnchorEl(null)
    }

    return (
        <React.Fragment>
            <IconButton
                size="small"
                onClick={handleOpenMenu}
                sx={{
                    color: 'text.secondary',
                    '&:hover': {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.08)
                    }
                }}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <MemberActionMenu
                anchorEl={menuAnchorEl}
                onClose={handleCloseMenu}
                member={member}
                onUpdateRole={onUpdateRole}
                onDelete={onDelete}
            />
        </React.Fragment>
    )
}

export const MemberList = ({ members, onUpdateRole, onDelete }: MemberListProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const columns: TableColumn<MemberResponse>[] = [
        {
            id: 'member',
            label: 'THÀNH VIÊN',
            minWidth: isMobile ? 140 : 250,
            render: (member) => (
                <UserItemComponent
                    avatarUrl={member.avatarUrl}
                    fullName={member.fullName}
                    email={member.email}
                />
            )
        },
        {
            id: 'role',
            label: 'VAI TRÒ',
            width: isMobile ? 100 : 150,
            render: (member) => {
                const config = WORKSPACE_ROLE_CONFIG[member.role]
                return (
                    <Chip
                        label={config.label}
                        color={config.color}
                        size="small"
                        sx={{
                            fontWeight: 500,
                            fontSize: isMobile ? '0.7rem' : '0.75rem',
                            height: isMobile ? 22 : 24
                        }}
                    />
                )
            }
        },
        ...(!isMobile ? [{
            id: 'joinedAt' as const,
            label: 'NGÀY THAM GIA',
            width: 150,
            render: (member: MemberResponse) => (
                <Typography variant="body2" color="text.secondary">
                    {new Date(member.joinedAt).toLocaleDateString('vi-VN')}
                </Typography>
            )
        }] : []),
        {
            id: 'actions',
            label: '',
            align: 'right' as const,
            width: isMobile ? 60 : 80,
            render: (member) => (
                <MemberActionCell
                    member={member}
                    onUpdateRole={onUpdateRole}
                    onDelete={onDelete}
                />
            )
        }
    ]

    return (
        <TableComponent
            data={members}
            columns={columns}
        />
    )
}
