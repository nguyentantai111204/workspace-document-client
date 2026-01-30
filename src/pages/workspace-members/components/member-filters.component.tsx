import { Stack } from '@mui/material'
import { WorkspaceRole } from '../../../apis/workspace/workspace.interface'
import { TextFieldSearchComponent } from '../../../components/textfield/text-field-search.component'
import { TextFieldSelectComponent } from '../../../components/textfield/text-field-select.component'

interface MemberFiltersProps {
    onSearchChange: (value: string) => void
    roleFilter: WorkspaceRole | ''
    onRoleFilterChange: (value: WorkspaceRole | '') => void
}

const ROLE_OPTIONS = [
    { value: '', label: 'Tất cả vai trò' },
    { value: WorkspaceRole.ADMIN, label: 'Admin' },
    { value: WorkspaceRole.MEMBER, label: 'Editor' },
    { value: WorkspaceRole.VIEWER, label: 'Viewer' },
]

export const MemberFilters = ({
    onSearchChange,
    roleFilter,
    onRoleFilterChange
}: MemberFiltersProps) => {
    return (
        <Stack direction="row" spacing={2}>
            <TextFieldSearchComponent
                placeholder="Tìm kiếm theo tên hoặc email..."
                onChange={onSearchChange}
                maxWidth={400}
            />
            <TextFieldSelectComponent
                value={roleFilter}
                onChange={(e) => onRoleFilterChange(e.target.value as WorkspaceRole | '')}
                options={ROLE_OPTIONS}
                sizeUI="sm"
            />
        </Stack>
    )
}
