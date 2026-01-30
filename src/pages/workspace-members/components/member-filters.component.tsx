import { Stack, TextField, MenuItem } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { WorkspaceRole } from '../../../apis/workspace/workspace.interface'

interface MemberFiltersProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    roleFilter: WorkspaceRole | ''
    onRoleFilterChange: (value: WorkspaceRole | '') => void
}

export const MemberFilters = ({
    searchQuery,
    onSearchChange,
    roleFilter,
    onRoleFilterChange
}: MemberFiltersProps) => {
    return (
        <Stack direction="row" spacing={2}>
            <TextField
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                size="small"
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
                sx={{
                    flex: 1,
                    maxWidth: 400,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                    }
                }}
            />
            <TextField
                select
                value={roleFilter}
                onChange={(e) => onRoleFilterChange(e.target.value as WorkspaceRole | '')}
                size="small"
                sx={{
                    minWidth: 150,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                    }
                }}
            >
                <MenuItem value="">Tất cả vai trò</MenuItem>
                <MenuItem value={WorkspaceRole.ADMIN}>Admin</MenuItem>
                <MenuItem value={WorkspaceRole.MEMBER}>Editor</MenuItem>
                <MenuItem value={WorkspaceRole.VIEWER}>Viewer</MenuItem>
            </TextField>
        </Stack>
    )
}
