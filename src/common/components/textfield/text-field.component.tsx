import { TextField, type TextFieldProps } from '@mui/material'

export type TextFieldComponentProps = TextFieldProps & {
    errorMessage?: string
    sizeUI?: 'sm' | 'md'
}

export const TextFieldComponent = ({
    error,
    errorMessage,
    helperText,
    sx,
    variant = 'outlined',
    sizeUI = 'md',
    ...rest
}: TextFieldComponentProps) => {
    const isError = Boolean(error || errorMessage)
    const isSmall = sizeUI === 'sm'

    return (
        <TextField
            fullWidth
            variant={variant}
            error={isError}
            helperText={errorMessage || helperText}
            size={isSmall ? 'small' : 'medium'}
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
                '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.main',
                },
                ...sx,
            }}
            {...rest}
        />
    )
}
