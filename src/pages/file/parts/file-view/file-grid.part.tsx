import { Grid } from '@mui/material'
import { FileResponse } from '../../../../apis/file/file.interface'
import { FileCard } from './file-card.item'

interface FileGridProps {
    files: FileResponse[]
    selectedItem: FileResponse | null
    onSelect: (file: FileResponse) => void
    onEdit: (file: FileResponse) => void
    onDelete: (file: FileResponse) => void
}

export const FileGrid = ({ files, selectedItem, onSelect, onEdit, onDelete }: FileGridProps) => {
    return (
        <Grid container spacing={3}>
            {files.map((file) => (
                <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3 }} key={file.id}>
                    <FileCard
                        file={file}
                        selected={selectedItem?.id === file.id}
                        onSelect={onSelect}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </Grid>
            ))}
        </Grid>
    )
}
