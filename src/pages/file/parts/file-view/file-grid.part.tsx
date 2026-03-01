import { Grid } from '@mui/material'
import { FileResponse } from '../../../../apis/file/file.interface'
import { FileCard } from './file-card.item'
import { FilePermissions } from '../../utils/file-permissions.util'

interface FileGridProps {
    files: FileResponse[]
    selectedItem: FileResponse | null
    permissions: FilePermissions
    onSelect: (file: FileResponse) => void
    onEdit: (file: FileResponse) => void
    onDelete: (file: FileResponse) => void
}

export const FileGrid = ({ files, selectedItem, permissions, onSelect, onEdit, onDelete }: FileGridProps) => {
    return (
        <Grid container spacing={3}>
            {files.map((file) => (
                <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3 }} key={file.id}>
                    <FileCard
                        file={file}
                        selected={selectedItem?.id === file.id}
                        permissions={permissions}
                        onSelect={onSelect}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </Grid>
            ))}
        </Grid>
    )
}
