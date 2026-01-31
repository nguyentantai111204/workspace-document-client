import { Navigate, RouteObject } from 'react-router-dom'
import FolderIcon from '@mui/icons-material/Folder'
import PeopleIcon from '@mui/icons-material/People'
import ChatIcon from '@mui/icons-material/Chat'
import { WorkspacePage } from '../pages/workspace/workspace.screen'
import { ProfilePage } from '../pages/user/user-profile.screen'
import { WorkspaceMembersPage } from '../pages/workspace-members/workspace-members.screen'
import { WorkspaceChatPage } from '../pages/workspace-chat/workspace-chat.screen'

export const mainRoutes: RouteObject[] = [
    {
        index: true,
        element: <Navigate to="/workspace" replace />,
    },
    {
        path: 'workspace',
        handle: {
            title: 'Dự án',
            icon: <FolderIcon />,
        },
        children: [
            {
                index: true,
                element: <WorkspacePage />,
            },
            {
                path: ':workspaceId',
                element: <WorkspacePage />,
            },
            {
                path: ':workspaceId/members',
                element: <WorkspaceMembersPage />,
                handle: {
                    title: 'Thành viên',
                    icon: <PeopleIcon />
                }
            },
            {
                path: ':workspaceId/chat',
                element: <WorkspaceChatPage />,
                handle: {
                    title: 'Trò chuyện',
                    icon: <ChatIcon />
                }
            },
        ]
    },
    {
        path: 'profile',
        element: <ProfilePage />,
    },
]
