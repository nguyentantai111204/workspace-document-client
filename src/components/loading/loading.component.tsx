import { CircularProgress, type SxProps, type Theme } from '@mui/material'
import { FONT_SIZE_LOADING } from '../../common/constant/style.constant'
import { StackRowAlignCenterJustCenter } from '../mui-custom/stack/stack.mui-custom'

export interface LoadingComponentProps {
    color?: string
    size: 'large' | 'small' | 'medium'
    sx?: SxProps<Theme>
}

export const LoadingComponent: React.FC<LoadingComponentProps> = ({ color, size = 'medium', sx = {} }) => {
    return (
        <StackRowAlignCenterJustCenter sx={{ ...sx, flex: 1 }}>
            <CircularProgress size={FONT_SIZE_LOADING[size]} sx={{ color }} />
        </StackRowAlignCenterJustCenter>
    )
}
