import { Box, InputBase, alpha, useTheme } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface SearchFieldComponentProps {
    placeholder?: string
    onChange?: (value: string) => void
    maxWidth?: number | string
}

export const TextFieldSearchComponent = ({
    placeholder = 'Tìm kiếm...',
    onChange,
    maxWidth = 500,
}: SearchFieldComponentProps) => {
    const theme = useTheme()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value)
    }

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                maxWidth: { xs: '100%', md: maxWidth },
                mx: { md: 2 },
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    borderRadius: Number(theme.shape.borderRadius) / 5,
                    bgcolor: (theme) => alpha(
                        theme.palette.grey[500],
                        theme.palette.mode === 'dark' ? 0.1 : 0.08
                    ),
                    '&:hover': {
                        bgcolor: (theme) => alpha(
                            theme.palette.grey[500],
                            theme.palette.mode === 'dark' ? 0.15 : 0.12
                        ),
                    },
                    width: '100%',
                    transition: theme.transitions.create(['background-color']),
                }}
            >
                <Box
                    sx={{
                        padding: theme.spacing(0, 2),
                        height: '100%',
                        position: 'absolute',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                </Box>
                <InputBase
                    placeholder={placeholder}
                    onChange={handleChange}
                    sx={{
                        color: 'inherit',
                        width: '100%',
                        '& .MuiInputBase-input': {
                            padding: theme.spacing(1, 1, 1, 0),
                            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                            transition: theme.transitions.create('width'),
                            width: '100%',
                            fontSize: '0.875rem',
                        },
                    }}
                />
            </Box>
        </Box>
    )
}
