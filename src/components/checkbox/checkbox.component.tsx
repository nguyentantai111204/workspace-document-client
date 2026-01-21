import {
    Box,
    Checkbox,
    Typography,
    SvgIcon,
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

interface CheckboxComponentProps {
    label?: string
    shape?: CheckboxShape
    variant?: CheckboxVariant
    iconType?: CheckboxIconType
    indeterminate?: boolean
    checked?: boolean
    disabled?: boolean
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    sizeUI?: 'sm' | 'md'
}

const CheckIcon = () => (
    <SvgIcon fontSize="inherit">
        <path d="M9.5 16.5L5 12l1.4-1.4 3.1 3.1 7.1-7.1L18 8z" />
    </SvgIcon>
)

const MinusIcon = () => (
    <SvgIcon fontSize="inherit">
        <rect x="5" y="11" width="14" height="2" rx="1" />
    </SvgIcon>
)

const DotIcon = () => (
    <SvgIcon fontSize="inherit">
        <circle cx="12" cy="12" r="4" />
    </SvgIcon>
)

const renderIcon = (type: CheckboxIconType) => {
    if (type === 'minus') return <MinusIcon />
    if (type === 'dot') return <DotIcon />
    return <CheckIcon />
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
    const radius = getBorderRadius(shape)
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
        <Box
            sx={{
                ...getIconSx(theme, variant, radius),
                width: size,
                height: size,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: sizeUI === 'sm' ? 14 : 16,
            }}
        >
            {renderIcon(iconType)}
        </Box>
    )

    return (
        <Box display="flex" alignItems="center">
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
                    onClick={(e) =>
                        props.onChange?.(
                            e as unknown as React.ChangeEvent<HTMLInputElement>
                        )
                    }
                >
                    {label}
                </Typography>
            )}
        </Box>
    )
}
