import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import React from 'react'

export type TextFieldDateTimeProps = React.ComponentProps<typeof DateTimePicker> & {
    error?: boolean
    errorMessage?: string
    sizeUI?: 'sm' | 'md'
}

export const TextFieldDateTimeComponent = ({
    error,
    errorMessage,
    sizeUI = 'md',
    sx,
    ...rest
}: TextFieldDateTimeProps) => {
    const isError = Boolean(error || errorMessage)
    const isSmall = sizeUI === 'sm'

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                {...rest}
                slotProps={{
                    ...rest.slotProps,
                    textField: {
                        error: isError,
                        helperText: errorMessage,
                        fullWidth: true,
                        size: isSmall ? 'small' : 'medium',
                        sx: {
                            ...(isSmall && {
                                '& .MuiOutlinedInput-root': {
                                    minHeight: 40,
                                    fontSize: 13,
                                },
                                '& .MuiInputBase-input': {
                                    fontSize: 13,
                                    fontWeight: 400,
                                    padding: '8.5px 14px',
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
                            ...sx,
                        },
                    }
                }}
            />
        </LocalizationProvider>
    )
}
