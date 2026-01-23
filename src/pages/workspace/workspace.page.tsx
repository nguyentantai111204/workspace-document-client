import { Box } from '@mui/material'
import { FileExplorerComponent } from './parts/file-explorer/file-explorer.component'

export const WorkspacePage = () => {

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
            <FileExplorerComponent />
        </Box>
    )
}
