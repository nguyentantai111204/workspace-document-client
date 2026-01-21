import { InputAdornment, Box } from '@mui/material'
import type { ReactNode } from 'react'
import {
    TextFieldComponent,
    type TextFieldComponentProps,
} from './text-field.component'

export type TextFieldIconProps = TextFieldComponentProps & {
    startIcon?: ReactNode
    endIcon?: ReactNode
    onEndIconClick?: () => void
}

export const TextFieldIconComponent = ({
    startIcon,
    endIcon,
    onEndIconClick,
    InputProps,
    ...rest
}: TextFieldIconProps) => {
    return (
        <TextFieldComponent
            {...rest}
            InputProps={{
                ...(startIcon && {
                    startAdornment: (
                        <InputAdornment position="start">
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'text.secondary',
                                }}
                            >
                                {startIcon}
                            </Box>
                        </InputAdornment>
                    ),
                }),
                ...(endIcon && {
                    endAdornment: (
                        <InputAdornment position="end">
                            <Box
                                onClick={onEndIconClick}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'text.secondary',
                                    cursor: onEndIconClick
                                        ? 'pointer'
                                        : 'default',
                                }}
                            >
                                {endIcon}
                            </Box>
                        </InputAdornment>
                    ),
                }),
                ...InputProps,
            }}
        />
    )
}
