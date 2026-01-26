import { Box } from '@mui/material'
import { FileExplorerComponent } from '../file/parts/file-explorer.screen'

export const WorkspacePage = () => {

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
            <FileExplorerComponent />
        </Box>
    )
}
