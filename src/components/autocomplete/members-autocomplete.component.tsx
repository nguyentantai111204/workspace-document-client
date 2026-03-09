import React from 'react'
import { Autocomplete, Box, Avatar, Chip } from '@mui/material'
import { TextFieldComponent } from '../textfield/text-field.component'
import { StackRowAlignCenterJustCenter } from '../mui-custom/stack/stack.mui-custom'

interface Member {
    userId: string
    fullName?: string
    email?: string
    avatarUrl?: string | null
}

interface MembersAutocompleteComponentProps {
    members: Member[]
    loading: boolean
    value: string[]
    onChange: (newValue: string[]) => void
    error?: boolean
    helperText?: string | false
    placeholder?: string
}

export const MembersAutocompleteComponent: React.FC<MembersAutocompleteComponentProps> = ({
    members,
    loading,
    value,
    onChange,
    error,
    helperText,
    placeholder = 'Chọn người tham gia...'
}) => {
    const selectedMembers = members.filter(m => value.includes(m.userId))

    return (
        <Autocomplete
            multiple
            size="small"
            options={members}
            loading={loading}
            getOptionLabel={(option) => option.fullName || option.email || ''}
            isOptionEqualToValue={(option, val) => option.userId === val.userId}
            value={selectedMembers}
            onChange={(_, newValue) => {
                onChange(newValue.map(v => v.userId))
            }}
            renderOption={(props, option) => {
                const { key, ...liProps } = props as any
                return (
                    <Box component="li" key={key} {...liProps}>
                        <StackRowAlignCenterJustCenter gap={1}>
                            <Avatar src={option.avatarUrl || undefined} sx={{ width: 24, height: 24 }} />
                            <Box>
                                <Box sx={{ fontSize: 13, fontWeight: 500 }}>{option.fullName}</Box>
                                <Box sx={{ fontSize: 11, color: 'text.secondary', lineHeight: 1 }}>{option.email}</Box>
                            </Box>
                        </StackRowAlignCenterJustCenter>
                    </Box>
                )
            }}
            renderTags={(val, getTagProps) =>
                val.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index })
                    return (
                        <Chip
                            key={key}
                            avatar={<Avatar src={option.avatarUrl || undefined} />}
                            label={option.fullName || option.email}
                            size="small"
                            {...tagProps}
                        />
                    )
                })
            }
            renderInput={(params) => (
                <TextFieldComponent
                    {...params}
                    sizeUI="sm"
                    placeholder={placeholder}
                    error={error}
                    helperText={helperText}
                />
            )}
            sx={{
                '& .MuiOutlinedInput-root': {
                    minHeight: 40,
                    padding: '3px 8px',
                },
            }}
        />
    )
}
