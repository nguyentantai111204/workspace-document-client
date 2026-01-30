import { Navigate, RouteObject } from 'react-router-dom'
import FolderIcon from '@mui/icons-material/Folder'
import PeopleIcon from '@mui/icons-material/People'
import { WorkspacePage } from '../pages/workspace/workspace.screen'
import { ProfilePage } from '../pages/user/user-profile.screen'
import { WorkspaceMembersPage } from '../pages/workspace-members/workspace-members.screen'

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
        ]
    },
    {
        path: 'profile',
        element: <ProfilePage />,
    },
]
