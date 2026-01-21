import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'

// row
export const StackRow = styled(Stack)(() => ({
    display: 'flex',
    flexDirection: 'row',
}))

export const StackRowAlignCenter = styled(StackRow)(() => ({
    alignItems: 'center',
}))

export const StackRowAlignStart = styled(StackRow)(() => ({
    alignItems: 'flex-start',
}))

export const StackRowAlignEnd = styled(StackRow)(() => ({
    alignItems: 'flex-end',
}))

export const StackRowAlignCenterJustBetween = styled(StackRowAlignCenter)(() => ({
    justifyContent: 'space-between',
}))

export const StackRowAlignCenterJustCenter = styled(StackRowAlignCenter)(() => ({
    justifyContent: 'center',
}))

export const StackRowAlignStartJustBetween = styled(StackRowAlignStart)(() => ({
    justifyContent: 'space-between',
}))

export const StackRowAlignStartJustCenter = styled(StackRowAlignStart)(() => ({
    justifyContent: 'center',
}))

export const StackRowAlignCenterJustEnd = styled(StackRowAlignCenter)(() => ({
    justifyContent: 'flex-end',
}))


// column
export const StackColumn = styled(Stack)(() => ({
    display: 'flex',
    flexDirection: 'column',
}))

export const StackColumnAlignCenter = styled(StackColumn)(() => ({
    alignItems: 'center',
}))

export const StackColumnAlignStart = styled(StackColumn)(() => ({
    alignItems: 'flex-start',
}))

export const StackColumnAlignCenterJustCenter = styled(StackColumnAlignCenter)(() => ({
    justifyContent: 'center',
}))

export const StackColumnAlignCenterJustStart = styled(StackColumnAlignCenter)(() => ({
    justifyContent: 'flex-start',
}))

export const StackColumnAlignCenterJustBetween = styled(StackColumnAlignCenter)(() => ({
    justifyContent: 'space-between',
}))
