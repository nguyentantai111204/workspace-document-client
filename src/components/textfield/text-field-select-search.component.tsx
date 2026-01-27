import { useState, useEffect } from 'react'
import { Autocomplete, TextField, CircularProgress, Box, Typography, type AutocompleteProps } from '@mui/material'
import { searchUsersApi } from '../../apis/user/user.api'
import { useDebounce } from '../../hooks/useDebounce'
import { UserResponse } from '../../apis/user/user.interface'
import { PAGE_LIMIT_DEFAULT } from '../../common/constant/page-take.constant'

export interface TextFieldSelectSearchComponentProps extends Omit<AutocompleteProps<UserResponse, false, false, false>, 'options' | 'renderInput' | 'size'> {
    label?: string
    placeholder?: string
    sizeUI?: 'sm' | 'md'
    errorMessage?: string
    onSelectUser?: (user: UserResponse | null) => void
}

export const TextFieldSelectSearchComponent = ({
    label,
    placeholder = 'Tìm kiếm theo email...',
    sizeUI = 'md',
    errorMessage,
    onSelectUser,
    sx,
    ...rest
}: TextFieldSelectSearchComponentProps) => {
    const [inputValue, setInputValue] = useState('')
    const [options, setOptions] = useState<UserResponse[]>([])
    const [loading, setLoading] = useState(false)
    const debouncedSearchTerm = useDebounce(inputValue, 500)

    const isSmall = sizeUI === 'sm'
    const size = isSmall ? 'small' : 'medium'

    useEffect(() => {
        const fetchUsers = async () => {
            if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
                setOptions([])
                return
            }

            setLoading(true)
            try {
                const results = await searchUsersApi({ email: debouncedSearchTerm, ...PAGE_LIMIT_DEFAULT })
                setOptions(Array.isArray(results) ? results : [])
            } catch (error) {
                console.error('Error searching users:', error)
                setOptions([])
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [debouncedSearchTerm])

    return (
        <Autocomplete
            {...rest}
            options={options}
            loading={loading}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue)
            }}
            onChange={(_, newValue) => {
                onSelectUser?.(newValue)
            }}
            getOptionLabel={(option) => option.email}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={
                inputValue.length < 2
                    ? 'Nhập ít nhất 2 ký tự để tìm kiếm'
                    : loading
                        ? 'Đang tìm kiếm...'
                        : 'Không tìm thấy người dùng'
            }
            renderOption={(props, option) => {
                const { key, ...liProps } = props as any
                return (
                    <Box
                        key={key}
                        component="li"
                        {...liProps}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}
                    >
                        {option.avatarUrl ? (
                            <Box
                                component="img"
                                src={option.avatarUrl}
                                sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'common.white', fontSize: 14 }}>
                                {option.fullName.charAt(0).toUpperCase()}
                            </Box>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={500} noWrap>
                                {option.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {option.email}
                            </Typography>
                        </Box>
                    </Box>
                )
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    error={!!errorMessage}
                    helperText={errorMessage}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            size={size}
            sx={{
                ...(isSmall && {
                    '& .MuiOutlinedInput-root': {
                        minHeight: 40,
                        fontSize: 13,
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: 13,
                    },
                    '& .MuiFormHelperText-root': {
                        fontSize: 11,
                        marginLeft: 0,
                    },
                }),
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.main',
                },
                ...sx,
            }}
        />
    )
}
