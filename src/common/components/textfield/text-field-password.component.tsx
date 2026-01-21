// components/textfield/password-field.component.tsx
import { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
    TextFieldIconComponent,
    type TextFieldIconProps,
} from './text-field-icon.component'

export const TextFieldPasswordComponent = (props: TextFieldIconProps) => {
    const [show, setShow] = useState(false)

    return (
        <TextFieldIconComponent
            {...props}
            type={show ? 'text' : 'password'}
            endIcon={
                show ? (
                    <VisibilityOffIcon fontSize="small" />
                ) : (
                    <VisibilityIcon fontSize="small" />
                )
            }
            onEndIconClick={() => setShow((v) => !v)}
        />
    )
}
