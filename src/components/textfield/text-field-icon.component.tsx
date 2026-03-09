import { InputAdornment } from '@mui/material'
import type { ReactNode } from 'react'
import {
    TextFieldComponent,
    type TextFieldComponentProps,
} from './text-field.component'
import { StackRowAlignCenter } from '../mui-custom/stack/stack.mui-custom'

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
                            <StackRowAlignCenter
                                sx={{
                                    color: 'text.secondary',
                                }}
                            >
                                {startIcon}
                            </StackRowAlignCenter>
                        </InputAdornment>
                    ),
                }),
                ...(endIcon && {
                    endAdornment: (
                        <InputAdornment position="end">
                            <StackRowAlignCenter
                                onClick={onEndIconClick}
                                sx={{
                                    color: 'text.secondary',
                                    cursor: onEndIconClick
                                        ? 'pointer'
                                        : 'default',
                                }}
                            >
                                {endIcon}
                            </StackRowAlignCenter>
                        </InputAdornment>
                    ),
                }),
                ...InputProps,
            }}
        />
    )
}
