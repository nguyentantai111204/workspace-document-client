import {
    FormControl,
    FormLabel,
    RadioGroup as MuiRadioGroup,
    FormControlLabel,
    Radio,
    FormHelperText,
    RadioGroupProps as MuiRadioGroupProps
} from '@mui/material'

export interface RadioOption {
    value: string
    label: string
    disabled?: boolean
}

export interface RadioGroupComponentProps extends Omit<MuiRadioGroupProps, 'onChange'> {
    label?: string
    options: RadioOption[]
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void
    error?: boolean
    helperText?: string
    direction?: 'row' | 'column'
    sizeUI?: 'sm' | 'md'
}

export const RadioGroupComponent = ({
    label,
    options,
    value,
    onChange,
    error,
    helperText,
    direction = 'column',
    sizeUI = 'md',
    sx,
    ...rest
}: RadioGroupComponentProps) => {
    // const theme = useTheme()

    return (
        <FormControl error={error} component="fieldset" fullWidth>
            {label && (
                <FormLabel
                    component="legend"
                    sx={{
                        mb: 0.5,
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'text.primary',
                        '&.Mui-focused': { color: 'text.primary' }
                    }}
                >
                    {label}
                </FormLabel>
            )}
            <MuiRadioGroup
                row={direction === 'row'}
                value={value}
                onChange={onChange}
                {...rest}
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio size={sizeUI === 'sm' ? 'small' : 'medium'} />}
                        label={option.label}
                        disabled={option.disabled}
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontSize: sizeUI === 'sm' ? 14 : 16
                            }
                        }}
                    />
                ))}
            </MuiRadioGroup>
            {helperText && (
                <FormHelperText>{helperText}</FormHelperText>
            )}
        </FormControl>
    )
}
