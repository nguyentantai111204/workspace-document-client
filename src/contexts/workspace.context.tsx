import React, { createContext, useContext, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createWorkspaceApi, updateWorkspaceApi } from '../apis/workspace/workspace.api'
import { CreateWorkspaceRequest, UpdateWorkSpaceRequest, WorkspaceResponse } from '../apis/workspace/workspace.interface'
import { useWorkspaces } from '../hooks/use-workspace.hook'

interface WorkspaceContextType {
    workspaces: WorkspaceResponse[]
    currentWorkspace: WorkspaceResponse | null
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

    const currentWorkspace = React.useMemo(() => {
        if (!workspaceId || !workspaces.length) return null
        return workspaces.find((ws) => ws.id === workspaceId) || null
    }, [workspaces, workspaceId])

    const setCurrentWorkspace = (workspace: WorkspaceResponse) => {
        localStorage.setItem('lastWorkspaceId', workspace.id)
        navigate(`/workspace/${workspace.id}`)
    }

    useEffect(() => {
        if (isLoading || workspaces.length === 0) return

        const isWorkspaceRoute = location.pathname.startsWith('/workspace')

        // precise match for /workspace or /workspace/ (root of workspace feature)
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
        <WorkspaceContext.Provider value={{ workspaces, currentWorkspace, setCurrentWorkspace, createWorkspace, updateWorkspace, isLoading }}>
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
