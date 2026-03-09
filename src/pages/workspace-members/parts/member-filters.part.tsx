import { Stack } from '@mui/material'
import { WorkspaceRole } from '../../../apis/workspace/workspace.interface'
import { TextFieldSearchComponent } from '../../../components/textfield/text-field-search.component'
import { TextFieldSelectComponent } from '../../../components/textfield/text-field-select.component'
import { WORKSPACE_ROLE_OPTIONS } from '../constants'

interface MemberFiltersProps {
    onSearchChange: (value: string) => void
    roleFilter: WorkspaceRole | ''
    onRoleFilterChange: (value: WorkspaceRole | '') => void
}


export const MemberFilters = ({
    onSearchChange,
    roleFilter,
    onRoleFilterChange
}: MemberFiltersProps) => {
    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ width: '100%' }}
        >
            <TextFieldSearchComponent
                placeholder="Tìm kiếm theo tên hoặc email..."
                onChange={onSearchChange}
            />
            <TextFieldSelectComponent
                value={roleFilter}
                onChange={(e) => onRoleFilterChange(e.target.value as WorkspaceRole | '')}
                options={WORKSPACE_ROLE_OPTIONS}
                sizeUI="sm"
            />
        </Stack>
    )
}
