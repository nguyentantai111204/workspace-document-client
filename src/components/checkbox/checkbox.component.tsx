import {
    Box,
    Checkbox,
    Typography,
    useTheme,
} from '@mui/material'
import {
    CHECKBOX_SIZE,
    getBorderRadius,
    getIconSx,
    type CheckboxIconType,
    type CheckboxShape,
    type CheckboxVariant,
} from './checkbox.constant'
import { StackRowAlignCenterJustCenter } from '../mui-custom/stack/stack.mui-custom'

interface CheckboxComponentProps {
    label?: React.ReactNode
    shape?: CheckboxShape
    variant?: CheckboxVariant
    iconType?: CheckboxIconType
    indeterminate?: boolean
    checked?: boolean
    disabled?: boolean
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    sizeUI?: 'sm' | 'md'
}

import CheckIcon from '@mui/icons-material/Check'
import RemoveIcon from '@mui/icons-material/Remove'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

const renderIcon = (type: CheckboxIconType) => {
    if (type === 'minus') return <RemoveIcon fontSize="inherit" />
    if (type === 'dot') return <FiberManualRecordIcon fontSize="inherit" sx={{ fontSize: '0.6em' }} />
    return <CheckIcon fontSize="inherit" />
}

export const CheckboxComponent = ({
    label,
    shape = 'square',
    variant = 'filled',
    iconType = 'check',
    sizeUI = 'md',
    ...props
}: CheckboxComponentProps) => {
    const theme = useTheme()
    const radius = getBorderRadius(shape, theme)
    const size = CHECKBOX_SIZE[sizeUI]

    const baseIcon = (
        <Box
            sx={{
                ...getIconSx(theme, variant, radius),
                width: size,
                height: size,
            }}
        />
    )

    const checkedIcon = (
        <StackRowAlignCenterJustCenter
            sx={{
                ...getIconSx(theme, variant, radius),
                width: size,
                height: size,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderColor: theme.palette.primary.main,
                fontSize: sizeUI === 'sm' ? 14 : 16,
            }}
        >
            {renderIcon(iconType)}
        </StackRowAlignCenterJustCenter>
    )

    return (
        <StackRowAlignCenterJustCenter>
            <Checkbox
                disableRipple
                icon={baseIcon}
                checkedIcon={checkedIcon}
                indeterminateIcon={checkedIcon}
                slotProps={{
                    root: {
                        sx: {
                            p: 0.5,
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        },
                    },
                }}
                {...props}
            />

            {label && (
                <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                        ml: 1,
                        cursor: 'pointer',
                        fontSize: sizeUI === 'sm' ? 13 : undefined,
                    }}
                >
                    {label}
                </Typography>
            )}
        </StackRowAlignCenterJustCenter>
    )
}
