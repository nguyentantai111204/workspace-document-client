import React, { createContext, useContext, useState, useEffect } from 'react'
import { WorkspaceResponse, CreateWorkspaceRequest } from '../apis/workspace/workspace.interface'
import { createWorkspaceApi } from '../apis/workspace/workspace.api'
import { useWorkspaces } from '../hooks/useWorkspaces'

interface WorkspaceContextType {
    workspaces: WorkspaceResponse[]
    currentWorkspace: WorkspaceResponse | null
    setCurrentWorkspace: (workspace: WorkspaceResponse) => void
    createWorkspace: (data: CreateWorkspaceRequest) => Promise<void>
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

    return (
        <WorkspaceContext.Provider value={{ workspaces, currentWorkspace, setCurrentWorkspace, createWorkspace, isLoading }}>
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
