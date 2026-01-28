import React, { createContext, useContext, useEffect, useState } from 'react'
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
    const [currentWorkspace, setCurrentWorkspaceState] = useState<WorkspaceResponse | null>(null)
    const navigate = useNavigate()
    const { workspaceId } = useParams()
    const location = useLocation()

    const setCurrentWorkspace = (workspace: WorkspaceResponse) => {
        setCurrentWorkspaceState(workspace)
        navigate(`/workspace/${workspace.id}`)
    }

    useEffect(() => {
        const isWorkspaceRoute = location.pathname.startsWith('/workspace')

        if (workspaces.length > 0 && isWorkspaceRoute) {
            if (workspaceId) {
                const found = workspaces.find((ws) => ws.id === workspaceId)
                if (found) {
                    if (!currentWorkspace || currentWorkspace.id !== found.id) {
                        setCurrentWorkspaceState(found)
                    }
                } else if (!isLoading) {
                    setCurrentWorkspace(workspaces[0])
                }
            } else if (!isLoading) {
                setCurrentWorkspace(workspaces[0])
            }
        }
    }, [workspaces, workspaceId, isLoading, location.pathname])

    useEffect(() => {
        if (currentWorkspace && workspaces.length > 0) {
            const updated = workspaces.find((ws) => ws.id === currentWorkspace.id)
            if (updated && JSON.stringify(updated) !== JSON.stringify(currentWorkspace)) {
                setCurrentWorkspaceState(updated)
            }
        }
    }, [workspaces])

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
            const updated = await updateWorkspaceApi(workspaceId, data)
            await mutate()
            if (currentWorkspace?.id === workspaceId) {
                setCurrentWorkspaceState({ ...currentWorkspace, ...updated })
            }
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
