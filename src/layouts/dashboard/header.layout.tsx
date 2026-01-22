import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Stack,
    Avatar,
    Badge,
    alpha,
    useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useAppDispatch } from '../../redux/store.redux'
import { toggleSidebar } from '../../redux/system/system.slice'
import { HEADER_DESKTOP, HEADER_MOBILE, SIDEBAR_WIDTH } from '../../common/constant/style.constant'
import { NotificationBellComponent } from '../../components/bell/notification-bell.component'
import { AvatarUserComponent } from '../../components/avatar/avatar-user.component'


export const HeaderLayout = () => {
    const theme = useTheme()
    const dispatch = useAppDispatch()

    return (
        <AppBar
            sx={{
                boxShadow: 'none',
                height: HEADER_MOBILE,
                zIndex: theme.zIndex.appBar + 1,
                backdropFilter: 'blur(6px)',
                bgcolor: alpha(theme.palette.background.default, 0.8),
                color: 'text.primary',
                transition: theme.transitions.create(['height'], {
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
                    px: { lg: 5 },
                }}
            >
                <IconButton
                    onClick={() => dispatch(toggleSidebar())}
                    sx={{
                        mr: 1,
                        color: 'text.primary',
                        display: { lg: 'none' },
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <IconButton sx={{ color: 'text.primary' }}>
                    <SearchIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }} gap={1} >
                    <NotificationBellComponent />
                    <AvatarUserComponent />
                </Stack>
            </Toolbar>
        </AppBar>
    )
}
