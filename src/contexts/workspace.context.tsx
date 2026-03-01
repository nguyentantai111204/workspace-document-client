import React, { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createWorkspaceApi, updateWorkspaceApi } from '../apis/workspace/workspace.api'
import { CreateWorkspaceRequest, MemberResponse, UpdateWorkSpaceRequest, WorkspaceResponse } from '../apis/workspace/workspace.interface'
import { useWorkspaces } from '../hooks/use-workspace.hook'
import { useWorkspaceMembers } from '../hooks/use-workspace-member.hook'
import { useAppSelector } from '../redux/store.redux'

interface WorkspaceContextType {
    workspaces: WorkspaceResponse[]
    currentWorkspace: WorkspaceResponse | null
    currentMember: MemberResponse | null
    setCurrentWorkspace: (workspace: WorkspaceResponse) => void
    createWorkspace: (data: CreateWorkspaceRequest) => Promise<void>
    updateWorkspace: (workspaceId: string, data: UpdateWorkSpaceRequest) => Promise<void>
    isLoading: boolean
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { workspaces, isLoading, mutate } = useWorkspaces()
    const navigate = useNavigate()
    const { workspaceId } = useParams()
    const location = useLocation()
    const currentUser = useAppSelector((state) => state.account.user)

    const currentWorkspace = useMemo(() => {
        if (!workspaceId || !workspaces.length) return null
        return workspaces.find((ws) => ws.id === workspaceId) || null
    }, [workspaces, workspaceId])

    const { members } = useWorkspaceMembers(currentWorkspace?.id)

    const currentMember = useMemo(() => {
        if (!currentUser || !members.length) return null
        return members.find((m) => m.userId === currentUser.id) || null
    }, [members, currentUser])

    const setCurrentWorkspace = (workspace: WorkspaceResponse) => {
        localStorage.setItem('lastWorkspaceId', workspace.id)
        navigate(`/workspace/${workspace.id}`)
    }

    useEffect(() => {
        if (isLoading || workspaces.length === 0) return

        const isWorkspaceRoute = location.pathname.startsWith('/workspace')

        if (isWorkspaceRoute) {
            if (!workspaceId) {
                const lastId = localStorage.getItem('lastWorkspaceId')
                const targetWorkspace = workspaces.find(w => w.id === lastId) || workspaces[0]
                if (targetWorkspace) {
                    navigate(`/workspace/${targetWorkspace.id}`, { replace: true })
                }
            } else if (!currentWorkspace) {

                if (workspaces.length > 0) {
                    navigate(`/workspace/${workspaces[0].id}`, { replace: true })
                }
            }
        }
    }, [workspaces, workspaceId, isLoading, location.pathname, currentWorkspace, navigate])

    const createWorkspace = async (data: CreateWorkspaceRequest) => {
        try {
            const newWorkspace = await createWorkspaceApi(data)
            await mutate()
            setCurrentWorkspace(newWorkspace)
        } catch (error) {
            console.error('Lỗi khi tạo workspace:', error)
            throw error
        }
    }

    const updateWorkspace = async (workspaceId: string, data: UpdateWorkSpaceRequest) => {
        try {
            await updateWorkspaceApi(workspaceId, data)
            await mutate()
        } catch (error) {
            console.error('Lỗi khi cập nhật workspace:', error)
            throw error
        }
    }

    return (
        <WorkspaceContext.Provider value={{ workspaces, currentWorkspace, currentMember, setCurrentWorkspace, createWorkspace, updateWorkspace, isLoading }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext)
    if (context === undefined) {
        throw new Error('Lỗi khi sử dụng useWorkspace')
    }
    return context
}
