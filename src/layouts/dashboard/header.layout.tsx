import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Stack,
    alpha,
    useTheme,
    Fade,
    InputBase,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import { useAppDispatch } from '../../redux/store.redux'
import { toggleSidebar } from '../../redux/system/system.slice'
import { HEADER_DESKTOP, HEADER_MOBILE, SIDEBAR_WIDTH, TIME_ANIMATION } from '../../common/constant/style.constant'
import { NotificationBellComponent } from '../../components/bell/notification-bell.component'
import { AvatarUserComponent } from '../../components/avatar/avatar-user.component'
import { useThemeMode } from '../../contexts/theme-mode.context'
import { BreadcrumbComponent, type BreadcrumbItem } from '../../components/breadcrumb/breadcrumb.component'

interface HeaderLayoutProps {
    breadcrumbs?: BreadcrumbItem[]
    searchPlaceholder?: string
    onSearch?: (value: string) => void
    showSearch?: boolean
}

export const HeaderLayout = ({
    breadcrumbs = [{ label: 'Dashboard' }],
    searchPlaceholder = 'Tìm kiếm...',
    onSearch,
    showSearch = true,
}: HeaderLayoutProps) => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const { mode, toggleMode } = useThemeMode()

    const headerBgColor = mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.9)
        : alpha(theme.palette.background.default, 0.8)

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch?.(event.target.value)
    }

    return (
        <AppBar
            sx={{
                boxShadow: 'none',
                height: HEADER_MOBILE,
                zIndex: theme.zIndex.appBar + 1,
                backdropFilter: 'blur(6px)',
                bgcolor: headerBgColor,
                color: 'text.primary',
                borderBottom: `1px solid ${theme.palette.divider}`,
                transition: theme.transitions.create(['height', 'background-color', 'border-color'], {
                    duration: theme.transitions.duration.shorter,
                }),
                [theme.breakpoints.up('lg')]: {
                    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
                    height: HEADER_DESKTOP,
                },
            }}
        >
            <Toolbar
                sx={{
                    minHeight: '100% !important',
                    px: { xs: 2, lg: 5 },
                    gap: { xs: 1, md: 2 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <IconButton
                    onClick={() => dispatch(toggleSidebar())}
                    sx={{
                        color: 'text.primary',
                        display: { lg: 'none' },
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }}>
                    <BreadcrumbComponent items={breadcrumbs} />
                </Box>

                {showSearch && (
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            maxWidth: { xs: '100%', md: 500 },
                            mx: { md: 2 },
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                borderRadius: Number(theme.shape.borderRadius) / 5,
                                bgcolor: alpha(theme.palette.grey[500], mode === 'dark' ? 0.1 : 0.08),
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.grey[500], mode === 'dark' ? 0.15 : 0.12),
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
                                placeholder={searchPlaceholder}
                                onChange={handleSearchChange}
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
                )}

                <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
                    <IconButton
                        onClick={toggleMode}
                        sx={{
                            color: 'text.primary',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                            },
                        }}
                        aria-label="Toggle theme mode"
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Fade in={mode === 'light'} timeout={TIME_ANIMATION}>
                                <DarkModeOutlinedIcon
                                    sx={{
                                        position: mode === 'light' ? 'relative' : 'absolute',
                                        transform: mode === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(180deg) scale(0)',
                                        transition: theme.transitions.create(['transform', 'opacity'], {
                                            duration: theme.transitions.duration.standard,
                                        }),
                                    }}
                                />
                            </Fade>
                            <Fade in={mode === 'dark'} timeout={TIME_ANIMATION}>
                                <LightModeIcon
                                    sx={{
                                        position: mode === 'dark' ? 'relative' : 'absolute',
                                        transform: mode === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0)',
                                        transition: theme.transitions.create(['transform', 'opacity'], {
                                            duration: theme.transitions.duration.standard,
                                        }),
                                    }}
                                />
                            </Fade>
                        </Box>
                    </IconButton>

                    <NotificationBellComponent />
                    <AvatarUserComponent />
                </Stack>
            </Toolbar>
        </AppBar>
    )
}
