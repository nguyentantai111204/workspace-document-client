import { FormControl, Select, MenuItem, InputLabel, type SelectProps } from '@mui/material'

export interface SelectOption {
    value: string | number
    label: string
}

export interface TextFieldSelectComponentProps extends Omit<SelectProps, 'size'> {
    label?: string
    options: SelectOption[]
    sizeUI?: 'sm' | 'md'
    errorMessage?: string
}

export const TextFieldSelectComponent = ({
    label,
    options,
    sizeUI = 'md',
    errorMessage,
    sx,
    ...rest
}: TextFieldSelectComponentProps) => {
    const isSmall = sizeUI === 'sm'
    const size = isSmall ? 'small' : 'medium'

    return (
        <FormControl
            size={size}
            error={!!errorMessage}
            sx={{
                minWidth: 150,
                ...(isSmall && {
                    '& .MuiOutlinedInput-root': {
                        minHeight: 40,
                        fontSize: 13,
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: 13,
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
        >
            {label && <InputLabel>{label}</InputLabel>}
            <Select
                label={label}
                {...rest}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
