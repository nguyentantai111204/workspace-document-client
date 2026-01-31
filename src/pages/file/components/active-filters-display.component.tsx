import { Stack, Chip, Button, Box, useTheme, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { FilterChipData } from '../utils/filter.utils'

interface ActiveFiltersDisplayProps {
    chips: FilterChipData[]
    onRemoveChip: (chip: FilterChipData) => void
    onClearAll: () => void
}

export const ActiveFiltersDisplay = ({ chips, onRemoveChip, onClearAll }: ActiveFiltersDisplayProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    if (chips.length === 0) return null

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
                mb: 2,
                p: 1.5,
                bgcolor: theme.palette.action.hover,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    flex: 1,
                    flexWrap: 'wrap',
                    gap: 1
                }}
            >
                {chips.map((chip) => (
                    <Chip
                        key={chip.key}
                        label={chip.label}
                        size={isMobile ? 'small' : 'medium'}
                        onDelete={() => onRemoveChip(chip)}
                        deleteIcon={<CloseIcon />}
                        sx={{
                            bgcolor: 'background.paper',
                            borderColor: 'divider',
                            '& .MuiChip-deleteIcon': {
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'error.main'
                                }
                            }
                        }}
                        variant="outlined"
                    />
                ))}
            </Stack>

            <Button
                size="small"
                onClick={onClearAll}
                sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    px: 1.5,
                    '&:hover': {
                        color: 'error.main',
                        bgcolor: theme.palette.error.light + '14' 
                    }
                }}
            >
                Xóa tất cả
            </Button>
        </Box>
    )
}
