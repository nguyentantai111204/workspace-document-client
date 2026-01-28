import { Box, CircularProgress } from '@mui/material'
import { FileExplorerComponent } from '../file/parts/file-explorer.screen'
import { EmptyWorkspaceState } from '../../components/workspace/empty-workspace-state.component'
import { useState } from 'react'
import { CreateWorkspaceDialog } from '../../components/workspace/create-workspace-dialog.component'
import { useWorkspaces } from '../../hooks/use-workspace.hook'

export const WorkspacePage = () => {
    const { workspaces, isLoading } = useWorkspaces()
    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'calc(100vh - 200px)',
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    if (workspaces.length === 0) {
        return (
            <>
                <EmptyWorkspaceState onCreateWorkspace={() => setCreateDialogOpen(true)} />
                <CreateWorkspaceDialog
                    open={createDialogOpen}
                    onClose={() => setCreateDialogOpen(false)}
                />
            </>
        )
    }

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
            <FileExplorerComponent />
        </Box>
    )
}
