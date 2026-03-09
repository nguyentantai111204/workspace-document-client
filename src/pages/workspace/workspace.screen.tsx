import { Box, CircularProgress } from '@mui/material'
import { FileExplorerComponent } from '../file/parts/file-explorer.screen'
import { EmptyWorkspaceState } from './parts/empty-workspace-state.part'
import { useState } from 'react'
import { CreateWorkspaceDialog } from './parts/create-workspace-dialog.part'
import { useWorkspaces } from '../../hooks/use-workspace.hook'
import { StackRowAlignCenterJustCenter } from '../../components/mui-custom/stack/stack.mui-custom'

export const WorkspacePage = () => {
    const { workspaces, isLoading } = useWorkspaces()
    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    if (isLoading) {
        return (
            <StackRowAlignCenterJustCenter
                sx={{
                    height: 'calc(100vh - 200px)',
                }}
            >
                <CircularProgress />
            </StackRowAlignCenterJustCenter>
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
