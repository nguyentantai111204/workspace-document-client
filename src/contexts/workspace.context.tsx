import React, { createContext, useContext, useState, useEffect } from 'react'
import { WorkspaceResponse } from '../apis/workspace/workspace.interface'
import { useWorkspaces } from '../hooks/useWorkspaces'

interface WorkspaceContextType {
    workspaces: WorkspaceResponse[]
    currentWorkspace: WorkspaceResponse | null
    setCurrentWorkspace: (workspace: WorkspaceResponse) => void
    isLoading: boolean
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { workspaces, isLoading } = useWorkspaces()
    const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceResponse | null>(null)

    useEffect(() => {
        if (!currentWorkspace && workspaces.length > 0) {
            setCurrentWorkspace(workspaces[0])
        }
    }, [workspaces, currentWorkspace])

    return (
        <WorkspaceContext.Provider value={{ workspaces, currentWorkspace, setCurrentWorkspace, isLoading }}>
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
