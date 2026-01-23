import type { Theme, Components } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import SvgIcon from '@mui/material/SvgIcon'


const MuiBackdrop: Components<Theme>['MuiBackdrop'] = {
    styleOverrides: {
        root: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.grey[900], 0.8),
        }),
        invisible: {
            background: 'transparent',
        },
    },
}


const MuiButton: Components<Theme>['MuiButton'] = {
    defaultProps: {
        disableElevation: true,
    },
    styleOverrides: {
        containedInherit: ({ theme }) => ({
            color: theme.palette.common.white,
            backgroundColor: theme.palette.grey[800],
            '&:hover': {
                backgroundColor: theme.palette.grey[700],
            },
        }),
        sizeLarge: {
            minHeight: 48,
        },
    },
}


const MuiCard: Components<Theme>['MuiCard'] = {
    styleOverrides: {
        root: ({ theme }) => ({
            position: 'relative',
            zIndex: 0,
            borderRadius: Number(theme.shape.borderRadius) * 2,
            boxShadow: theme.shadows[3],
        }),
    },
}


const MuiCardHeader: Components<Theme>['MuiCardHeader'] = {
    defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: { variant: 'body2' },
    },
    styleOverrides: {
        root: ({ theme }) => ({
            padding: theme.spacing(3, 3, 0),
        }),
    },
}


const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
    styleOverrides: {
        notchedOutline: ({ theme }) => ({
            borderColor: theme.palette.divider,
        }),
    },
}


const MuiPaper: Components<Theme>['MuiPaper'] = {
    defaultProps: {
        elevation: 0,
    },
    styleOverrides: {
        root: {
            backgroundImage: 'none',
        },
        outlined: ({ theme }) => ({
            borderColor: theme.palette.divider,
        }),
    },
}


const MuiTableCell: Components<Theme>['MuiTableCell'] = {
    styleOverrides: {
        head: ({ theme }) => ({
            fontSize: theme.typography.pxToRem(14),
            fontWeight: 600,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : theme.palette.grey[100],
        }),
    },
}


const MuiMenuItem: Components<Theme>['MuiMenuItem'] = {
    styleOverrides: {
        root: ({ theme }) => ({
            ...theme.typography.body2,
        }),
    },
}


const MuiLink: Components<Theme>['MuiLink'] = {
    defaultProps: {
        underline: 'hover',
    },
}


const MuiFormControlLabel: Components<Theme>['MuiFormControlLabel'] = {
    styleOverrides: {
        label: ({ theme }) => ({
            ...theme.typography.body2,
        }),
    },
}


const MuiCheckbox: Components<Theme>['MuiCheckbox'] = {
    defaultProps: {
        size: 'small',
        icon: (
            <SvgIcon>
                <path d="M17.9 2.318A5 5 0 0 1 22.895 7.1v10a5 5 0 0 1-5 5h-10a5 5 0 0 1-5-5v-10a5 5 0 0 1 5-5h10Z" />
            </SvgIcon>
        ),
        checkedIcon: (
            <SvgIcon>
                <path d="M9 12.5 11.5 15 16 9.5" stroke="currentColor" strokeWidth={2} fill="none" />
            </SvgIcon>
        ),
    },
}


const MuiRadio: Components<Theme>['MuiRadio'] = {
    defaultProps: {
        size: 'small',
    },
}


export const components: Components<Theme> = {
    MuiCard,
    MuiLink,
    MuiPaper,
    MuiRadio,
    MuiButton,
    MuiBackdrop,
    MuiMenuItem,
    MuiCheckbox,
    MuiTableCell,
    MuiCardHeader,
    MuiOutlinedInput,
    MuiFormControlLabel,
}
