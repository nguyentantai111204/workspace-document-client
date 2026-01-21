import { alpha } from '@mui/material/styles'

export const withAlpha = (color: string, opacity: number): string =>
    alpha(color, opacity)
