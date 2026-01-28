import React, { createContext, useContext, useState, useEffect } from 'react'
import { WorkspaceResponse, CreateWorkspaceRequest, UpdateWorkSpaceRequest } from '../apis/workspace/workspace.interface'
import { createWorkspaceApi, updateWorkspaceApi } from '../apis/workspace/workspace.api'
import { useWorkspaces } from '../hooks/useWorkspaces'

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
    const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceResponse | null>(null)

    useEffect(() => {
        if (!currentWorkspace && workspaces.length > 0) {
            setCurrentWorkspace(workspaces[0])
        }
    }, [workspaces, currentWorkspace])

    const createWorkspace = async (data: CreateWorkspaceRequest) => {
        try {
            const newWorkspace = await createWorkspaceApi(data)
            await mutate() // Refresh the list
            setCurrentWorkspace(newWorkspace)
        } catch (error) {
            console.error('Failed to create workspace:', error)
            throw error
        }
    }

    const updateWorkspace = async (workspaceId: string, data: UpdateWorkSpaceRequest) => {
        try {
            const updated = await updateWorkspaceApi(workspaceId, data)
            await mutate() // Refresh the list
            if (currentWorkspace?.id === workspaceId) {
                setCurrentWorkspace(updated)
            }
        } catch (error) {
            console.error('Failed to update workspace:', error)
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
        throw new Error('useWorkspace must be used within a WorkspaceProvider')
    }
    return context
}
